import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  getLandingPageBySlug,
  getOrderByOrderId,
  setLandingPageProBySlug,
  upsertPaidOrder,
} from "@/lib/db";

/**
 * Webhook pembayaran (Midtrans & Xendit) untuk upgrade landing page ke Pro.
 *
 * Konvensi order ID checkout: `ORDER-<userId>-<timestamp>`.
 * Format lama `pro-<slug>-<timestamp>` tetap didukung.
 *
 * KEAMANAN — slug TIDAK boleh diambil dari field yang tidak ditandatangani:
 * `signature_key` Midtrans hanya mencakup
 * `order_id + status_code + gross_amount + serverKey`. Field seperti
 * `custom_field1` (Midtrans) atau `metadata.slug` (Xendit) TIDAK ikut
 * ditandatangani, sehingga siapa pun yang memegang satu notifikasi
 * bertanda tangan sah bisa menulis ulang field itu untuk mengarahkan
 * upgrade ke halaman orang lain. Karena itu field-field tersebut
 * diabaikan sepenuhnya; target upgrade hanya boleh berasal dari
 * `order_id`/`external_id` yang terverifikasi, lalu dicocokkan dengan
 * baris `orders` di database. `orders.page_slug` (dicatat server saat
 * checkout oleh user terautentikasi) adalah sumber otoritatif.
 *
 * Env wajib (fail-closed: ditolak 401 bila belum di-set):
 * - MIDTRANS_SERVER_KEY  : verifikasi `signature_key` Midtrans
 * - XENDIT_CALLBACK_TOKEN: dicocokkan dengan header `x-callback-token`
 *
 * Env wajib (fail-closed: upgrade ditolak 503 bila kosong/tidak valid):
 * - PRO_PRICE_IDR : nominal minimal (rupiah) agar upgrade diproses.
 *   Tanpa nilai valid, cek nominal TIDAK boleh dilewati — transaksi
 *   ber-nominal sembarang akan menaikkan is_pro. Respons 503 membuat
 *   payment provider me-retry; order juga belum ditandai paid sehingga
 *   tidak ada state "paid tapi belum Pro" yang menggantung.
 */

// Status yang dianggap "pembayaran berhasil" (case-insensitive).
const PAID_STATUSES = new Set(["settlement", "capture", "success", "paid", "settled"]);

interface WebhookBody {
  // Midtrans
  order_id?: unknown;
  transaction_status?: unknown;
  fraud_status?: unknown;
  status_code?: unknown;
  gross_amount?: unknown;
  signature_key?: unknown;
  /**
   * TIDAK ditandatangani — SENGAJA DIABAIKAN saat menentukan target
   * upgrade. Lihat catatan keamanan di header file.
   */
  custom_field1?: unknown;
  // Xendit / generik
  external_id?: unknown;
  status?: unknown;
  id?: unknown;
  amount?: unknown;
  currency?: unknown;
  /**
   * TIDAK ditandatangani — SENGAJA DIABAIKAN saat menentukan target
   * upgrade. Lihat catatan keamanan di header file.
   */
  metadata?: unknown;
}

function asString(value: unknown): string {
  if (typeof value === "string") return value;
  // Midtrans/Xendit kadang kirim angka (status_code, gross_amount, amount).
  // String() eksplisit agar hash signature tidak jadi string kosong.
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return String(value);
  return "";
}

/**
 * [LEGACY] Ekstrak slug dari order ID lama `pro-<slug>[-<timestamp>]`.
 * Order baru `ORDER-<userId>-<timestamp>` tidak memuat slug; webhook
 * memakai `orders.page_slug` sebagai sumber otoritatif.
 * Mengembalikan null bila format tidak cocok.
 */
export function slugFromOrderId(orderId: string): string | null {
  const value = orderId.trim();
  if (!value.startsWith("pro-")) return null;
  const withoutPrefix = value.slice("pro-".length);
  // Buang suffix timestamp 13-digit (Date.now()) — hanya bila segmen terakhir
  // tepat 13 digit, agar slug legit berakhiran angka (cth ...-1234567890) aman.
  const idx = withoutPrefix.lastIndexOf("-");
  if (idx > 0) {
    const tail = withoutPrefix.slice(idx + 1);
    if (/^\d{13}$/.test(tail)) {
      const base = withoutPrefix.slice(0, idx);
      return base || null;
    }
  }
  return withoutPrefix || null;
}

function verifyMidtransSignature(body: WebhookBody): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  // Fail-closed: tanpa secret, semua callback ditolak.
  if (!serverKey) return false;
  const expected = createHash("sha512")
    .update(
      `${asString(body.order_id)}${asString(body.status_code)}${asString(
        body.gross_amount
      )}${serverKey}`
    )
    .digest("hex");
  const actual = asString(body.signature_key);
  if (expected.length !== actual.length || actual === "") return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
}

function verifyXenditToken(req: Request): boolean {
  const token = process.env.XENDIT_CALLBACK_TOKEN;
  // Fail-closed: tanpa token, semua callback ditolak.
  if (!token) return false;
  return req.headers.get("x-callback-token") === token;
}

/** Ambil nominal dari payload (Midtrans gross_amount / Xendit amount). */
function parseAmount(body: WebhookBody): number | null {
  const raw = body.gross_amount ?? body.amount;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    // Normalisasi format ID ("49.000", "Rp 49.000,00") dan EN ("49000.00"):
    // hapus pemisah ribuan, ubah koma desimal jadi titik.
    const cleaned = raw.replace(/[^0-9.,]/g, "");
    if (!cleaned) return null;
    let normalized = cleaned;
    if (cleaned.includes(",") && cleaned.includes(".")) {
      // "1.234,56" (ID) -> "1234.56" ; "1,234.56" (EN) -> "1234.56"
      const lastComma = cleaned.lastIndexOf(",");
      const lastDot = cleaned.lastIndexOf(".");
      normalized =
        lastComma > lastDot
          ? cleaned.replace(/\./g, "").replace(",", ".")
          : cleaned.replace(/,/g, "");
    } else if (cleaned.includes(",")) {
      // "49000,00" -> "49000.00"
      normalized = cleaned.replace(/\./g, "").replace(",", ".");
    } else if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) {
      // "49.000" (ribuan ID tanpa desimal) -> "49000"
      normalized = cleaned.replace(/\./g, "");
    }
    const n = parseFloat(normalized);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export async function POST(req: Request) {
  let body: WebhookBody;
  try {
    body = (await req.json()) as WebhookBody;
  } catch {
    return NextResponse.json({ error: "Body harus JSON" }, { status: 400 });
  }

  const isMidtrans =
    body.transaction_status !== undefined || body.order_id !== undefined;
  const isXendit =
    !isMidtrans &&
    (body.external_id !== undefined ||
      req.headers.get("x-callback-token") !== null);

  if (isMidtrans && !verifyMidtransSignature(body)) {
    const configured = !!process.env.MIDTRANS_SERVER_KEY;
    return NextResponse.json(
      {
        error: configured
          ? "Signature tidak valid"
          : "MIDTRANS_SERVER_KEY belum dikonfigurasi",
      },
      { status: 401 }
    );
  }
  if (isXendit && !verifyXenditToken(req)) {
    const configured = !!process.env.XENDIT_CALLBACK_TOKEN;
    return NextResponse.json(
      {
        error: configured
          ? "Callback token tidak valid"
          : "XENDIT_CALLBACK_TOKEN belum dikonfigurasi",
      },
      { status: 401 }
    );
  }

  const rawStatus = (
    asString(body.transaction_status) || asString(body.status)
  ).toLowerCase();

  // Midtrans kartu kredit: hanya hitung jika fraud_status = accept.
  if (
    rawStatus === "capture" &&
    body.fraud_status !== undefined &&
    asString(body.fraud_status).toLowerCase() !== "accept"
  ) {
    return NextResponse.json({ ok: true, ignored: "fraud challenge" });
  }

  if (!PAID_STATUSES.has(rawStatus)) {
    // Status non-final (pending/expire/cancel/dll): akui agar retry berhenti.
    return NextResponse.json({ ok: true, ignored: rawStatus || "no-status" });
  }

  // Target upgrade HANYA boleh berasal dari order_id/external_id yang
  // sudah melewati verifikasi signature (Midtrans) / callback token
  // (Xendit) di atas.
  //
  // `custom_field1` dan `metadata.slug` SENGAJA DIABAIKAN: keduanya tidak
  // ikut ditandatangani, sehingga menjadi vektor untuk mengarahkan
  // upgrade ke halaman milik orang lain.
  const orderId = asString(body.order_id) || asString(body.external_id);
  if (!orderId) {
    return NextResponse.json(
      { error: "order_id/external_id wajib diisi" },
      { status: 400 }
    );
  }

  // Baris `orders` dicatat saat checkout dan tidak pernah diubah oleh
  // upsertPaidOrder (ON CONFLICT hanya menyentuh status/updated_at),
  // sehingga `page_slug` di sini adalah catatan otoritatif.
  const orderRow = await getOrderByOrderId(orderId);
  if (!orderRow) {
    console.error(
      `[payment-webhook] order ${orderId} tidak ditemukan di database — upgrade ditolak`
    );
    return NextResponse.json(
      { error: "Order tidak ditemukan" },
      { status: 404 }
    );
  }

  const slug = orderRow.page_slug;

  // Kompatibilitas order lama: bila order_id masih memuat slug, pastikan
  // cocok dengan baris database. Order baru tidak memuat slug (null).
  const legacySlug = slugFromOrderId(orderId);
  if (legacySlug && legacySlug !== slug) {
    console.error(
      `[payment-webhook] order ${orderId} page_slug '${slug}' tidak cocok dengan slug dari order_id '${legacySlug}' — upgrade ditolak`
    );
    return NextResponse.json(
      { error: "Order tidak cocok dengan halaman yang dituju" },
      { status: 400 }
    );
  }

  const page = await getLandingPageBySlug(slug);
  if (!page) {
    return NextResponse.json(
      { error: `Landing page '${slug}' tidak ditemukan` },
      { status: 404 }
    );
  }

  // Harga minimum Pro WAJIB valid sebelum upgrade diproses.
  //
  // FAIL-CLOSED: tanpa harga yang valid kita tidak bisa memverifikasi
  // nominal. Versi sebelumnya hanya memberi peringatan dan MENERUSKAN
  // upgrade — sehingga transaksi ber-nominal sembarang (mis. 1 rupiah)
  // bisa menaikkan is_pro. Sekarang konfigurasi rusak = upgrade ditolak
  // dengan 503 agar payment provider me-retry, dan order belum ditandai
  // paid (dicek SEBELUM upsertPaidOrder) sehingga tidak ada state
  // "paid tapi belum Pro" yang menggantung.
  const rawPrice = process.env.PRO_PRICE_IDR;
  const expectedPrice = rawPrice ? parseFloat(rawPrice) : Number.NaN;
  if (!Number.isFinite(expectedPrice) || expectedPrice <= 0) {
    console.error(
      `[payment-webhook] PRO_PRICE_IDR tidak valid — upgrade PRO untuk slug '${slug}' (order ${orderId}) DITOLAK. Perbaiki env lalu biarkan provider retry, atau aktifkan Pro manual dari panel admin.`
    );
    return NextResponse.json(
      { error: "Konfigurasi harga belum valid" },
      { status: 503 }
    );
  }

  // Tolak pembayaran kurang bayar.
  const amount = parseAmount(body);
  if (amount === null || amount < expectedPrice) {
    return NextResponse.json(
      { error: "Nominal pembayaran tidak mencukupi" },
      { status: 402 }
    );
  }

  const provider = isMidtrans ? "midtrans" : isXendit ? "xendit" : "generic";
  let order;
  try {
    order = await upsertPaidOrder({
      order_id: orderId,
      page_slug: slug,
      amount: amount ?? 0,
      currency: asString(body.currency) || "IDR",
      provider,
      rawPayload: body as Record<string, unknown>,
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mencatat order" },
      { status: 500 }
    );
  }

  try {
    const updated = await setLandingPageProBySlug(slug, true);
    if (!updated) {
      // Order paid tercatat, tapi halaman hilang di tengah jalan.
      console.error(
        `[payment-webhook] order ${orderId} paid namun slug '${slug}' tidak ditemukan saat upgrade`
      );
      return NextResponse.json(
        { error: `Landing page '${slug}' tidak ditemukan`, order_id: order.order_id },
        { status: 404 }
      );
    }
  } catch {
    // INKONSISTENSI: order paid tapi is_pro gagal — kembalikan 500 agar
    // provider me-retry webhook (idempoten via ON CONFLICT order_id).
    console.error(
      `[payment-webhook] gagal upgrade PRO slug '${slug}' untuk order ${orderId}`
    );
    return NextResponse.json(
      { error: "Gagal mengaktifkan PRO, webhook akan dicoba ulang" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    slug,
    is_pro: true,
    order_id: order.order_id,
  });
}

export async function GET() {
  return NextResponse.json(
    { error: "Gunakan POST untuk callback pembayaran" },
    { status: 405 }
  );
}

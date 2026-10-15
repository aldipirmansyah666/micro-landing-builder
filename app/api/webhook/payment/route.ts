import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  getLandingPageBySlug,
  setLandingPageProBySlug,
  upsertPaidOrder,
} from "@/lib/db";

/**
 * Webhook pembayaran (Midtrans & Xendit) untuk upgrade landing page ke Pro.
 *
 * Konvensi order ID yang didukung: `pro-<slug>` atau `pro-<slug>-<timestamp>`
 * (cth: `pro-andi-sinta-1730000000000`), atau sertakan slug lewat metadata:
 * Midtrans `custom_field1` / Xendit `metadata.slug`.
 *
 * Env wajib (fail-closed: ditolak 401 bila belum di-set):
 * - MIDTRANS_SERVER_KEY  : verifikasi `signature_key` Midtrans
 * - XENDIT_CALLBACK_TOKEN: dicocokkan dengan header `x-callback-token`
 *
 * Env opsional:
 * - PRO_PRICE_IDR : nominal minimal (rupiah) agar upgrade diproses.
 *   Bila tidak di-set, cek nominal dilewati dengan peringatan di log.
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
  custom_field1?: unknown;
  // Xendit / generik
  external_id?: unknown;
  status?: unknown;
  id?: unknown;
  amount?: unknown;
  currency?: unknown;
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

/** Ambil slug dari metadata/custom field bila tersedia. */
function slugFromMetadata(body: WebhookBody): string {
  const custom = asString(body.custom_field1).trim();
  if (custom) return custom;
  if (body.metadata && typeof body.metadata === "object") {
    const slug = asString(
      (body.metadata as Record<string, unknown>).slug
    ).trim();
    if (slug) return slug;
  }
  return "";
}

/**
 * Ekstrak slug dari order ID `pro-<slug>[-<timestamp>]`.
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

  const slug =
    slugFromMetadata(body) ||
    slugFromOrderId(asString(body.order_id) || asString(body.external_id)) ||
    "";

  if (!slug) {
    return NextResponse.json(
      { error: "Slug tidak ditemukan di order_id/metadata" },
      { status: 400 }
    );
  }

  const orderId = asString(body.order_id) || asString(body.external_id);
  if (!orderId) {
    return NextResponse.json(
      { error: "order_id/external_id wajib diisi" },
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

  // Tolak pembayaran kurang bayar bila harga Pro dikonfigurasi.
  const expectedPrice = process.env.PRO_PRICE_IDR
    ? parseFloat(process.env.PRO_PRICE_IDR)
    : null;
  const amount = parseAmount(body);
  if (
    expectedPrice !== null &&
    Number.isFinite(expectedPrice) &&
    (amount === null || amount < expectedPrice)
  ) {
    return NextResponse.json(
      { error: "Nominal pembayaran tidak mencukupi" },
      { status: 402 }
    );
  }
  if (expectedPrice === null || !Number.isFinite(expectedPrice)) {
    console.warn(
      "[payment-webhook] PRO_PRICE_IDR belum di-set, cek nominal dilewati"
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

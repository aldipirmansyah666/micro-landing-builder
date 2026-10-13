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
  return typeof value === "string" ? value : "";
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
  // Buang suffix timestamp opsional: `-` + 10-13 digit di akhir.
  const withoutTimestamp = withoutPrefix.replace(/-\d{10,13}$/, "");
  return withoutTimestamp || null;
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
    const n = parseFloat(raw.replace(/[^0-9.]/g, ""));
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
  const order = await upsertPaidOrder({
    order_id: orderId,
    page_slug: slug,
    amount: amount ?? 0,
    currency: asString(body.currency) || "IDR",
    provider,
    rawPayload: body as Record<string, unknown>,
  });

  await setLandingPageProBySlug(slug, true);

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

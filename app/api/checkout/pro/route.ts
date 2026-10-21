import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  createPendingOrder,
  getLandingPageBasicByUserAndSlug,
  isAdmin,
} from "@/lib/db";
import { hasProAccess } from "@/lib/entitlements";

type Provider = "midtrans" | "xendit";

/** Host loopback yang diizinkan sebagai fallback development. */
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

/**
 * Baca env var secara DINAMIS (nama lewat variabel), bukan literal
 * `process.env.NEXT_PUBLIC_X`.
 *
 * Alasannya: Next.js meng-inline nilai `NEXT_PUBLIC_*` saat build. Pada
 * deployment Cloudflare/OpenNext env hanya tersedia saat RUNTIME, sehingga
 * nilai yang ter-inline bisa `undefined`. Akses dinamis memastikan env
 * dibaca saat request benar-benar datang.
 */
function envValue(name: string): string | undefined {
  const value = (process.env as Record<string, string | undefined>)[name];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

/**
 * Origin aplikasi yang TEERPERCAYA untuk URL redirect pembayaran.
 *
 * KESALAHAN YANG DIHINDARI: mengambil origin dari `new URL(req.url).origin`
 * berarti mengambilnya dari header `Host` — yang bisa dipalsukan klien.
 * Kalau header itu ikut dikendalikan penyerang, `callbacks.finish` /
 * `success_redirect_url` akan mengarah ke domain penyerang: pengguna
 * membayar, lalu diarahkan ke halaman palsu (phishing di tengah alur
 * pembayaran, tanpa satu pun interact dengan server kita).
 *
 * Sumber yang sah hanya env:
 * - `NEXT_PUBLIC_APP_URL` (utama, sesuai konvensi project)
 * - `APP_URL` (alias runtime-safe untuk Cloudflare/OpenNext, di mana
 *   variabel `NEXT_PUBLIC_*` umumnya hanya tersedia saat build)
 *
 * Fallback HANYA untuk development lokal dan HANYA ke loopback.
 */
function appOrigin(req: Request): string {
  const configured = envValue("NEXT_PUBLIC_APP_URL") ?? envValue("APP_URL");
  if (configured) {
    let parsed: URL;
    try {
      parsed = new URL(configured);
    } catch {
      throw new Error("NEXT_PUBLIC_APP_URL bukan URL yang valid");
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error("NEXT_PUBLIC_APP_URL harus memakai http atau https");
    }
    // `origin` menormalisasi: membuang path, query, dan trailing slash.
    return parsed.origin;
  }

  // Tanpa env: hanya development lokal yang boleh jalan, dan hanya ke
  // loopback. Di luar development → gagal (fail-closed).
  if (process.env.NODE_ENV === "development") {
    try {
      const requestUrl = new URL(req.url);
      if (LOOPBACK_HOSTS.has(requestUrl.hostname)) return requestUrl.origin;
    } catch {
      // abaikan — jatuh ke default loopback di bawah
    }
    return "http://localhost:3000";
  }

  throw new Error("NEXT_PUBLIC_APP_URL belum dikonfigurasi");
}

function proPrice(): number | null {
  const raw = process.env.PRO_PRICE_IDR;
  if (!raw) return null;
  const n = parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

function detectProvider(): Provider | null {
  if (process.env.MIDTRANS_SERVER_KEY) return "midtrans";
  if (process.env.XENDIT_SECRET_KEY) return "xendit";
  return null;
}

function basicAuth(secret: string): string {
  // Auth WAJIB Midtrans: "Basic " + base64("<ServerKey>:") — titik dua
  // di akhir SEBELUM di-encode; tanpanya API menjawab 401.
  return `Basic ${Buffer.from(`${secret.trim()}:`).toString("base64")}`;
}

/**
 * Base URL Snap: override eksplisit > flag produksi > sandbox.
 * Ketidakcocokan environment adalah penyebab 401 paling umum
 * (mis. key produksi dipakai ke sandbox), jadi dipetakan eksplisit.
 */
function midtransBase(): string {
  const override = process.env.MIDTRANS_API_BASE_URL?.trim();
  if (override) return override.replace(/\/+$/, "");
  return process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com"
    : "https://app.sandbox.midtrans.com";
}

/**
 * Validasi awal agar salah environment gagal cepat dengan pesan jelas,
 * bukan 401 buram dari Midtrans.
 */
function midtransKeyError(key: string, base: string): string | null {
  const sandbox = base.includes("sandbox");
  const isSandboxKey = key.startsWith("SB-Mid-server-");
  const isProdKey = key.startsWith("Mid-server-");
  if (!isSandboxKey && !isProdKey) {
    return (
      "Format MIDTRANS_SERVER_KEY tidak dikenali " +
      "(sandbox: SB-Mid-server-…, produksi: Mid-server-…). " +
      "Jangan pakai Client Key (SB-Mid-client-…)."
    );
  }
  if (sandbox && isProdKey) {
    return "Server Key produksi dipakai ke endpoint sandbox — set MIDTRANS_IS_PRODUCTION=true atau pakai key SB-Mid-server-…";
  }
  if (!sandbox && isSandboxKey) {
    return "Server Key sandbox dipakai ke endpoint produksi — set MIDTRANS_IS_PRODUCTION=false atau pakai key Mid-server-…";
  }
  return null;
}

/** Info harga & provider untuk modal upgrade (tidak butuh login). */
export async function GET() {
  const provider = detectProvider();
  return NextResponse.json({
    price_idr: proPrice(),
    currency: "IDR",
    provider,
    configured: provider !== null && proPrice() !== null,
  });
}

async function createMidtransTransaction(input: {
  orderId: string;
  amount: number;
  slug: string;
  email?: string;
  origin: string;
}): Promise<{ payment_url: string; snap_token?: string }> {
  const serverKey = (process.env.MIDTRANS_SERVER_KEY as string).trim();
  const base = midtransBase();
  const keyError = midtransKeyError(serverKey, base);
  if (keyError) throw new Error(keyError);
  const res = await fetch(`${base}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuth(serverKey),
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: input.orderId,
        gross_amount: input.amount,
      },
      item_details: [
        {
          id: "pro-upgrade",
          price: input.amount,
          quantity: 1,
          name: `Upgrade PRO - ${input.slug}`,
        },
      ],
      customer_details: input.email ? { email: input.email } : undefined,
      callbacks: { finish: `${input.origin}/dashboard` },
    }),
  });
  if (!res.ok) {
    // Sertakan pesan asli Midtrans (terpotong) agar 401/4xx bisa didiagnosis
    // tanpa menebak — body error tidak mengandung secret.
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Midtrans menolak transaksi (HTTP ${res.status})${detail ? `: ${detail.slice(0, 300)}` : ""}`
    );
  }
  const data = (await res.json()) as {
    token?: string;
    redirect_url?: string;
  };
  if (!data.redirect_url) throw new Error("Midtrans tidak mengembalikan redirect_url");
  return { payment_url: data.redirect_url, snap_token: data.token };
}

async function createXenditInvoice(input: {
  orderId: string;
  amount: number;
  slug: string;
  email?: string;
  origin: string;
}): Promise<{ payment_url: string }> {
  const secret = process.env.XENDIT_SECRET_KEY as string;
  const base = process.env.XENDIT_API_BASE_URL ?? "https://api.xendit.co";
  const res = await fetch(`${base}/v2/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuth(secret),
    },
    body: JSON.stringify({
      external_id: input.orderId,
      amount: input.amount,
      currency: "IDR",
      description: `Upgrade PRO - ${input.slug}`,
      customer: input.email ? { email: input.email } : undefined,
      success_redirect_url: `${input.origin}/dashboard?upgraded=${encodeURIComponent(input.slug)}`,
      failure_redirect_url: `${input.origin}/dashboard`,
    }),
  });
  if (!res.ok) {
    throw new Error(`Xendit menolak invoice (HTTP ${res.status})`);
  }
  const data = (await res.json()) as { invoice_url?: string };
  if (!data.invoice_url) throw new Error("Xendit tidak mengembalikan invoice_url");
  return { payment_url: data.invoice_url };
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let slug = "";
  try {
    const body = (await req.json()) as { slug?: unknown };
    if (typeof body.slug === "string") slug = body.slug.trim();
  } catch {
    return NextResponse.json({ error: "Body harus JSON" }, { status: 400 });
  }
  if (!slug) {
    return NextResponse.json({ error: "Slug wajib diisi" }, { status: 400 });
  }

  const page = await getLandingPageBasicByUserAndSlug(userId, slug);
  if (!page) {
    return NextResponse.json(
      { error: "Landing page tidak ditemukan" },
      { status: 404 }
    );
  }
  if (page.is_pro) {
    return NextResponse.json({ ok: true, alreadyPro: true, slug });
  }

  // Surel diambil dari Clerk (authoritative), bukan dari body request —
  // dipakai untuk pengecekan PRO_BYPASS_EMAILS.
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? null;

  // Admin & surel yang terdaftar di PRO_BYPASS_EMAILS sudah punya akses
  // Pro penuh — tanpa pembayaran.
  if (
    hasProAccess({
      isPro: false,
      isAdmin: await isAdmin(userId),
      email,
    })
  ) {
    return NextResponse.json({ ok: true, alreadyPro: true, slug });
  }

  const amount = proPrice();
  const provider = detectProvider();
  if (amount === null || !provider) {
    return NextResponse.json(
      {
        error:
          "Pembayaran belum dikonfigurasi (PRO_PRICE_IDR + MIDTRANS_SERVER_KEY/XENDIT_SECRET_KEY)",
      },
      { status: 501 }
    );
  }

  // Origin redirect harus berasal dari env tepercaya, bukan header Host.
  // Dicek SEBELUM order pending dibuat supaya tidak ada order menggantung
  // yang tak pernah bisa dibayar.
  let origin: string;
  try {
    origin = appOrigin(req);
  } catch (error) {
    console.error("[checkout] konfigurasi origin tidak valid", error);
    return NextResponse.json(
      {
        error:
          "Layanan pembayaran sedang tidak tersedia. Silakan coba lagi nanti.",
      },
      { status: 503 }
    );
  }

  const orderId = `pro-${slug}-${Date.now()}`;

  await createPendingOrder({
    order_id: orderId,
    page_slug: slug,
    amount,
    provider,
  });

  try {
    // `email` boleh null (user tanpa surel) — provider opsional 이를.
    const customerEmail = email ?? undefined;
    const tx =
      provider === "midtrans"
        ? await createMidtransTransaction({
            orderId,
            amount,
            slug,
            email: customerEmail,
            origin,
          })
        : await createXenditInvoice({
            orderId,
            amount,
            slug,
            email: customerEmail,
            origin,
          });
    return NextResponse.json({
      ok: true,
      order_id: orderId,
      provider,
      amount,
      ...tx,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Gagal membuat transaksi",
      },
      { status: 502 }
    );
  }
}

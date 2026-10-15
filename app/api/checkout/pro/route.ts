import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  createPendingOrder,
  getLandingPageBasicByUserAndSlug,
  isAdmin,
} from "@/lib/db";
import { hasProAccess } from "@/lib/entitlements";

type Provider = "midtrans" | "xendit";

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
  // Web-standard base64 (Worker-compatible, tanpa Node Buffer).
  return `Basic ${btoa(`${secret}:`)}`;
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
  const serverKey = process.env.MIDTRANS_SERVER_KEY as string;
  const base =
    process.env.MIDTRANS_API_BASE_URL ?? "https://app.sandbox.midtrans.com";
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
    throw new Error(`Midtrans menolak transaksi (HTTP ${res.status})`);
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
      success_redirect_url: `${input.origin}/dashboard?upgraded=${input.slug}`,
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

  // Admin & development/lokal sudah punya akses Pro penuh — tanpa pembayaran.
  if (hasProAccess({ isPro: false, isAdmin: await isAdmin(userId) })) {
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

  const orderId = `pro-${slug}-${Date.now()}`;
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  const origin = new URL(req.url).origin;

  await createPendingOrder({
    order_id: orderId,
    page_slug: slug,
    amount,
    provider,
  });

  try {
    const tx =
      provider === "midtrans"
        ? await createMidtransTransaction({
            orderId,
            amount,
            slug,
            email,
            origin,
          })
        : await createXenditInvoice({ orderId, amount, slug, email, origin });
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

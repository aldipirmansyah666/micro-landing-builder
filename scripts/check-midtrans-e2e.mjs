import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

const CLERK_API = "https://api.clerk.com/v1";
const PORT = 4110 + (process.pid % 150);
const BASE = `http://127.0.0.1:${PORT}`;
const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const slug = `e2e-midtrans-${suffix}`;
const decoySlug = `${slug}-decoy`;
const email = `e2e-midtrans-${suffix}@example.com`;

let failures = 0;
let sql;
let server;
let clerkUser;
let orderId;

function env(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} belum di-set`);
  return value;
}

function check(name, condition, detail = "") {
  if (condition) {
    console.log(`OK   ${name}`);
    return true;
  }
  failures += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  return false;
}

function signature(order, statusCode, grossAmount) {
  return createHash("sha512")
    .update(`${order}${statusCode}${grossAmount}${env("MIDTRANS_SERVER_KEY")}`)
    .digest("hex");
}

async function clerk(path, init = {}) {
  const res = await fetch(`${CLERK_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env("CLERK_SECRET_KEY")}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Clerk ${path} gagal (HTTP ${res.status})`);
  }
  return data;
}

async function waitForServer(timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/`, { redirect: "manual" });
      if (res.status > 0) return true;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

async function postWebhook(body) {
  const res = await fetch(`${BASE}/api/webhook/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

async function main() {
  const sandboxKey = env("MIDTRANS_SERVER_KEY");
  if (process.env.MIDTRANS_IS_PRODUCTION === "true") {
    throw new Error("E2E menolak berjalan dengan MIDTRANS_IS_PRODUCTION=true");
  }
  if (!sandboxKey.startsWith("SB-Mid-server-")) {
    throw new Error("E2E hanya menerima MIDTRANS_SERVER_KEY sandbox (SB-Mid-server-…)");
  }
  const apiOverride = process.env.MIDTRANS_API_BASE_URL?.trim();
  if (apiOverride && !apiOverride.includes("sandbox")) {
    throw new Error("E2E menolak MIDTRANS_API_BASE_URL non-sandbox");
  }
  if (!existsSync(".next")) {
    throw new Error("Folder .next belum ada — jalankan `npm run build` dulu");
  }

  const price = Number(env("PRO_PRICE_IDR"));
  const gross = price.toFixed(2);
  env("DATABASE_URL");
  env("CLERK_SECRET_KEY");

  clerkUser = await clerk("/users", {
    method: "POST",
    body: JSON.stringify({
      email_address: [email],
      first_name: "E2E",
      last_name: "Midtrans",
      skip_password_requirement: true,
    }),
  });

  const session = await clerk("/sessions", {
    method: "POST",
    body: JSON.stringify({ user_id: clerkUser.id }),
  });
  const token = await clerk(`/sessions/${session.id}/tokens`, { method: "POST" });
  const authorization = `Bearer ${token.jwt}`;

  sql = postgres(env("DATABASE_URL"), { max: 1, prepare: false });
  await sql`
    INSERT INTO users (id, clerk_id, email, role)
    VALUES (${`e2e-${suffix}`}, ${clerkUser.id}, ${email}, 'user');
  `;
  await sql`
    INSERT INTO landing_pages (user_id, title, slug, template_type, content_json, is_pro)
    VALUES (${clerkUser.id}, 'E2E Midtrans', ${slug}, 'aruna', '{}'::jsonb, FALSE);
  `;

  const nextBin = join("node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "start", "--port", String(PORT)], {
    stdio: "ignore",
  });

  if (!(await waitForServer())) {
    throw new Error("Server Next.js tidak siap");
  }

  const infoRes = await fetch(`${BASE}/api/checkout/pro`);
  const info = await infoRes.json();
  check("GET checkout info 200", infoRes.status === 200, `HTTP ${infoRes.status}`);
  check("provider Midtrans", info.provider === "midtrans", String(info.provider));
  check("harga sesuai PRO_PRICE_IDR", info.price_idr === price, String(info.price_idr));
  check("pembayaran terkonfigurasi", info.configured === true);
  check(
    "Client Key tersedia",
    typeof info.client_key === "string" && info.client_key.startsWith("SB-Mid-client-")
  );
  check(
    "Snap sandbox",
    typeof info.snap_script_url === "string" &&
      info.snap_script_url.includes("app.sandbox.midtrans.com")
  );

  const authHeaders = {
    Authorization: authorization,
    "Content-Type": "application/json",
    Origin: BASE,
    Referer: `${BASE}/dashboard`,
  };

  const unauthorized = await fetch(`${BASE}/api/checkout/pro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug }),
  });
  check("checkout tanpa auth 401", unauthorized.status === 401, `HTTP ${unauthorized.status}`);

  const missingSlug = await fetch(`${BASE}/api/checkout/pro`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({}),
  });
  check("checkout tanpa slug 400", missingSlug.status === 400, `HTTP ${missingSlug.status}`);

  const checkoutRes = await fetch(`${BASE}/api/checkout/pro`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ slug }),
  });
  const checkout = await checkoutRes.json();
  if (checkoutRes.status !== 200) {
    throw new Error(
      `checkout gagal (HTTP ${checkoutRes.status}): ${checkout.error ?? "tanpa pesan"}`
    );
  }
  orderId = checkout.order_id;
  check("checkout Midtrans 200", true);
  check("order ID baru", typeof orderId === "string" && orderId.startsWith("ORDER-"));
  check("nominal checkout", checkout.amount === price, String(checkout.amount));
  check("Snap token", typeof checkout.snap_token === "string" && checkout.snap_token.length > 10);
  check(
    "redirect Snap sandbox",
    typeof checkout.payment_url === "string" &&
      checkout.payment_url.startsWith("https://app.sandbox.midtrans.com/")
  );

  const form = {
    order_id: orderId,
    status_code: "200",
    gross_amount: gross,
    currency: "IDR",
    transaction_status: "settlement",
    transaction_id: `e2e-${suffix}`,
    payment_type: "bank_transfer",
    fraud_status: "accept",
    custom_field1: decoySlug,
    metadata: { slug: decoySlug },
  };

  const badSig = await postWebhook({ ...form, signature_key: "deadbeef" });
  check("signature salah 401", badSig.res.status === 401, `HTTP ${badSig.res.status}`);

  const lowAmount = "1.00";
  const low = await postWebhook({
    ...form,
    gross_amount: lowAmount,
    signature_key: signature(orderId, "200", lowAmount),
  });
  check("nominal kurang 402", low.res.status === 402, `HTTP ${low.res.status}`);

  const unknownOrder = `ORDER-e2e-unknown-${suffix}`;
  const unknown = await postWebhook({
    ...form,
    order_id: unknownOrder,
    signature_key: signature(unknownOrder, "200", gross),
  });
  check("order tidak dikenal 404", unknown.res.status === 404, `HTTP ${unknown.res.status}`);

  const pending = await postWebhook({
    ...form,
    transaction_status: "pending",
    signature_key: signature(orderId, "200", gross),
  });
  check("status pending diabaikan", pending.res.status === 200 && pending.data.ignored === "pending");

  const challenge = await postWebhook({
    ...form,
    transaction_status: "capture",
    fraud_status: "challenge",
    signature_key: signature(orderId, "200", gross),
  });
  check(
    "fraud challenge diabaikan",
    challenge.res.status === 200 && challenge.data.ignored === "fraud challenge"
  );

  const paidBody = {
    ...form,
    signature_key: signature(orderId, "200", gross),
  };
  const paid = await postWebhook(paidBody);
  check("settlement 200", paid.res.status === 200, `HTTP ${paid.res.status}`);
  check("slug dari order DB", paid.data.slug === slug, String(paid.data.slug));
  check("PRO aktif", paid.data.is_pro === true);

  const pageRows = await sql`
    SELECT is_pro FROM landing_pages WHERE slug = ${slug} LIMIT 1;
  `;
  check("landing_pages.is_pro = true", pageRows[0]?.is_pro === true);

  const orderRows = await sql`
    SELECT status, amount, provider FROM orders WHERE order_id = ${orderId};
  `;
  check("order paid", orderRows[0]?.status === "paid", String(orderRows[0]?.status));
  check("order amount", orderRows[0]?.amount === price, String(orderRows[0]?.amount));
  check("order provider", orderRows[0]?.provider === "midtrans", String(orderRows[0]?.provider));

  const repeated = await postWebhook(paidBody);
  const counts = await sql`
    SELECT COUNT(*)::int AS count FROM orders WHERE order_id = ${orderId};
  `;
  check("settlement ulang idempoten", repeated.res.status === 200 && counts[0].count === 1);

  const decoy = await sql`
    SELECT COUNT(*)::int AS count FROM landing_pages WHERE slug = ${decoySlug};
  `;
  check("custom_field1/metadata diabaikan", decoy[0].count === 0);

  const userRes = await fetch(`${BASE}/api/user?slug=${encodeURIComponent(slug)}`, {
    headers: authHeaders,
  });
  const user = await userRes.json();
  check("GET /api/user 200", userRes.status === 200, `HTTP ${userRes.status}`);
  check("polling status PRO", user.is_pro === true);

  const already = await fetch(`${BASE}/api/checkout/pro`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ slug }),
  });
  const alreadyData = await already.json();
  check(
    "checkout ulang alreadyPro",
    already.status === 200 && alreadyData.alreadyPro === true
  );

  const webhookGet = await fetch(`${BASE}/api/webhook/payment`);
  check("GET webhook 405", webhookGet.status === 405, `HTTP ${webhookGet.status}`);
}

async function cleanup() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
  if (orderId && serverKey) {
    const base = process.env.MIDTRANS_IS_PRODUCTION === "true"
      ? "https://api.midtrans.com"
      : "https://api.sandbox.midtrans.com";
    await fetch(`${base}/v2/${orderId}/expire`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
      },
    }).catch(() => {});
  }
  if (sql) {
    if (slug) {
      await sql`DELETE FROM landing_pages WHERE slug = ${slug};`.catch(() => {});
    }
    if (clerkUser?.id) {
      await sql`DELETE FROM users WHERE clerk_id = ${clerkUser.id};`.catch(() => {});
    }
    await sql.end().catch(() => {});
  }
  if (clerkUser?.id) {
    await fetch(`${CLERK_API}/users/${clerkUser.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${env("CLERK_SECRET_KEY")}` },
    }).catch(() => {});
  }
  if (server) {
    server.kill("SIGTERM");
  }
}

try {
  await main();
} catch (error) {
  failures += 1;
  console.error(`FATAL ${error instanceof Error ? error.message : String(error)}`);
} finally {
  await cleanup();
}

console.log(
  failures === 0
    ? "E2E Midtrans sandbox: LULUS"
    : `E2E Midtrans sandbox: ${failures} kegagalan`
);
process.exit(failures === 0 ? 0 : 1);

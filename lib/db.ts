import postgres from "postgres";
import type { Sql } from "postgres";

type SqlClient = Sql<Record<string, never>>;

let cachedClient: SqlClient | null = null;

function getSql(): SqlClient {
  if (!cachedClient) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL belum di-set. Tambahkan connection string Supabase Postgres ke .env.local"
      );
    }
    cachedClient = postgres(connectionString, {
      // Wajib mati saat memakai Supabase pooler (PgBouncer transaction mode).
      prepare: false,
    }) as SqlClient;
  }
  return cachedClient;
}

/**
 * Klien Postgres lazy: error (bila DATABASE_URL absen) baru dilempar saat
 * query dieksekusi di runtime, bukan saat modul di-import (build time).
 * Meneruskan pemanggilan template-tag sekaligus properti (query/transaction/unsafe).
 *
 * Setiap query otomatis dibungkus `withDbRetry`: error sementara seperti
 * koneksi terputus di-retry dengan backoff eksponensial,
 * sehingga satu kegagalan jaringan sesaat tidak langsung menggagalkan request.
 */
export const sql = new Proxy(() => {}, {
  apply(_target, _thisArg, args: unknown[]) {
    const client = getSql() as (...a: unknown[]) => Promise<unknown>;
    return withDbRetry("query", () => client(...args));
  },
  get(_target, prop) {
    const value = (getSql() as unknown as Record<PropertyKey, unknown>)[prop];
    if (typeof value !== "function") return value;
    const bound = (value as (...a: unknown[]) => Promise<unknown>).bind(
      getSql()
    );
    return (...a: unknown[]) =>
      withDbRetry(String(prop), () => bound(...a));
  },
}) as unknown as SqlClient;

/** Jumlah total percobaan query (1 awal + 2 retry). */
export const DB_MAX_ATTEMPTS = 3;
/** Delay dasar backoff antar retry (ms), digandakan tiap percobaan + jitter. */
export const DB_BASE_DELAY_MS = 200;

/** Kode error Postgres yang aman di-retry (koneksi/konkurensi sementara). */
const TRANSIENT_PG_CODES = new Set([
  "08000", // connection_exception
  "08001", // sqlclient_unable_to_establish_sqlconnection
  "08003", // connection_does_not_exist
  "08004", // sqlserver_rejected_establishment_of_sqlconnection
  "08006", // connection_failure
  "57P01", // admin_shutdown
  "57P02", // crash_shutdown
  "57P03", // cannot_connect_now
  "53300", // too_many_connections
  "40001", // serialization_failure
  "40P01", // deadlock_detected
]);

/** Fragmen pesan error jaringan/driver yang menandakan kegagalan sementara. */
const TRANSIENT_MESSAGE_PATTERNS = [
  "abort",
  "fetch failed",
  "network",
  "econnreset",
  "econnrefused",
  "econnaborted",
  "etimedout",
  "enotfound",
  "eai_again",
  "epipe",
  "socket hang up",
  "socket disconnected",
  "connection closed",
  "connection terminated",
  "connection reset",
  "connection refused",
  "connection timeout",
  "timed out",
  "timeout",
  "tls",
  "temporarily",
  "try again",
];

/**
 * True bila error kemungkinan sementara dan layak di-retry: AbortError
 * (fetch dibatalkan), koneksi Postgres/Supabase terputus, timeout, atau kode
 * konkurensi sementara. Error logika (mis. unique violation 23505,
 * syntax error, DATABASE_URL absen) selalu false — langsung dilempar.
 */
export function isTransientDbError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const record = error as Record<string, unknown>;
  if (record.name === "AbortError" || record.code === "AbortError") {
    return true;
  }
  if (
    typeof record.code === "string" &&
    TRANSIENT_PG_CODES.has(record.code)
  ) {
    return true;
  }
  const text =
    typeof record.message === "string" ? record.message.toLowerCase() : "";
  const name = typeof record.name === "string" ? record.name.toLowerCase() : "";
  const haystack = `${name} ${text}`;
  return TRANSIENT_MESSAGE_PATTERNS.some((pattern) =>
    haystack.includes(pattern)
  );
}

function dbRetryDelayMs(failedAttempt: number): number {
  const exponential = DB_BASE_DELAY_MS * 2 ** (failedAttempt - 1);
  // Jitter deterministik dari nomor percobaan — SENGAJA tanpa RNG bawaan:
  // dengan `cacheComponents: true`, Next menandai akses ke sumber acak
  // sebagai IO sehingga memicu error/blocking saat prerender.
  // Nilai 0-99 yang bervariasi per percobaan tetap memecah thundering-herd
  // antar retry yang bersamaan.
  const jitter = (failedAttempt * 37 + 11) % 100;
  return exponential + jitter;
}

/**
 * Jalankan query dengan retry otomatis untuk error sementara.
 * Non-transient error langsung dilempar tanpa retry. Error terakhir
 * dilempar apa adanya setelah seluruh percobaan habis.
 */
export async function withDbRetry<T>(
  operation: string,
  fn: () => Promise<T>,
  maxAttempts: number = DB_MAX_ATTEMPTS
): Promise<T> {
  let attempt = 0;
  for (;;) {
    try {
      return await fn();
    } catch (error) {
      attempt += 1;
      if (attempt >= maxAttempts || !isTransientDbError(error)) {
        throw error;
      }
      const detail =
        error instanceof Error ? error.message : String(error);
      console.warn(
        `[db] query "${operation}" gagal sementara (percobaan ${attempt}/${maxAttempts}): ${detail}. Retry...`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, dbRetryDelayMs(attempt))
      );
    }
  }
}

export type UserRole = "admin" | "user";

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface LandingPage {
  id: number;
  user_id: string;
  title: string;
  slug: string;
  template_type: string;
  // JSONB Postgres bisa terbaca sebagai objek, string JSON, atau string
  // yang ter-stringify ganda tergantung driver/isi baris — lihat
  // unwrap di toInvitationContent (lib/invitation.ts).
  content_json: Record<string, unknown> | string;
  is_pro: boolean;
  created_at: string;
}

export interface CreateLandingPageInput {
  user_id: string;
  title: string;
  slug: string;
  template_type?: string;
  content_json?: Record<string, unknown>;
  is_pro?: boolean;
}

export async function upsertUser(input: {
  id: string;
  clerk_id: string;
  email: string;
}): Promise<User[]> {
  try {
    // Langkah 1: baris clerk_id sudah ada (kasus umum, termasuk ganti email).
    const updated = (await sql`
      UPDATE users SET email = ${input.email}
      WHERE clerk_id = ${input.clerk_id}
      RETURNING *;
    `) as User[];
    if (updated.length > 0) return updated;

    // Langkah 2: user baru — samakan via email bila baris yatim sudah ada.
    const rows = (await sql`
      INSERT INTO users (id, clerk_id, email)
      VALUES (${input.id}, ${input.clerk_id}, ${input.email})
      ON CONFLICT (email)
      DO UPDATE SET
        clerk_id = EXCLUDED.clerk_id
      RETURNING *;
    `) as User[];
    return rows;
  } catch (error) {
    if (isUniqueViolation(error)) {
      // Kemungkinan balapan insert konkuren: baca ulang barisnya.
      const existing = await getUserByClerkId(input.clerk_id);
      if (existing) return [existing];
      throw new Error("Email sudah digunakan akun lain");
    }
    throw error;
  }
}

export async function getUserByClerkId(
  clerkId: string
): Promise<User | undefined> {
  const rows = (await sql`
    SELECT * FROM users WHERE clerk_id = ${clerkId} LIMIT 1;
  `) as User[];
  return rows[0];
}

/** Ambil role user berdasarkan clerk_id. Null bila user belum terdaftar. */
export async function getUserRole(
  clerkId: string
): Promise<UserRole | null> {
  const rows = (await sql`
    SELECT role FROM users WHERE clerk_id = ${clerkId} LIMIT 1;
  `) as { role: UserRole }[];
  return rows[0]?.role ?? null;
}

/** True hanya bila user memiliki role 'admin'. */
export async function isAdmin(clerkId: string): Promise<boolean> {
  return (await getUserRole(clerkId)) === "admin";
}

export interface LandingPageWithOwner extends LandingPage {
  owner_email: string | null;
}

export interface LandingPageBasic {
  id: number;
  slug: string;
  user_id: string;
  is_pro: boolean;
  title: string;
}

/**
 * Query ringan untuk verifikasi kepemilikan/checkout/pre-check publik.
 * SENGAJA tidak membawa `content_json` (bisa 512KB) — hemat bandwidth Neon.
 */
export async function getLandingPageBasicBySlug(
  slug: string
): Promise<LandingPageBasic | undefined> {
  const rows = (await sql`
    SELECT id, slug, user_id, is_pro, title
    FROM landing_pages WHERE slug = ${slug} LIMIT 1;
  `) as LandingPageBasic[];
  return rows[0];
}

/** Varian ringan untuk cek ownership tanpa `content_json`. */
export async function getLandingPageBasicByUserAndSlug(
  userId: string,
  slug: string
): Promise<LandingPageBasic | undefined> {
  const rows = (await sql`
    SELECT id, slug, user_id, is_pro, title
    FROM landing_pages
    WHERE user_id = ${userId} AND slug = ${slug}
    LIMIT 1;
  `) as LandingPageBasic[];
  return rows[0];
}

/** Ambil seluruh landing page dari semua user beserta email pemiliknya. */
export async function getAllLandingPages(
  limit: number = 50,
  offset: number = 0
): Promise<LandingPageWithOwner[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 200);
  const safeOffset = Math.max(offset, 0);
  const rows = (await sql`
    SELECT lp.id, lp.user_id, lp.title, lp.slug, lp.template_type, lp.is_pro,
      lp.created_at, u.email AS owner_email
    FROM landing_pages lp
    LEFT JOIN users u ON u.clerk_id = lp.user_id
    ORDER BY lp.created_at DESC
    LIMIT ${safeLimit} OFFSET ${safeOffset};
  `) as LandingPageWithOwner[];
  return rows;
}

/** Ubah status is_pro sebuah landing page berdasarkan slug. */
export async function toggleProStatus(
  slug: string,
  isPro: boolean
): Promise<boolean> {
  const updated = await setLandingPageProBySlug(slug, isPro);
  return updated !== undefined;
}

export async function getLandingPagesByUserId(
  userId: string
): Promise<LandingPage[]> {
  const rows = (await sql`
    SELECT * FROM landing_pages
    WHERE user_id = ${userId}
    ORDER BY created_at DESC;
  `) as LandingPage[];
  return rows;
}

export async function getLandingPageBySlug(
  slug: string
): Promise<LandingPage | undefined> {
  const rows = (await sql`
    SELECT * FROM landing_pages WHERE slug = ${slug} LIMIT 1;
  `) as LandingPage[];
  return rows[0];
}

export async function getLandingPageByUserAndSlug(
  userId: string,
  slug: string
): Promise<LandingPage | undefined> {
  const rows = (await sql`
    SELECT * FROM landing_pages
    WHERE user_id = ${userId} AND slug = ${slug}
    LIMIT 1;
  `) as LandingPage[];
  return rows[0];
}

export async function createLandingPage(
  input: CreateLandingPageInput
): Promise<LandingPage> {
  const rows = (await sql`
    INSERT INTO landing_pages (user_id, title, slug, template_type, content_json, is_pro)
    VALUES (
      ${input.user_id},
      ${input.title},
      ${input.slug},
      ${input.template_type ?? "minimalist"},
      ${JSON.stringify(input.content_json ?? {})}::jsonb,
      ${input.is_pro ?? false}
    )
    RETURNING *;
  `) as LandingPage[];
  const created = rows[0];
  if (!created) throw new Error("Gagal membuat landing page");
  return created;
}

export async function updateLandingPage(
  userId: string,
  slug: string,
  input: {
    title: string;
    template_type?: string;
    contentJson: Record<string, unknown>;
  }
): Promise<LandingPage | undefined> {
  const rows = (await sql`
    UPDATE landing_pages
    SET title = ${input.title},
        template_type = ${input.template_type ?? "minimalist"},
        content_json = ${JSON.stringify(input.contentJson)}::jsonb
    WHERE user_id = ${userId} AND slug = ${slug}
    RETURNING *;
  `) as LandingPage[];
  return rows[0];
}

export async function updateLandingPageContent(
  userId: string,
  slug: string,
  contentJson: Record<string, unknown>
): Promise<LandingPage | undefined> {
  const rows = (await sql`
    UPDATE landing_pages
    SET content_json = ${JSON.stringify(contentJson)}::jsonb
    WHERE user_id = ${userId} AND slug = ${slug}
    RETURNING *;
  `) as LandingPage[];
  return rows[0];
}

export async function setLandingPageProBySlug(
  slug: string,
  isPro: boolean = true
): Promise<LandingPage | undefined> {
  const rows = (await sql`
    UPDATE landing_pages
    SET is_pro = ${isPro}
    WHERE slug = ${slug}
    RETURNING *;
  `) as LandingPage[];
  return rows[0];
}

export async function deleteLandingPage(
  userId: string,
  slug: string
): Promise<boolean> {
  const rows = (await sql`
    DELETE FROM landing_pages
    WHERE user_id = ${userId} AND slug = ${slug}
    RETURNING id;
  `) as { id: number }[];
  return rows.length > 0;
}

export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "23505"
  );
}

export interface Order {
  id: number;
  order_id: string;
  page_slug: string;
  amount: number;
  currency: string;
  status: string;
  provider: string | null;
  created_at: string;
  updated_at: string;
}

export async function getOrderByOrderId(
  orderId: string
): Promise<Order | undefined> {
  const rows = (await sql`
    SELECT id, order_id, page_slug, amount, currency, status, provider, created_at, updated_at
    FROM orders WHERE order_id = ${orderId} LIMIT 1;
  `) as Order[];
  return rows[0];
}

export async function createPendingOrder(input: {
  order_id: string;
  page_slug: string;
  amount: number;
  currency?: string;
  provider?: string;
}): Promise<Order> {
  const rows = (await sql`
    INSERT INTO orders (order_id, page_slug, amount, currency, status, provider)
    VALUES (
      ${input.order_id},
      ${input.page_slug},
      ${input.amount},
      ${input.currency ?? "IDR"},
      'pending',
      ${input.provider ?? null}
    )
    ON CONFLICT (order_id) DO NOTHING
    RETURNING id, order_id, page_slug, amount, currency, status, provider, created_at, updated_at;
  `) as Order[];
  const created = rows[0];
  if (created) return created;
  const existing = await getOrderByOrderId(input.order_id);
  if (!existing) throw new Error("Gagal mencatat order");
  return existing;
}

/**
 * Catat order berbayar secara idempoten: callback ganda dengan order_id
 * yang sama tidak akan menggandakan baris.
 */
export async function upsertPaidOrder(input: {
  order_id: string;
  page_slug: string;
  amount: number;
  currency?: string;
  provider?: string;
  rawPayload?: Record<string, unknown>;
}): Promise<Order> {
  const rows = (await sql`
    INSERT INTO orders (order_id, page_slug, amount, currency, status, provider, raw_payload)
    VALUES (
      ${input.order_id},
      ${input.page_slug},
      ${input.amount},
      ${input.currency ?? "IDR"},
      'paid',
      ${input.provider ?? null},
      ${input.rawPayload ? JSON.stringify(input.rawPayload) : null}::jsonb
    )
    ON CONFLICT (order_id)
    DO UPDATE SET status = 'paid', updated_at = NOW()
    RETURNING id, order_id, page_slug, amount, currency, status, provider, created_at, updated_at;
  `) as Order[];
  const order = rows[0];
  if (!order) throw new Error("Gagal mencatat order");
  return order;
}

export interface Wish {
  id: number;
  page_slug: string;
  name: string;
  message: string;
  attendance: string;
  created_at: string;
}

export async function getWishesBySlug(slug: string): Promise<Wish[]> {
  const rows = (await sql`
    SELECT * FROM wishes
    WHERE page_slug = ${slug}
    ORDER BY created_at DESC
    LIMIT 100;
  `) as Wish[];
  return rows;
}

export async function createWish(input: {
  page_slug: string;
  name: string;
  message: string;
  attendance: string;
}): Promise<Wish> {
  const rows = (await sql`
    INSERT INTO wishes (page_slug, name, message, attendance)
    VALUES (${input.page_slug}, ${input.name}, ${input.message}, ${input.attendance})
    RETURNING *;
  `) as Wish[];
  const created = rows[0];
  if (!created) throw new Error("Gagal menyimpan ucapan");
  return created;
}

export async function deleteWishById(id: number, slug: string): Promise<boolean> {
  const rows = (await sql`
    DELETE FROM wishes
    WHERE id = ${id} AND page_slug = ${slug}
    RETURNING id;
  `) as { id: number }[];
  return rows.length > 0;
}

export async function getWishStatsBySlug(
  slug: string
): Promise<{ attendance: string; count: number }[]> {
  const rows = (await sql`
    SELECT attendance, COUNT(*)::int AS count
    FROM wishes
    WHERE page_slug = ${slug}
    GROUP BY attendance;
  `) as { attendance: string; count: number }[];
  return rows;
}

export interface Guest {
  id: number;
  page_slug: string;
  name: string;
  phone: string;
  opened_at: string | null;
  created_at: string;
}

export async function getGuestsBySlug(
  slug: string,
  limit: number = 200,
  offset: number = 0
): Promise<Guest[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 500);
  const safeOffset = Math.max(offset, 0);
  const rows = (await sql`
    SELECT * FROM guests
    WHERE page_slug = ${slug}
    ORDER BY created_at ASC
    LIMIT ${safeLimit} OFFSET ${safeOffset};
  `) as Guest[];
  return rows;
}

export async function addGuest(input: {
  page_slug: string;
  name: string;
  phone?: string;
}): Promise<Guest> {
  const rows = (await sql`
    INSERT INTO guests (page_slug, name, phone)
    VALUES (${input.page_slug}, ${input.name}, ${input.phone ?? ""})
    RETURNING *;
  `) as Guest[];
  const created = rows[0];
  if (!created) throw new Error("Gagal menambah tamu");
  return created;
}

export async function deleteGuestById(id: number, slug: string): Promise<boolean> {
  const rows = (await sql`
    DELETE FROM guests
    WHERE id = ${id} AND page_slug = ${slug}
    RETURNING id;
  `) as { id: number }[];
  return rows.length > 0;
}

/** Tandai undangan telah dibuka oleh nama tamu (pencocokan case-insensitive). */
export async function markGuestOpened(slug: string, name: string): Promise<void> {
  await sql`
    UPDATE guests
    SET opened_at = COALESCE(opened_at, NOW())
    WHERE page_slug = ${slug} AND LOWER(name) = LOWER(${name});
  `;
}

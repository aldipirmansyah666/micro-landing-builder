import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type SqlClient = NeonQueryFunction<false, false>;

let cachedClient: SqlClient | null = null;

function getSql(): SqlClient {
  if (!cachedClient) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL belum di-set. Tambahkan koneksi PostgreSQL Neon ke .env.local"
      );
    }
    cachedClient = neon(connectionString);
  }
  return cachedClient;
}

/**
 * Klien Neon lazy: error (bila DATABASE_URL absen) baru dilempar saat
 * query dieksekusi di runtime, bukan saat modul di-import (build time).
 * Meneruskan pemanggilan template-tag sekaligus properti (query/transaction/unsafe).
 */
export const sql = new Proxy(() => {}, {
  apply(_target, _thisArg, args: unknown[]) {
    const client = getSql() as (...a: unknown[]) => unknown;
    return client(...args);
  },
  get(_target, prop) {
    const value = (getSql() as unknown as Record<PropertyKey, unknown>)[prop];
    return typeof value === "function"
      ? (value as (...a: unknown[]) => unknown).bind(getSql())
      : value;
  },
}) as unknown as SqlClient;

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
  content_json: Record<string, unknown>;
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

/** Ambil seluruh landing page dari semua user beserta email pemiliknya. */
export async function getAllLandingPages(): Promise<LandingPageWithOwner[]> {
  const rows = (await sql`
    SELECT lp.*, u.email AS owner_email
    FROM landing_pages lp
    LEFT JOIN users u ON u.clerk_id = lp.user_id
    ORDER BY lp.created_at DESC;
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
      ${input.template_type ?? "minimal"},
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
        template_type = ${input.template_type ?? "minimal"},
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

export async function getGuestsBySlug(slug: string): Promise<Guest[]> {
  const rows = (await sql`
    SELECT * FROM guests
    WHERE page_slug = ${slug}
    ORDER BY created_at ASC;
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

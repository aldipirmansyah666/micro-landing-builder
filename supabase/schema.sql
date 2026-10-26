-- Micro Landing Builder schema (Supabase / PostgreSQL)
-- Cara pakai (pilih salah satu):
--   1. Supabase Dashboard → SQL Editor → paste seluruh file → Run, atau
--   2. psql "$DATABASE_URL" -f supabase/schema.sql
--
-- Catatan:
-- - Semua kolom waktu memakai TIMESTAMPTZ (konsisten WIB di aplikasi
--   via lib/invitation.ts yang memaksa offset +07:00 / Asia/Jakarta).
-- - Kolom `role` di users dipakai fitur admin (ToggleProButton).
-- - Bagian STORAGE di bawah membuat bucket publik `uploads` + policy
--   baca publik (wajib agar foto cover/galeri tampil di <img>).
-- - RLS TIDAK diaktifkan pada tabel app: otorisasi dilakukan di
--   lapisan aplikasi (WHERE user_id / auth()). Service role key hanya
--   dipakai server-side (upload storage). Jangan expose ke client.

-- ============ USERS ============
CREATE TABLE IF NOT EXISTS users (
  id         VARCHAR PRIMARY KEY,
  clerk_id   VARCHAR NOT NULL UNIQUE,
  email      VARCHAR NOT NULL UNIQUE,
  role       VARCHAR NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migrasi untuk database lama yang belum punya kolom role:
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR NOT NULL DEFAULT 'user';

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- ============ LANDING PAGES ============
CREATE TABLE IF NOT EXISTS landing_pages (
  id            SERIAL PRIMARY KEY,
  user_id       VARCHAR NOT NULL REFERENCES users (clerk_id) ON DELETE CASCADE,
  title         VARCHAR NOT NULL,
  slug          VARCHAR NOT NULL UNIQUE,
  template_type VARCHAR NOT NULL DEFAULT 'minimalist',
  content_json  JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_pro        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_landing_pages_user_id ON landing_pages (user_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages (slug);

-- ============ WISHES (Ucapan & RSVP) ============
CREATE TABLE IF NOT EXISTS wishes (
  id         SERIAL PRIMARY KEY,
  page_slug  VARCHAR NOT NULL REFERENCES landing_pages (slug) ON DELETE CASCADE,
  name       VARCHAR NOT NULL,
  message    VARCHAR NOT NULL,
  attendance VARCHAR NOT NULL DEFAULT 'Hadir',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wishes_slug ON wishes (page_slug);

-- ============ ORDERS / PAYMENTS (Upgrade PRO) ============
CREATE TABLE IF NOT EXISTS orders (
  id          SERIAL PRIMARY KEY,
  order_id    VARCHAR NOT NULL UNIQUE,
  page_slug   VARCHAR NOT NULL REFERENCES landing_pages (slug) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,
  currency    VARCHAR NOT NULL DEFAULT 'IDR',
  status      VARCHAR NOT NULL DEFAULT 'pending',
  provider    VARCHAR,
  raw_payload JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_page_slug ON orders (page_slug);

-- ============ GUESTS (Tamu Undangan) ============
CREATE TABLE IF NOT EXISTS guests (
  id          SERIAL PRIMARY KEY,
  page_slug   VARCHAR NOT NULL REFERENCES landing_pages (slug) ON DELETE CASCADE,
  name        VARCHAR NOT NULL,
  phone       VARCHAR NOT NULL DEFAULT '',
  opened_at   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guests_page_slug ON guests (page_slug);
-- Percepat beacon opened (WHERE page_slug + LOWER(name)):
CREATE INDEX IF NOT EXISTS idx_guests_slug_lower_name ON guests (page_slug, lower(name));

-- ============ RATE LIMITS (persisten lintas instance) ============
CREATE TABLE IF NOT EXISTS rate_limits (
  rate_key     VARCHAR(64) PRIMARY KEY,
  hit_count    INTEGER NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_updated_at ON rate_limits (updated_at);

-- ============ STORAGE (bucket publik `uploads`) ============
-- Bucket untuk foto cover/galeri + audio backsound dari app/api/upload.
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Baca publik untuk semua file di bucket uploads (baca via anon key / <img>).
-- Idempoten: hapus dulu bila sudah ada (nama policy unik per bucket).
DROP POLICY IF EXISTS "Public read uploads" ON storage.objects;
CREATE POLICY "Public read uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'uploads');

-- Upload HANYA lewat server (service_role key, bypass RLS) — tidak ada
-- policy INSERT untuk anon/authenticated, sehingga browser tidak bisa
-- menulis langsung ke bucket.

-- Micro Landing Builder schema (PostgreSQL / Neon)
-- Terapkan via Neon SQL editor, psql, atau script migrasi:
--   psql "$DATABASE_URL" -f lib/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id         VARCHAR PRIMARY KEY,
  clerk_id   VARCHAR NOT NULL UNIQUE,
  email      VARCHAR NOT NULL UNIQUE,
  role       VARCHAR NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Migrasi untuk database yang sudah ada sebelum kolom role diperkenalkan:
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR NOT NULL DEFAULT 'user';

-- Pendukung ON CONFLICT (email) di upsertUser (wajib ada unique index di email):
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS landing_pages (
  id            SERIAL PRIMARY KEY,
  user_id       VARCHAR NOT NULL REFERENCES users (clerk_id) ON DELETE CASCADE,
  title         VARCHAR NOT NULL,
  slug          VARCHAR NOT NULL UNIQUE,
  template_type VARCHAR NOT NULL DEFAULT 'minimal',
  content_json  JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_pro        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_landing_pages_user_id ON landing_pages (user_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages (slug);

CREATE TABLE IF NOT EXISTS wishes (
  id         SERIAL PRIMARY KEY,
  page_slug  VARCHAR NOT NULL REFERENCES landing_pages (slug) ON DELETE CASCADE,
  name       VARCHAR NOT NULL,
  message    VARCHAR NOT NULL,
  attendance VARCHAR NOT NULL DEFAULT 'Hadir',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wishes_page_slug ON wishes (page_slug);

CREATE TABLE IF NOT EXISTS orders (
  id          SERIAL PRIMARY KEY,
  order_id    VARCHAR NOT NULL UNIQUE,
  page_slug   VARCHAR NOT NULL REFERENCES landing_pages (slug) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,
  currency    VARCHAR NOT NULL DEFAULT 'IDR',
  status      VARCHAR NOT NULL DEFAULT 'pending',
  provider    VARCHAR,
  raw_payload JSONB,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_page_slug ON orders (page_slug);

CREATE TABLE IF NOT EXISTS guests (
  id          SERIAL PRIMARY KEY,
  page_slug   VARCHAR NOT NULL REFERENCES landing_pages (slug) ON DELETE CASCADE,
  name        VARCHAR NOT NULL,
  phone       VARCHAR NOT NULL DEFAULT '',
  opened_at   TIMESTAMP,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guests_page_slug ON guests (page_slug);

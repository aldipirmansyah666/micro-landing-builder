import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

const BUCKET = "uploads";
const PAGE_SIZE = 1000;
const DEFAULT_OLDER_THAN_HOURS = 24;
const DELETE_BATCH_SIZE = 100;

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const verbose = args.has("--verbose");

function argValue(name) {
  const prefix = `${name}=`;
  const value = process.argv.find((arg) => arg.startsWith(prefix));
  return value ? value.slice(prefix.length) : undefined;
}

const olderThanHours = Number.parseFloat(
  argValue("--older-than-hours") ?? String(DEFAULT_OLDER_THAN_HOURS)
);

if (!Number.isFinite(olderThanHours) || olderThanHours < 0) {
  console.error("--older-than-hours harus berupa angka >= 0");
  process.exit(1);
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`${name} belum di-set`);
    process.exit(1);
  }
  return value;
}

const supabaseUrl = requiredEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/+$/, "");
const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
const databaseUrl = requiredEnv("DATABASE_URL");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const sql = postgres(databaseUrl, { prepare: false, max: 1 });

async function listObjects(prefix = "") {
  const objects = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
      limit: PAGE_SIZE,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) {
      throw new Error(`Gagal membaca storage (${prefix || "/"}): ${error.message}`);
    }
    if (!data || data.length === 0) break;

    for (const item of data) {
      const key = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.name === ".emptyFolderPlaceholder") continue;
      if (item.id === null) {
        objects.push(...(await listObjects(key)));
        continue;
      }
      objects.push({
        key,
        createdAt: item.created_at ?? item.updated_at ?? null,
      });
    }

    if (data.length < PAGE_SIZE) break;
    offset += data.length;
  }

  return objects;
}

function normalizeJson(value) {
  let normalized = value;
  for (let depth = 0; depth < 3 && typeof normalized === "string"; depth += 1) {
    try {
      normalized = JSON.parse(normalized);
    } catch {
      break;
    }
  }
  return normalized;
}

function collectReferencedKeys(value, marker, keys) {
  if (typeof value === "string") {
    const start = value.indexOf(marker);
    if (start === -1) return;
    let key = value.slice(start + marker.length).split(/[?#]/, 1)[0];
    try {
      key = decodeURIComponent(key);
    } catch {
      return;
    }
    if (key) keys.add(key);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectReferencedKeys(item, marker, keys);
    return;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      collectReferencedKeys(item, marker, keys);
    }
  }
}

async function main() {
  const rows = await sql`
    SELECT content_json FROM landing_pages;
  `;

  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const referenced = new Set();
  for (const row of rows) {
    collectReferencedKeys(
      normalizeJson(row.content_json),
      marker,
      referenced
    );
  }

  const objects = await listObjects();
  const orphans = objects.filter((object) => !referenced.has(object.key));
  const graceMs = olderThanHours * 60 * 60 * 1000;
  const now = Date.now();
  const eligible = orphans.filter((object) => {
    if (!object.createdAt) return false;
    const createdAt = Date.parse(object.createdAt);
    if (!Number.isFinite(createdAt)) return false;
    return now - createdAt >= graceMs;
  });

  console.log(`[cleanup] mode: ${apply ? "APPLY" : "DRY-RUN"}`);
  console.log(`[cleanup] grace: ${olderThanHours} jam`);
  console.log(`[cleanup] ${objects.length} objek storage`);
  console.log(`[cleanup] ${referenced.size} URL upload dirujuk`);
  console.log(`[cleanup] ${orphans.length} objek tanpa referensi`);
  console.log(`[cleanup] ${eligible.length} objek siap dihapus`);

  if (verbose || !apply) {
    for (const object of eligible.slice(0, 20)) {
      console.log(`  ${object.key} (${object.createdAt})`);
    }
    if (eligible.length > 20) {
      console.log(`  ... dan ${eligible.length - 20} objek lainnya`);
    }
  }

  if (!apply || eligible.length === 0) {
    if (!apply && eligible.length > 0) {
      console.log("[cleanup] dry-run: jalankan dengan --apply untuk menghapus");
    }
    return;
  }

  let deleted = 0;
  for (let index = 0; index < eligible.length; index += DELETE_BATCH_SIZE) {
    const batch = eligible.slice(index, index + DELETE_BATCH_SIZE);
    const { error } = await supabase.storage
      .from(BUCKET)
      .remove(batch.map((object) => object.key));
    if (error) {
      console.error(`[cleanup] gagal menghapus batch: ${error.message}`);
      process.exitCode = 1;
      continue;
    }
    deleted += batch.length;
  }

  console.log(`[cleanup] ${deleted} objek dihapus`);
}

try {
  await main();
} catch (error) {
  console.error(
    `[cleanup] gagal: ${error instanceof Error ? error.message : "unknown error"}`
  );
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}

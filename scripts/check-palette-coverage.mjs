/**
 * Verifikasi cakupan palet template.
 *
 * Untuk setiap template katalog, cek bahwa SETIAP hex yang tertanam di
 * dalam file komponen template tersebut sudah tercakup di palet-nya
 * (`lib/palettes.ts`). Kalau ada hex yang belum tercakup, palet belum
 * lengkap — meaning re-design terpusat belum akan menjangkau warna itu.
 *
 * Jalankan: node scripts/check-palette-coverage.mjs
 * Exit code 0 = semua tercakup, 1 = ada hex yang belum tercakup.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const TEMPLATE_DIR = "components/templates";

/** id template -> file komponennya (harus sinkron dengan lib/invitation.ts). */
const TEMPLATE_FILES = {
  aruna: "ArunaTemplate.tsx",
  mahardika: "MahardikaTemplate.tsx",
  puspaningrat: "PuspaningratTemplate.tsx",
  azzahra: "AzzahraTemplate.tsx",
  seruni: "SeruniTemplate.tsx",
  elan: "ElanTemplate.tsx",
  kala: "KalaTemplate.tsx",
  senja: "SenjaTemplate.tsx",
  verdant: "VerdantGlassTemplate.tsx",
  terra: "RusticTerraTemplate.tsx",
  heritage: "SurabayaHeritageTemplate.tsx",
  celestial: "CelestialNightTemplate.tsx",
  parisian: "ParisianEditorialTemplate.tsx",
  blossom: "BlossomSageTemplate.tsx",
  balinese: "RoyalBalineseTemplate.tsx",
  mono: "MinimalistMonoTemplate.tsx",
  arabesque: "ArabesqueSakralTemplate.tsx",
  retro: "RetroSunsetTemplate.tsx",
};

/**
 * Nilai setara HEX untuk token warna Tailwind yang dipakai template.
 * Template seperti Verdant / Parisian / MinimalistMono memakai token
 * Tailwind (`text-emerald-50`) alih-alih hex — dicatat di palet sebagai
 * nilai HEX yang sama supaya palet tetap satu bahasa.
 */
const TAILWIND_COLOR_HEX = {
  white: "#ffffff",
  black: "#000000",
  "emerald-50": "#ecfdf5",
  "emerald-100": "#d1fae5",
  "emerald-200": "#a7f3d0",
  "emerald-300": "#6ee7b7",
  "emerald-400": "#34d399",
};

/**
 * Palet dibaca langsung dari lib/palettes.ts lewat regex sederhana —
 * sengaja tanpa memakai TypeScript supaya script ini jalan tanpa build.
 */
function readPaletteHexes() {
  const src = readFileSync("lib/palettes.ts", "utf8");
  const palettes = {};
  // Blok palet ditulis sebagai `  <id>: {` ... `  },` di dalam
  // TEMPLATE_PALETTES.
  const blockRe = /^ {2}([a-z]+): \{([\s\S]*?)^ {2}\},/gm;
  for (const match of src.matchAll(blockRe)) {
    const id = match[1];
    const body = match[2];
    palettes[id] = new Set(
      [...body.matchAll(/"(#[0-9a-fA-F]{6})"/g)].map((m) => m[1].toLowerCase())
    );
  }
  return palettes;
}

const palettes = readPaletteHexes();

let failed = false;
const report = [];

for (const [id, file] of Object.entries(TEMPLATE_FILES)) {
  const path = join(TEMPLATE_DIR, file);
  const src = readFileSync(path, "utf8");
  const used = new Set(
    [...src.matchAll(/\[(#[0-9a-fA-F]{6})\]/g)].map((m) => m[1].toLowerCase())
  );
  // Token warna Tailwind yang muncul sebagai utility class.
  for (const m of src.matchAll(
    /(?:text|bg|border|from|via|to|fill|stroke|ring|decoration)-([a-z]+(?:-\d+)?)\b/g
  )) {
    const token = m[1];
    const hex = TAILWIND_COLOR_HEX[token];
    if (hex) used.add(hex);
  }
  const covered = palettes[id] ?? new Set();
  const missing = [...used].filter((hex) => !covered.has(hex));

  // Palet boleh punya hex ekstra (peran tumpang tindih) — hanya hex yang
  // dipakai template tapi TIDAK ada di palet yang dianggap gagal.
  report.push({
    id,
    used: used.size,
    covered: [...used].filter((h) => covered.has(h)).length,
    missing,
  });
  if (missing.length > 0) failed = true;
}

console.log("Cakupan palet template katalog");
console.log("=".repeat(64));
for (const r of report) {
  const status = r.missing.length === 0 ? "OK " : "GAP";
  console.log(
    `${status} ${r.id.padEnd(14)} ${String(r.covered).padStart(2)}/${String(r.used).padStart(2)} hex tercakup`
  );
  if (r.missing.length > 0) {
    console.log(`     belum tercakup: ${r.missing.join(" ")}`);
  }
}

// Palet yang tidak terpakai oleh file template mana pun = data mati.
const usedIds = new Set(Object.keys(TEMPLATE_FILES));
const orphanIds = Object.keys(palettes).filter((id) => !usedIds.has(id));
if (orphanIds.length > 0) {
  console.log(`\nPeringatan: palet tanpa file template: ${orphanIds.join(", ")}`);
}

console.log("=".repeat(64));
if (failed) {
  console.error("GAGAL: ada hex template yang belum tercakup di palet.");
  process.exit(1);
}
console.log("Semua warna template tercakup di palet terpusat.");

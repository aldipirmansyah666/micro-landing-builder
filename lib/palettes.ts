import type { CatalogTemplateId } from "./invitation";

/**
 * Palet warna satu template — sumber kebenaran tunggal untuk semua warna
 * yang dipakai template tersebut.
 *
 * SEBELUMNYA warna template tersebar di tiga tempat yang tidak saling
 * terhubung:
 *   1. di dalam file komponen template (`bg-[#faf7f0]`, `text-[#c9a96a]`…)
 *   2. di `lib/templates.ts` → `swatches` (54 hex yang dicatat manual)
 *   3. acak-acakan di file lain (landing page, kartu katalog)
 *
 * Duplikat di (1) dan (2) bisa berbeda warna — tidak ada yang memaksa
 * keduanya sinkron. Dengan palet terpusat, satu template punya SATU
 * daftar warna; `swatches` katalog menjadi turunannya, dan class
 * hardcoded di dalam template bisa dimigrasikan ke CSS variable
 * (Fase F5) tanpa mengubah satu hex pun secara manual.
 *
 * Semua nilai berupa warna CSS konkret (HEX). Token Tailwind yang
 * dipakai template (mis. `text-emerald-50`) dicatat sebagai nilai
 * HEX setara-nya (`#ecfdf5`) supaya palet tetap satu bahasa.
 *
 * Modifier opacity (`text-[#f4efe3]/65`) TIDAK disimpan di palet —
 * opacity tetap ditulis di class Tailwind, dan `color-mix` Tailwind v4
 * menghasilkan warna yang sama persis.
 */
export interface TemplatePalette {
  /** Latar halaman utama template. */
  bg: string;
  /** Teks utama. */
  text: string;
  /** Judul — nama pasangan, nama acara. */
  heading: string;
  /** Teks sekunder — nama lengkap, keterangan. */
  textSoft: string;
  /** Teks tersier — orang tua, label kecil, disclaimer. */
  textFaint: string;
  /** Aksen utama — ikon, kicker section, tombol aksi. */
  accent: string;
  /** Aksen redup — garis pemisah, ornamen, label kecil. */
  accentSoft: string;
  /** Aksen sekunder — gradasi dan ornamen pelengkap. */
  accentAlt: string;
  /** Permukaan kartu / panel. */
  surface: string;
  /** Permukaan sekunder — kotak quote, ujung gradasi kartu. */
  surfaceAlt: string;
  /** Garis tepi kartu. */
  border: string;
  /** Latar cover overlay. */
  overlay: string;
  /** Teks cover overlay. */
  overlayText: string;
  /** Teks di atas permukaan aksen (tombol accent) — biasanya putih. */
  onAccent: string;
  /** Gradasi gelap di atas foto (scrim) — biasanya hitam transparan. */
  scrim: string;
  /** Warna dekoratif — blob latar, gradasi ornamen. */
  decor: string[];
  /** Gradasi vertikal latar: [from, via, to]. */
  bgGradient?: [string, string, string];
  /** Gradasi teks judul: [from, via, to]. */
  headingGradient?: [string, string, string];
  /** Gradasi kartu: [from, to]. */
  surfaceGradient?: [string, string];
  /**
   * Tiga warna yang ditampilkan sebagai swatch di katalog template.
   *
   * Ditulis sebagai REFERENSI PERAN (atau literal hex untuk warna
   * katalog legacy) supaya tetap terpusat di palet — bukan dicatat
   * manual di `lib/templates.ts` seperti sebelumnya — sekaligus menjaga
   * tampilan katalog tetap persis sama.
   */
  swatches: [PaletteColorRef, PaletteColorRef, PaletteColorRef];
}

/**
 * Rujukan warna: nama peran palet, atau literal hex untuk warna katalog
 * yang tidak punya peran umum (mis. warna aproksimasi warisan).
 */
export type PaletteColorRef = PaletteRole | `#${string}`;

/**
 * Palet kedelapan belas template katalog.
 *
 * Nilai diambil PERSIS dari warna yang saat ini tertanam di dalam file
 * masing-masing template, sehingga adopting palet ini tidak mengubah satu
 * pixel pun. `scripts/check-palette-coverage.mjs` memverifikasi bahwa
 * setiap warna yang dipakai template sudah tercakup di sini.
 */
export const TEMPLATE_PALETTES: Record<CatalogTemplateId, TemplatePalette> = {
  aruna: {
    bg: "#faf7f0",
    text: "#3d3a34",
    heading: "#2e2b26",
    textSoft: "#5c574c",
    textFaint: "#8a8474",
    accent: "#c9a96a",
    accentSoft: "#9a8a5f",
    accentAlt: "#8a8474",
    surface: "#ffffff",
    surfaceAlt: "#faf7f0",
    border: "#e4d9c2",
    overlay: "#faf7f0",
    overlayText: "#3d3a34",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["bg", "accent", "text"],
    decor: [],
  },
  mahardika: {
    bg: "#0c2b23",
    text: "#f5efe0",
    heading: "#f2e7c9",
    textSoft: "#f5efe0",
    textFaint: "#f5efe0",
    accent: "#c9a96a",
    accentSoft: "#e8d5a3",
    accentAlt: "#e8d5a3",
    surface: "#123b31",
    surfaceAlt: "#123b31",
    border: "#c9a96a",
    overlay: "#0c2b23",
    overlayText: "#f5efe0",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["bg", "accent", "text"],
    decor: [],
  },
  puspaningrat: {
    bg: "#f6efe2",
    text: "#4a3826",
    heading: "#3a2c1c",
    textSoft: "#5c4a33",
    textFaint: "#4a3a26",
    accent: "#b08d3e",
    accentSoft: "#8a5a2b",
    accentAlt: "#7a6549",
    surface: "#fbf6ea",
    surfaceAlt: "#fffdf6",
    border: "#b08d3e",
    overlay: "#3a2c1c",
    overlayText: "#f6efe2",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["bg", "accentSoft", "accent"],
    decor: [],
  },
  azzahra: {
    bg: "#0f3a3d",
    text: "#f4efe3",
    heading: "#f4efe3",
    textSoft: "#f4efe3",
    textFaint: "#e8dcc3",
    accent: "#c2a164",
    accentSoft: "#e8dcc3",
    accentAlt: "#c2a164",
    surface: "#ffffff",
    surfaceAlt: "#ffffff",
    border: "#c2a164",
    overlay: "#0f3a3d",
    overlayText: "#f4efe3",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["bg", "accent", "text"],
    decor: [],
  },
  seruni: {
    bg: "#fdf6f7",
    text: "#6b4a52",
    heading: "#5c3f47",
    textSoft: "#6b4a52",
    textFaint: "#a08a90",
    accent: "#c98a94",
    accentSoft: "#e8b4bc",
    accentAlt: "#8a9b85",
    surface: "#fdf6f7",
    surfaceAlt: "#fdf6f7",
    border: "#e8b4bc",
    overlay: "#5c3f47",
    overlayText: "#fdf6f7",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["#fbeef0", "accent", "accentAlt"],
    decor: ["#f5d3d8", "#dfe7d5", "#f7e3c8"],
  },
  elan: {
    bg: "#fafafa",
    text: "#111111",
    heading: "#111111",
    textSoft: "#222222",
    textFaint: "#222222",
    accent: "#111111",
    accentSoft: "#222222",
    accentAlt: "#e4e4e4",
    surface: "#ffffff",
    surfaceAlt: "#ffffff",
    border: "#e4e4e4",
    overlay: "#111111",
    overlayText: "#fafafa",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["text", "surface", "#8a8a8a"],
    decor: [],
  },
  kala: {
    bg: "#faf3e8",
    text: "#4a3226",
    heading: "#3d2a1e",
    textSoft: "#4a3226",
    textFaint: "#4a3226",
    accent: "#c96f4a",
    accentSoft: "#f2c9a8",
    accentAlt: "#3f6b63",
    surface: "#f7e8d5",
    surfaceAlt: "#f7e8d5",
    border: "#f2c9a8",
    overlay: "#4a3226",
    overlayText: "#faf3e8",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["accent", "surface", "accentAlt"],
    decor: ["#9dbfb4"],
  },
  senja: {
    bg: "#efe7d3",
    text: "#3f3a2c",
    heading: "#2c3324",
    textSoft: "#3f3a2c",
    textFaint: "#6b5b3e",
    accent: "#4a5d3a",
    accentSoft: "#6b4f35",
    accentAlt: "#e8dcc3",
    surface: "#f7f1e1",
    surfaceAlt: "#f7f1e1",
    border: "#6b5b3e",
    overlay: "#2c3324",
    overlayText: "#efe7d3",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["accent", "accentAlt", "accentSoft"],
    decor: [],
  },
  verdant: {
    bg: "#0b2e25",
    text: "#ecfdf5",
    heading: "#ecfdf5",
    textSoft: "#d1fae5",
    textFaint: "#a7f3d0",
    accent: "#6ee7b7",
    accentSoft: "#a7f3d0",
    accentAlt: "#34d399",
    surface: "#0e3d30",
    surfaceAlt: "#0e3d30",
    border: "#ffffff",
    overlay: "#0b2e25",
    overlayText: "#ecfdf5",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["bg", "accent", "text"],
    decor: [],
    bgGradient: ["#0b2e25", "#0e3d30", "#071f1a"],
  },
  terra: {
    bg: "#f5ede0",
    text: "#4a3a2c",
    heading: "#3a2d20",
    textSoft: "#6a563e",
    textFaint: "#5c4a36",
    accent: "#b4552d",
    accentSoft: "#8a6a4a",
    accentAlt: "#e0a878",
    surface: "#fdf8ef",
    surfaceAlt: "#efe2cb",
    border: "#e0cda8",
    overlay: "#f5ede0",
    overlayText: "#4a3a2c",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["accent", "bg", "heading"],
    decor: [],
  },
  heritage: {
    bg: "#f7f1e3",
    text: "#1b2a4a",
    heading: "#1b2a4a",
    textSoft: "#3d4a6a",
    textFaint: "#6a7694",
    accent: "#c9a227",
    accentSoft: "#8a7a2e",
    accentAlt: "#e6c65a",
    surface: "#fffdf6",
    surfaceAlt: "#fffdf6",
    border: "#2a3d66",
    overlay: "#1b2a4a",
    overlayText: "#f7f1e3",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["text", "accent", "bg"],
    decor: [],
  },
  celestial: {
    bg: "#060a1a",
    text: "#ece7d4",
    heading: "#f7ecc8",
    textSoft: "#b9b09a",
    textFaint: "#8a8474",
    accent: "#d4af37",
    accentSoft: "#9a7b24",
    accentAlt: "#c9c2ab",
    surface: "#1b2a5e",
    surfaceAlt: "#1b2a5e",
    border: "#d4af37",
    overlay: "#060a1a",
    overlayText: "#ece7d4",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["bg", "accent", "text"],
    decor: ["#e8d9a8", "#c9b98a"],
    headingGradient: ["#f7ecc8", "#e8cf8a", "#9a7b24"],
  },
  parisian: {
    bg: "#ffffff",
    text: "#000000",
    heading: "#000000",
    textSoft: "#000000",
    textFaint: "#000000",
    accent: "#000000",
    accentSoft: "#000000",
    accentAlt: "#000000",
    surface: "#ffffff",
    surfaceAlt: "#ffffff",
    border: "#000000",
    overlay: "#ffffff",
    overlayText: "#000000",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["text", "surface", "#8a8a8a"],
    decor: [],
  },
  blossom: {
    bg: "#f6f3ec",
    text: "#4c5a4e",
    heading: "#3f4a41",
    textSoft: "#6a7a6c",
    textFaint: "#8a6a6e",
    accent: "#9aa793",
    accentSoft: "#7d8b7a",
    accentAlt: "#e8b4b8",
    surface: "#eef0e6",
    surfaceAlt: "#f0e8e4",
    border: "#a8b8a0",
    overlay: "#eef0e6",
    overlayText: "#4c5a4e",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["accentSoft", "accentAlt", "bg"],
    decor: ["#c98a94"],
    surfaceGradient: ["#ffffff", "#f0e8e4"],
  },
  balinese: {
    bg: "#2b0f0f",
    text: "#f0dfb8",
    heading: "#f7ecc8",
    textSoft: "#d9c493",
    textFaint: "#a8937a",
    accent: "#c9973f",
    accentSoft: "#a8937a",
    accentAlt: "#d9c493",
    surface: "#3d1616",
    surfaceAlt: "#3d1616",
    border: "#c9973f",
    overlay: "#2b0f0f",
    overlayText: "#f0dfb8",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["bg", "accent", "text"],
    decor: [],
  },
  mono: {
    bg: "#ffffff",
    text: "#1a1a1a",
    heading: "#1a1a1a",
    textSoft: "#4a4a4a",
    textFaint: "#6a6a6a",
    accent: "#1a1a1a",
    accentSoft: "#6a6a6a",
    accentAlt: "#e2e2e2",
    surface: "#ffffff",
    surfaceAlt: "#ffffff",
    border: "#e2e2e2",
    overlay: "#ffffff",
    overlayText: "#1a1a1a",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["text", "surface", "textFaint"],
    decor: [],
  },
  arabesque: {
    bg: "#0b3b36",
    text: "#f2ead2",
    heading: "#f7f0da",
    textSoft: "#c9bfa5",
    textFaint: "#4a5a4e",
    accent: "#c9a227",
    accentSoft: "#9a917a",
    accentAlt: "#8a7a2e",
    surface: "#082b28",
    surfaceAlt: "#082b28",
    border: "#c9a227",
    overlay: "#0b3b36",
    overlayText: "#f2ead2",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["bg", "accent", "text"],
    decor: ["#e2d5b3"],
  },
  retro: {
    bg: "#fbe3c8",
    text: "#4a2c17",
    heading: "#4a2c17",
    textSoft: "#6b4f35",
    textFaint: "#6b4f35",
    accent: "#c96f4a",
    accentSoft: "#e8a94e",
    accentAlt: "#2f3e33",
    surface: "#fdf3e3",
    surfaceAlt: "#fdf3e3",
    border: "#b4552d",
    overlay: "#c96f4a",
    overlayText: "#fdf3e3",
    onAccent: "#ffffff",
    scrim: "#000000",
    swatches: ["accent", "accentSoft", "bg"],
    decor: [],
  },
};

/**
 * Nama CSS custom property untuk setiap peran palet.
 *
 * Prefix `t-` (template) supaya tidak bentrok dengan token aplikasi
 * (`--color-brand-*`, dst.) saat palet dipindahkan ke `@theme` global.
 */
export const PALETTE_CSS_VARS = {
  bg: "--t-bg",
  text: "--t-text",
  heading: "--t-heading",
  textSoft: "--t-text-soft",
  textFaint: "--t-text-faint",
  accent: "--t-accent",
  accentSoft: "--t-accent-soft",
  accentAlt: "--t-accent-alt",
  surface: "--t-surface",
  surfaceAlt: "--t-surface-alt",
  border: "--t-border",
  overlay: "--t-overlay",
  overlayText: "--t-overlay-text",
} as const satisfies Record<string, string>;

export type PaletteRole = keyof typeof PALETTE_CSS_VARS;

/**
 * Ubah palet menjadi CSS custom properties siap tempel ke elemen root
 * template (`style={paletteCssVars(palette)}`).
 *
 * Dipakai saat template dimigrasikan dari hex hardcoded ke class berbasis
 * `var(--t-*)` — warna yang dihasilkan identik karena nilainya persis sama.
 */
export function paletteCssVars(palette: TemplatePalette): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const role of Object.keys(PALETTE_CSS_VARS) as PaletteRole[]) {
    vars[PALETTE_CSS_VARS[role]] = palette[role];
  }
  palette.decor.forEach((color, i) => {
    vars[`--t-decor-${i}`] = color;
  });
  return vars;
}

/**
 * Tiga warna khas untuk swatch di katalog template.
 *
 * SEBELUMNYA `swatches` ditulis manual di `lib/templates.ts` (54 hex
 * terpisah yang harus dicocokkan tangan dengan isi file template — dan
 * sering tidak sinkron). Sekarang setiap template mendeklarasikan swatch-nya
 * di dalam palet sebagai REFERENSI PERAN, jadi tetap terpusat dan tidak
 * bisa melenceng, sementara nilai warnanya sendiri tetap persis sama
 * seperti sebelumnya (tampilan katalog tidak berubah).
 */
export function paletteSwatches(palette: TemplatePalette): [string, string, string] {
  return palette.swatches.map((ref) =>
    ref.startsWith("#")
      ? ref
      : (palette[ref as PaletteRole] as string)
  ) as [string, string, string];
}

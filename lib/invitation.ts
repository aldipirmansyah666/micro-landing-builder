export type GiftAccountKind = "bank" | "ewallet";
export type CoupleOrder = "brideFirst" | "groomFirst";
export type WeddingTimezone = "WIB" | "WITA" | "WIT";

export interface GiftAccount {
  bank: string;
  number: string;
  holder: string;
  /** Jenis tujuan transfer. Data lama tanpa field ini dianggap bank. */
  kind?: GiftAccountKind;
}

/** Satu entri cerita pasangan (timeline "Cerita & Sapaan"). */
export interface StoryEntry {
  title: string;
  text: string;
}

/** Batas validasi Content Enhancement v1 — dipakai client & server. */
export const MAX_GREETING_LEN = 1000;
export const MAX_CLOSING_NOTE_LEN = 1000;
export const MAX_STORIES = 5;
export const MAX_STORY_TITLE_LEN = 80;
export const MAX_STORY_TEXT_LEN = 1000;
export const MAX_GALLERY_VIDEOS = 6;

export const COUPLE_ORDER_OPTIONS: {
  value: CoupleOrder;
  label: string;
}[] = [
  { value: "brideFirst", label: "Wanita Dulu" },
  { value: "groomFirst", label: "Laki-Laki Dulu" },
];

export const TIMEZONE_OPTIONS: WeddingTimezone[] = ["WIB", "WITA", "WIT"];

export function normalizeTimezone(value: unknown): WeddingTimezone {
  return value === "WITA" || value === "WIT" ? value : "WIB";
}

export function normalizeCoupleOrder(value: unknown): CoupleOrder {
  // Data undangan lama tidak punya field ini dan dirender pria-dulu.
  // Nilai baru "brideFirst" dipertahankan; selain itu kembali ke urutan lama.
  return value === "brideFirst" ? "brideFirst" : "groomFirst";
}

/**
 * Dokumen undangan kanonik — sumber kebenaran tunggal untuk isi satu
 * landing page.
 *
 * Sengaja dideklarasikan sebagai `type` (bukan `interface`): type alias
 * mendapat *implicit index signature*, sehingga `InvitationContent`
 * bisa langsung dipakai sebagai `Record<string, unknown>` — yaitu tipe
 * yang dipakai layer DB untuk `content_json`. Dengan begitu hasil
 * normalisasi bisa disimpan apa adanya tanpa cast `as any`, dan
 * TypeScript tetap menangkap field yang salah ketik.
 */
export type InvitationContent = {
  quote: string;
  coupleOrder: CoupleOrder;
  groomFullName: string;
  groomNickname: string;
  groomParents: string;
  groomChildOrder: string;
  groomInstagram: string;
  groomPhoto: string;
  brideFullName: string;
  brideNickname: string;
  brideParents: string;
  brideChildOrder: string;
  brideInstagram: string;
  bridePhoto: string;
  akadDate: string;
  akadTime: string;
  akadTimezone: WeddingTimezone;
  akadVenue: string;
  akadMapsUrl: string;
  akadDresscode: string;
  receptionDate: string;
  receptionTime: string;
  receptionTimezone: WeddingTimezone;
  receptionVenue: string;
  receptionMapsUrl: string;
  receptionDresscode: string;
  heroImage: string;
  galleryImages: string[];
  galleryVideos: string[];
  backsoundUrl: string;
  accounts: GiftAccount[];
  giftAddress: string;
  liveStreamUrl: string;
  igFilterUrl: string;
  musicRequestUrl: string;
  /**
   * Sapaan pembuka kustom. `undefined` = data lama → pakai salam bawaan
   * template; string kosong = pengguna sengaja menyembunyikan salam.
   */
  greeting?: string;
  /**
   * Pesan penutup kustom. `undefined` = data lama → footer bawaan
   * template; string kosong = sembunyikan baris penutup.
   */
  closingNote?: string;
  /**
   * Cerita pasangan opsional (maksimal MAX_STORIES). `undefined`/kosong
   * = section tidak ditampilkan; hanya dirender template flagship.
   */
  stories?: StoryEntry[];
};

/** Id template lawas — tetap dirender demi kompatibilitas data lama. */
export type LegacyTemplateId =
  | "elegant"
  | "rustic"
  | "floral"
  | "minimalist"
  | "luxury"
  | "sage";

/** Delapan belas template katalog aktif. */
export type CatalogTemplateId =
  | "aruna"
  | "mahardika"
  | "puspaningrat"
  | "azzahra"
  | "seruni"
  | "elan"
  | "kala"
  | "senja"
  | "verdant"
  | "terra"
  | "heritage"
  | "celestial"
  | "parisian"
  | "blossom"
  | "balinese"
  | "mono"
  | "arabesque"
  | "retro";

export type TemplateId = LegacyTemplateId | CatalogTemplateId;

/** Delapan belas template katalog aktif — sumber kebenaran untuk katalog & dropdown. */
export const TEMPLATE_OPTIONS: { value: CatalogTemplateId; label: string }[] = [
  { value: "aruna", label: "Aruna — Minimalist Elegant" },
  { value: "mahardika", label: "Mahardika — Luxury Classic" },
  { value: "puspaningrat", label: "Puspaningrat — Traditional Jawa" },
  { value: "azzahra", label: "Azzahra — Islamic Elegant" },
  { value: "seruni", label: "Seruni — Romantic Floral" },
  { value: "elan", label: "Élan — Modern Editorial" },
  { value: "kala", label: "Kala — Modern Playful" },
  { value: "senja", label: "Senja — Nature Rustic" },
  { value: "verdant", label: "Verdant Glass — Glassmorphism Nature" },
  { value: "terra", label: "Rustic Terra — Boho Earthy" },
  { value: "heritage", label: "Surabaya Heritage — Peranakan Jawa" },
  { value: "celestial", label: "Celestial Night — Dark Luxury" },
  { value: "parisian", label: "Parisian Editorial — Fashion Magazine" },
  { value: "blossom", label: "Blossom Sage — Pastel Botanical" },
  { value: "balinese", label: "Royal Balinese — Ethnic Bali" },
  { value: "mono", label: "Minimalist Mono — Ultra Clean" },
  { value: "arabesque", label: "Arabesque Sakral — Islamic Gold" },
  { value: "retro", label: "Retro Sunset — Warm 90s" },
];

/** Seluruh id yang boleh tersimpan/dirender (katalog + lawas). */
export const ALL_TEMPLATE_IDS: TemplateId[] = [
  ...TEMPLATE_OPTIONS.map((t) => t.value),
  "elegant",
  "rustic",
  "floral",
  "minimalist",
  "luxury",
  "sage",
];

/** Alias lawas yang tetap diterima saat menyimpan/membaca. */
export const LEGACY_TEMPLATE_ALIASES: Record<string, TemplateId> = {
  minimal: "minimalist",
  modern: "minimalist",
};

/**
 * Normalisasi template_type ke id kanonis. Trim + lowercase agar
 * " Elegant " / "ELEGANT" dari form/DB tetap cocok; alias lawas
 * (minimal/modern) dipetakan; nilai tak dikenal → minimalist.
 * Satu-satunya fungsi normalisasi — dipakai builder (preview+save),
 * save route (validasi+penyimpanan), dan halaman publik (render)
 * agar ketiganya selalu sepakat.
 */
export function resolveTemplate(t: unknown): TemplateId {
  if (typeof t !== "string") return "minimalist";
  const key = t.trim().toLowerCase();
  if (
    key === "aruna" ||
    key === "mahardika" ||
    key === "puspaningrat" ||
    key === "azzahra" ||
    key === "seruni" ||
    key === "elan" ||
    key === "kala" ||
    key === "senja" ||
    key === "verdant" ||
    key === "terra" ||
    key === "heritage" ||
    key === "celestial" ||
    key === "parisian" ||
    key === "blossom" ||
    key === "balinese" ||
    key === "mono" ||
    key === "arabesque" ||
    key === "retro" ||
    key === "elegant" ||
    key === "rustic" ||
    key === "floral" ||
    key === "minimalist" ||
    key === "luxury" ||
    key === "sage"
  ) {
    return key;
  }
  return LEGACY_TEMPLATE_ALIASES[key] ?? "minimalist";
}

export const EMPTY_INVITATION: InvitationContent = {
  quote: "",
  coupleOrder: "brideFirst",
  groomFullName: "",
  groomNickname: "",
  groomParents: "",
  groomChildOrder: "",
  groomInstagram: "",
  groomPhoto: "",
  brideFullName: "",
  brideNickname: "",
  brideParents: "",
  brideChildOrder: "",
  brideInstagram: "",
  bridePhoto: "",
  akadDate: "",
  akadTime: "",
  akadTimezone: "WIB",
  akadVenue: "",
  akadMapsUrl: "",
  akadDresscode: "",
  receptionDate: "",
  receptionTime: "",
  receptionTimezone: "WIB",
  receptionVenue: "",
  receptionMapsUrl: "",
  receptionDresscode: "",
  heroImage: "",
  galleryImages: [],
  galleryVideos: [],
  backsoundUrl: "",
  accounts: [],
  giftAddress: "",
  liveStreamUrl: "",
  igFilterUrl: "",
  musicRequestUrl: "",
  greeting: undefined,
  closingNote: undefined,
  stories: undefined,
};

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/**
 * String opsional yang membedakan "tidak ada di data lama" (undefined)
 * dari "sengaja dikosongkan" (""). Non-string → undefined.
 */
function optStr(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

/**
 * Sanitasi URL untuk konteks render (href/src).
 *
 * Hanya protokol `http:` dan `https:` yang diizinkan. Nilai seperti
 * `javascript:`, `data:`, `vbscript:`, `blob:`, URL protocol-relative
 * (`//host/path`), atau URL relatif ditolak → dikembalikan string kosong
 * sehingga elemen `<a>`/`<img>`/`<audio>` tidak dirender sama sekali.
 *
 * PENTING: ini adalah CHOKE POINT sanitasi URL. Seluruh konten yang
 * dibaca dari database dinormalisasi lewat `toInvitationContent()`, yang
 * memanggil helper ini untuk setiap properti URL. Dengan begitu tidak
 * ada jalur render (halaman publik /p/[slug], preview builder, katalog
 * template, dan applyRenderEntitlements) yang bisa memakai URL
 * berbahaya — termasuk baris lama yang ditulis sebelum validasi ada,
 * dan primitive tulis DB yang tidak memvalidasi.
 */
export function safeHttpUrl(value: unknown): string {
  if (typeof value !== "string") return "";
  // Trim DULU: parser URL WHATWG membuang whitespace di awal/akhir, jadi
  // " javascript:alert(1) " akan ter-parse sebagai skema "javascript:".
  const trimmed = value.trim();
  if (trimmed === "") return "";
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    // URL relatif / malformed → tolak.
    return "";
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
  return trimmed;
}

/**
 * Normalisasi daftar URL (galeri). Entri non-http(s) dibuang, bukan
 * sekadar dibiarkan kosong supaya slot galeri tidak menampilkan gambar
 * rusak.
 */
function toUrlList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    const url = safeHttpUrl(item);
    if (url !== "") out.push(url);
  }
  return out;
}

/** Normalisasi daftar cerita: entri non-objek dibuang, string dikoerse. */
function toStories(v: unknown): StoryEntry[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const entries = v
    .filter(
      (e): e is Record<string, unknown> =>
        !!e && typeof e === "object" && !Array.isArray(e)
    )
    .map((e) => ({ title: str(e.title), text: str(e.text) }))
    .filter((e) => e.title || e.text);
  return entries.length > 0 ? entries : undefined;
}

/**
 * Kupas content_json yang berupa string JSON (termasuk stringify ganda
 * `"{\"a\":1}"`) hingga maksimal 3 lapis. Gagal parse → objek kosong
 * agar pemanggil mendapat EMPTY_INVITATION, bukan throw saat render publik.
 */
function unwrapContentJson(raw: unknown): unknown {
  let current = raw;
  for (let i = 0; i < 3 && typeof current === "string"; i++) {
    const trimmed = current.trim();
    if (trimmed === "") return {};
    try {
      current = JSON.parse(trimmed);
    } catch {
      return {};
    }
  }
  return current;
}

/**
 * Normalisasi content_json dari database ke InvitationContent.
 * Memetakan format lama (description/date/location/mapsUrl/imageUrl)
 * agar undangan yang sudah ada tetap tampil.
 *
 * Tahan terhadap content_json yang terbaca sebagai string JSON
 * (atau ter-stringify ganda) dari driver database — kasus ini membuat
 * halaman publik /p/[slug] tampil kosong padahal preview builder normal,
 * karena preview memakai state objek di memori sedangkan halaman publik
 * membaca hasil round-trip database.
 *
 * KONTRAK KEAMANAN: fungsi ini adalah satu-satunya pintu masuk data
 * konten ke lapisan render. Setiap properti URL (akadMapsUrl,
 * receptionMapsUrl, heroImage/coverImageUrl/imageUrl, backsoundUrl,
 * galleryImages) disanitasi lewat `safeHttpUrl()`, sehingga `javascript:`,
 * `data:`, dan URL non-http(s) tidak pernah sampai ke `href`/`src`.
 * Jangan pernah membaca content_json mentah di komponen — gunakan
 * fungsi ini.
 */
export function toInvitationContent(raw: unknown): InvitationContent {
  const unwrapped = unwrapContentJson(raw);
  if (!unwrapped || typeof unwrapped !== "object" || Array.isArray(unwrapped)) {
    return { ...EMPTY_INVITATION };
  }
  const c = unwrapped as Record<string, unknown>;
  // Semua URL dinormalisasi lewat safeHttpUrl() — entri non-http(s)
  // (javascript:/data:/relatif) dibuang saat DATA DIPBACA, bukan hanya
  // saat disimpan. Lihat catatan di safeHttpUrl.
  const gallery = Array.isArray(c.galleryImages)
    ? toUrlList(c.galleryImages)
    : toUrlList(c.galleryUrls);
  const galleryVideos = toUrlList(c.galleryVideos);
  const accounts = Array.isArray(c.accounts)
    ? c.accounts
        .filter(
          (a): a is Record<string, unknown> =>
            !!a && typeof a === "object" && !Array.isArray(a)
        )
        .map((a) => ({
          bank: str(a.bank),
          number: str(a.number),
          holder: str(a.holder),
          kind: a.kind === "ewallet" ? ("ewallet" as const) : ("bank" as const),
        }))
        .filter((a) => a.bank || a.number || a.holder)
    : [];

  // Fallback format lama
  const legacyDate = str(c.date);
  const legacyVenue = str(c.location);
  const legacyMaps = str(c.mapsUrl);

  return {
    quote: str(c.quote) || str(c.description),
    coupleOrder: normalizeCoupleOrder(c.coupleOrder),
    groomFullName: str(c.groomFullName),
    groomNickname: str(c.groomNickname),
    groomParents: str(c.groomParents),
    groomChildOrder: str(c.groomChildOrder),
    groomInstagram: str(c.groomInstagram),
    groomPhoto: safeHttpUrl(c.groomPhoto),
    brideFullName: str(c.brideFullName),
    brideNickname: str(c.brideNickname),
    brideParents: str(c.brideParents),
    brideChildOrder: str(c.brideChildOrder),
    brideInstagram: str(c.brideInstagram),
    bridePhoto: safeHttpUrl(c.bridePhoto),
    akadDate: str(c.akadDate) || legacyDate,
    akadTime: str(c.akadTime),
    akadTimezone: normalizeTimezone(c.akadTimezone),
    akadVenue: str(c.akadVenue) || legacyVenue,
    akadMapsUrl: safeHttpUrl(c.akadMapsUrl) || safeHttpUrl(legacyMaps),
    akadDresscode: str(c.akadDresscode),
    receptionDate: str(c.receptionDate) || legacyDate,
    receptionTime: str(c.receptionTime),
    receptionTimezone: normalizeTimezone(c.receptionTimezone),
    receptionVenue: str(c.receptionVenue) || legacyVenue,
    receptionMapsUrl: safeHttpUrl(c.receptionMapsUrl) || safeHttpUrl(legacyMaps),
    receptionDresscode: str(c.receptionDresscode),
    heroImage:
      safeHttpUrl(c.heroImage) ||
      safeHttpUrl(c.coverImageUrl) ||
      safeHttpUrl(c.imageUrl),
    galleryImages: gallery,
    galleryVideos,
    backsoundUrl: safeHttpUrl(c.backsoundUrl),
    accounts,
    giftAddress: str(c.giftAddress),
    liveStreamUrl: safeHttpUrl(c.liveStreamUrl),
    igFilterUrl: safeHttpUrl(c.igFilterUrl),
    musicRequestUrl: safeHttpUrl(c.musicRequestUrl),
    greeting: optStr(c.greeting),
    closingNote: optStr(c.closingNote),
    stories: toStories(c.stories),
  };
}

/**
 * Pilih teks sapaan untuk template: nilai kustom (termasuk string kosong
 * yang berarti "sembunyikan") menang atas salam bawaan template;
 * `undefined` (data lama) memakai fallback bawaan template.
 */
export function resolveGreeting(
  custom: string | undefined,
  fallback: string
): string {
  return custom !== undefined ? custom : fallback;
}

export function coupleNames(content: InvitationContent): string {
  const g = content.groomNickname || content.groomFullName || "Mempelai Pria";
  const b = content.brideNickname || content.brideFullName || "Mempelai Wanita";
  return content.coupleOrder === "groomFirst" ? `${g} & ${b}` : `${b} & ${g}`;
}

const WIB_OFFSET = "+07:00";
const WIB_TIMEZONE = "Asia/Jakarta";

export function formatDateLong(value: string): string {
  if (!value) return "Tanggal menyusul";
  const d = new Date(`${value}T00:00:00${WIB_OFFSET}`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", {
    timeZone: WIB_TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Nama hari dari tanggal ISO (yyyy-mm-dd), string kosong bila belum valid. */
export function dayNameFromDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const d = new Date(`${value}T00:00:00${WIB_OFFSET}`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("id-ID", {
    timeZone: WIB_TIMEZONE,
    weekday: "long",
  });
}

/**
 * URL profil Instagram dari handle (`@nama`, `nama`) atau URL lengkap.
 * Handle dibersihkan agar tidak bisa menyuntikkan path/skema berbahaya.
 */
export function instagramHref(value: unknown): string {
  if (typeof value !== "string") return "";
  const raw = value.trim();
  if (raw === "") return "";
  if (/^https?:\/\//i.test(raw)) return safeHttpUrl(raw);
  const handle = raw.replace(/^@/, "").replace(/[^a-zA-Z0-9._]/g, "");
  return handle ? `https://instagram.com/${handle}` : "";
}

/** YouTube / URL musik yang aman untuk dibuka di tab baru. */
export function safeExternalUrl(value: unknown): string {
  return safeHttpUrl(value);
}

/** Timestamp target countdown: prioritas Akad, fallback Resepsi. Null bila belum diisi. */
export function eventTimestamp(content: InvitationContent): number | null {
  const date = content.akadDate || content.receptionDate;
  if (!date) return null;
  const rawTime =
    (content.akadDate ? content.akadTime : content.receptionTime) || "00:00";
  // Validasi ketat HH:MM — tolak format longgar agar tidak diam-diam jadi 00:00.
  if (!/^\d{2}:\d{2}$/.test(rawTime)) return null;
  const [h, m] = rawTime.split(":").map(Number);
  if (h > 23 || m > 59) return null;
  const timezone = content.akadDate
    ? content.akadTimezone
    : content.receptionTimezone;
  const offset =
    timezone === "WITA" ? "+08:00" : timezone === "WIT" ? "+09:00" : WIB_OFFSET;
  const t = new Date(`${date}T${rawTime}:00${offset}`).getTime();
  return Number.isNaN(t) ? null : t;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

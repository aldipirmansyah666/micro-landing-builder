export interface GiftAccount {
  bank: string;
  number: string;
  holder: string;
}

export interface InvitationContent {
  quote: string;
  groomFullName: string;
  groomNickname: string;
  groomParents: string;
  brideFullName: string;
  brideNickname: string;
  brideParents: string;
  akadDate: string;
  akadTime: string;
  akadVenue: string;
  akadMapsUrl: string;
  receptionDate: string;
  receptionTime: string;
  receptionVenue: string;
  receptionMapsUrl: string;
  heroImage: string;
  galleryImages: string[];
  backsoundUrl: string;
  accounts: GiftAccount[];
}

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
  groomFullName: "",
  groomNickname: "",
  groomParents: "",
  brideFullName: "",
  brideNickname: "",
  brideParents: "",
  akadDate: "",
  akadTime: "",
  akadVenue: "",
  akadMapsUrl: "",
  receptionDate: "",
  receptionTime: "",
  receptionVenue: "",
  receptionMapsUrl: "",
  heroImage: "",
  galleryImages: [],
  backsoundUrl: "",
  accounts: [],
};

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
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
 */
export function toInvitationContent(raw: unknown): InvitationContent {
  const unwrapped = unwrapContentJson(raw);
  if (!unwrapped || typeof unwrapped !== "object" || Array.isArray(unwrapped)) {
    return { ...EMPTY_INVITATION };
  }
  const c = unwrapped as Record<string, unknown>;
  const gallery = Array.isArray(c.galleryImages)
    ? c.galleryImages.filter((u): u is string => typeof u === "string" && u !== "")
    : Array.isArray(c.galleryUrls)
      ? (c.galleryUrls as unknown[]).filter(
          (u): u is string => typeof u === "string" && u !== ""
        )
      : [];
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
        }))
        .filter((a) => a.bank || a.number || a.holder)
    : [];

  // Fallback format lama
  const legacyDate = str(c.date);
  const legacyVenue = str(c.location);
  const legacyMaps = str(c.mapsUrl);

  return {
    quote: str(c.quote) || str(c.description),
    groomFullName: str(c.groomFullName),
    groomNickname: str(c.groomNickname),
    groomParents: str(c.groomParents),
    brideFullName: str(c.brideFullName),
    brideNickname: str(c.brideNickname),
    brideParents: str(c.brideParents),
    akadDate: str(c.akadDate) || legacyDate,
    akadTime: str(c.akadTime),
    akadVenue: str(c.akadVenue) || legacyVenue,
    akadMapsUrl: str(c.akadMapsUrl) || legacyMaps,
    receptionDate: str(c.receptionDate) || legacyDate,
    receptionTime: str(c.receptionTime),
    receptionVenue: str(c.receptionVenue) || legacyVenue,
    receptionMapsUrl: str(c.receptionMapsUrl) || legacyMaps,
    heroImage:
      str(c.heroImage) || str(c.coverImageUrl) || str(c.imageUrl),
    galleryImages: gallery,
    backsoundUrl: str(c.backsoundUrl),
    accounts,
  };
}

export function coupleNames(content: InvitationContent): string {
  const g = content.groomNickname || content.groomFullName || "Mempelai Pria";
  const b = content.brideNickname || content.brideFullName || "Mempelai Wanita";
  return `${g} & ${b}`;
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
  const t = new Date(`${date}T${rawTime}:00${WIB_OFFSET}`).getTime();
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

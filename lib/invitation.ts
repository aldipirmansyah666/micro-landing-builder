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

export type TemplateId = "elegant" | "rustic" | "floral" | "minimalist";

export const TEMPLATE_OPTIONS: { value: TemplateId; label: string }[] = [
  { value: "elegant", label: "Elegant Gold" },
  { value: "rustic", label: "Rustic Earthy" },
  { value: "floral", label: "Floral Romance" },
  { value: "minimalist", label: "Modern Minimalist" },
];

/** Normalisasi template_type lama (minimal/elegant/modern) ke template baru. */
export function resolveTemplate(t: string): TemplateId {
  if (t === "elegant" || t === "rustic" || t === "floral" || t === "minimalist") {
    return t;
  }
  if (t === "modern") return "minimalist";
  return "minimalist";
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
 * Normalisasi content_json dari database ke InvitationContent.
 * Memetakan format lama (description/date/location/mapsUrl/imageUrl)
 * agar undangan yang sudah ada tetap tampil.
 */
export function toInvitationContent(raw: unknown): InvitationContent {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...EMPTY_INVITATION };
  }
  const c = raw as Record<string, unknown>;
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

export function formatDateLong(value: string): string {
  if (!value) return "Tanggal menyusul";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", {
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
  const time =
    (content.akadDate ? content.akadTime : content.receptionTime) || "00:00";
  const t = new Date(`${date}T${time.length === 5 ? time : "00:00"}:00`).getTime();
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

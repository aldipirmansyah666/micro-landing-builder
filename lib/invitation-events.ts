/**
 * Model data acara dinamis (Akad, Resepsi, dan acara tambahan lain).
 *
 * Modul ini sengaja SELF-CONTAINED — tidak mengimpor apapun dari
 * `lib/invitation.ts` — untuk menghindari circular dependency.
 * Helper mikro seperti `str`/`sanitizeHttpUrl` diduplikasi secara minimal
 * di sini (bukan di-import) karena fungsinya sangat kecil dan stabil.
 */

export type EventKind = "akad" | "reception" | "lainnya";
export type WeddingTimezone = "WIB" | "WITA" | "WIT";

export interface WeddingEventEntry {
  id: string;
  kind: EventKind;
  title: string;
  dayLabel: string;
  date: string;
  time: string;
  timezone: WeddingTimezone;
  venue: string;
  address: string;
  mapsUrl: string;
  dresscode: string;
  isPrimary: boolean;
}

export const MAX_EVENTS = 5;
export const MAX_EVENT_TITLE_LEN = 60;
export const MAX_EVENT_VENUE_LEN = 150;
export const MAX_EVENT_ADDRESS_LEN = 300;
export const MAX_EVENT_DRESSCODE_LEN = 120;

const WIB_OFFSET = "+07:00";

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function sanitizeHttpUrl(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (trimmed === "") return "";
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return "";
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
  return trimmed;
}

function normalizeEventTimezone(value: unknown): WeddingTimezone {
  return value === "WITA" || value === "WIT" ? value : "WIB";
}

function normalizeEventKind(value: unknown): EventKind {
  return value === "akad" || value === "reception" ? value : "lainnya";
}

/** Nama hari (contoh: "Sabtu") dari tanggal ISO yyyy-mm-dd. */
export function deriveDayLabel(isoDate: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return "";
  const d = new Date(`${isoDate}T00:00:00${WIB_OFFSET}`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("id-ID", { weekday: "long" });
}

/** Timestamp (epoch ms) untuk satu entri acara, memperhitungkan zona WIB/WITA/WIT. */
export function eventTimestampForEvent(ev: WeddingEventEntry): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ev.date)) return null;
  if (!/^\d{2}:\d{2}$/.test(ev.time)) return null;
  const [h, m] = ev.time.split(":").map(Number);
  if (h > 23 || m > 59) return null;
  const offset =
    ev.timezone === "WITA" ? "+08:00" : ev.timezone === "WIT" ? "+09:00" : WIB_OFFSET;
  const t = new Date(`${ev.date}T${ev.time}:00${offset}`).getTime();
  return Number.isNaN(t) ? null : t;
}

/** Pilih acara utama untuk countdown: yang ber-flag `isPrimary`, fallback ke entri pertama. */
export function primaryEvent(events: WeddingEventEntry[]): WeddingEventEntry | undefined {
  return events.find((e) => e.isPrimary) ?? events[0];
}

/**
 * Normalisasi & migrasi data acara dari `content_json` mentah.
 *
 * Dua jalur:
 * 1. Bila `raw.events` sudah berupa array berisi, entri dinormalisasi
 *    (bukan digabung dengan field legacy) agar tidak terjadi duplikasi.
 * 2. Bila `raw.events` kosong/tidak ada, bangun dari field legacy
 *    `akad*`/`reception*` yang hardcoded, sehingga undangan lama tetap
 *    tampil tanpa perlu migrasi database manual.
 *
 * Entri tanpa tanggal valid dibuang. URL maps disanitasi (hanya http/https).
 * Selalu dipanggil dari `toInvitationContent()` (lib/invitation.ts).
 */
export function migrateLegacyEvents(raw: Record<string, unknown>): WeddingEventEntry[] {
  const existing = Array.isArray(raw.events) ? raw.events : [];
  if (existing.length > 0) {
    const events: WeddingEventEntry[] = [];
    for (const e of existing) {
      if (!e || typeof e !== "object" || Array.isArray(e)) continue;
      const rec = e as Record<string, unknown>;
      const date = str(rec.date);
      if (!date) continue;
      events.push({
        id: str(rec.id) || `evt-${events.length}`,
        kind: normalizeEventKind(rec.kind),
        title: str(rec.title) || "Acara",
        dayLabel: str(rec.dayLabel) || deriveDayLabel(date),
        date,
        time: str(rec.time) || "09:00",
        timezone: normalizeEventTimezone(rec.timezone),
        venue: str(rec.venue),
        address: str(rec.address),
        mapsUrl: sanitizeHttpUrl(rec.mapsUrl),
        dresscode: str(rec.dresscode),
        isPrimary: !!rec.isPrimary,
      });
      if (events.length >= MAX_EVENTS) break;
    }
    let foundPrimary = false;
    for (const ev of events) {
      if (ev.isPrimary) {
        if (foundPrimary) ev.isPrimary = false;
        else foundPrimary = true;
      }
    }
    if (!foundPrimary && events.length > 0) events[0].isPrimary = true;
    return events;
  }

  const events: WeddingEventEntry[] = [];
  const push = (prefix: "akad" | "reception", kind: EventKind, title: string) => {
    const date = str(raw[`${prefix}Date`]);
    if (!date) return;
    events.push({
      id: `${prefix}-legacy`,
      kind,
      title,
      dayLabel: deriveDayLabel(date),
      date,
      time: str(raw[`${prefix}Time`]) || "09:00",
      timezone: normalizeEventTimezone(raw[`${prefix}Timezone`]),
      venue: str(raw[`${prefix}Venue`]),
      address: "",
      mapsUrl: sanitizeHttpUrl(raw[`${prefix}MapsUrl`]),
      dresscode: str(raw[`${prefix}Dresscode`]),
      isPrimary: events.length === 0,
    });
  };
  push("akad", "akad", "Akad Nikah");
  push("reception", "reception", "Resepsi");
  return events;
}

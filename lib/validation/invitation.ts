import { z } from "zod";
import {
  MAX_GREETING_LEN,
  MAX_CLOSING_NOTE_LEN,
  MAX_STORIES,
  MAX_STORY_TITLE_LEN,
  MAX_STORY_TEXT_LEN,
  MAX_GALLERY_VIDEOS,
} from "@/lib/invitation";
import {
  MAX_EVENTS,
  MAX_EVENT_TITLE_LEN,
  MAX_EVENT_VENUE_LEN,
  MAX_EVENT_ADDRESS_LEN,
  MAX_EVENT_DRESSCODE_LEN,
} from "@/lib/invitation-events";

/** Batas jumlah akun rekening/e-wallet yang didukung. */
export const MAX_ACCOUNTS = 5;
/** Batas jumlah foto galeri (diselaraskan dengan limit server di save-route). */
export const MAX_GALLERY_IMAGES = 12;

/**
 * URL http(s) aman — hanya protokol http/https yang diterima; nilai lain
 * (`javascript:`, `data:`, path relatif, dst.) ditolak. String kosong
 * selalu valid agar field bersifat opsional.
 */
const safeUrl = z
  .string()
  .max(500, "URL maksimal 500 karakter")
  .refine((v) => v === "" || /^https?:\/\//i.test(v), {
    message: "URL harus diawali http:// atau https://",
  });

/** Tanggal ISO (yyyy-mm-dd) atau string kosong (belum diisi). */
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
  .or(z.literal(""))
  .default("");

/** Jam (HH:mm) atau string kosong (belum diisi). */
const hhmm = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Format jam harus HH:mm")
  .or(z.literal(""))
  .default("");

/**
 * Varian DRAFT (longgar): field teks boleh string kosong agar pengguna
 * bisa menyimpan progres separuh jadi (mis. sudah mengetik nama bank
 * tetapi nomor rekening belum). Pemeriksaan "wajib terisi" ada di
 * `GiftAccountStrictSchema` untuk validasi per-langkah wizard.
 */
export const GiftAccountSchema = z.object({
  bank: z.string().max(40).default(""),
  number: z
    .string()
    .max(30)
    .regex(/^[0-9]*$/, "Nomor rekening hanya boleh berisi angka")
    .default(""),
  holder: z.string().max(80).default(""),
  kind: z.enum(["bank", "ewallet"]).optional(),
});
export type GiftAccountInput = z.infer<typeof GiftAccountSchema>;

/** Varian KETAT — dipakai `STEP_SCHEMAS.hadiah` (saat pengguna menekan "Lanjut"). */
export const GiftAccountStrictSchema = GiftAccountSchema.extend({
  bank: z.string().min(1, "Nama bank/e-wallet wajib diisi").max(40),
  number: z
    .string()
    .min(1, "Nomor rekening wajib diisi")
    .max(30)
    .regex(/^[0-9]+$/, "Nomor rekening hanya boleh berisi angka"),
  holder: z.string().min(1, "Nama pemilik wajib diisi").max(80),
});

/**
 * Varian DRAFT (longgar) — dipakai `InvitationContentSchema` untuk
 * penyimpanan. `title`/`venue` boleh kosong agar user yang baru mengisi
 * tanggal acara (belum mengetik nama/lokasi) tetap bisa menyimpan draf.
 */
export const StoryEntrySchema = z.object({
  title: z.string().max(MAX_STORY_TITLE_LEN).default(""),
  text: z.string().max(MAX_STORY_TEXT_LEN).default(""),
  dateLabel: z.string().max(30).default(""),
});
export type StoryEntryInput = z.infer<typeof StoryEntrySchema>;

/** Varian KETAT — dipakai `STEP_SCHEMAS.cerita`. */
export const StoryEntryStrictSchema = StoryEntrySchema.extend({
  title: z.string().min(1, "Judul cerita wajib diisi").max(MAX_STORY_TITLE_LEN),
  text: z.string().min(1, "Isi cerita wajib diisi").max(MAX_STORY_TEXT_LEN),
});

/**
 * Varian DRAFT (longgar) — dipakai `InvitationContentSchema` untuk
 * penyimpanan. `title`/`venue` boleh kosong agar user yang baru mengisi
 * tanggal acara (belum mengetik nama/lokasi) tetap bisa menyimpan draf.
 */
export const WeddingEventSchema = z.object({
  id: z.string().min(1).max(64),
  kind: z.enum(["akad", "reception", "lainnya"]),
  title: z.string().max(MAX_EVENT_TITLE_LEN).default(""),
  dayLabel: z.string().max(20).default(""),
  date: isoDate,
  time: hhmm,
  timezone: z.enum(["WIB", "WITA", "WIT"]),
  venue: z.string().max(MAX_EVENT_VENUE_LEN).default(""),
  address: z.string().max(MAX_EVENT_ADDRESS_LEN).default(""),
  mapsUrl: safeUrl,
  dresscode: z.string().max(MAX_EVENT_DRESSCODE_LEN).default(""),
  isPrimary: z.boolean(),
});
export type WeddingEventInput = z.infer<typeof WeddingEventSchema>;

/**
 * Varian KETAT — dipakai `STEP_SCHEMAS.acara` (saat pengguna menekan
 * "Lanjut"). `title`/`venue`/`date`/`time` wajib terisi valid (tanpa
 * izin string kosong seperti varian draft).
 */
export const WeddingEventStrictSchema = WeddingEventSchema.extend({
  title: z.string().min(1, "Nama acara wajib diisi").max(MAX_EVENT_TITLE_LEN),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Format jam harus HH:mm"),
  venue: z.string().min(1, "Lokasi acara wajib diisi").max(MAX_EVENT_VENUE_LEN),
});

/**
 * Schema kanonik InvitationContent (bentuk flat yang dikonsumsi template).
 * Sengaja mengikuti struktur `InvitationContent` di lib/invitation.ts
 * (bukan bentuk bertingkat) agar lolos validasi ini = pasti assign ke
 * tipe TypeScript tanpa cast.
 *
 * CATATAN DRAFT vs PUBLISH: schema ini DISENGAJA longgar terhadap
 * ketiadaan data wajib (nama mempelai boleh string kosong) karena
 * endpoint simpan (`/api/pages/save`) menangani *draft* — pengguna
 * boleh menyimpan progres separuh jadi kapan saja. Pemeriksaan
 * ketat "wajib terisi" ada di `STEP_SCHEMAS.mempelai` / `STEP_SCHEMAS.acara`
 * yang dipakai per-langkah wizard (validasi saat pengguna menekan
 * "Lanjut"), BUKAN di sini.
 */
export const InvitationContentSchema = z.object({
  quote: z.string().max(500).default(""),
  coupleOrder: z.enum(["brideFirst", "groomFirst"]),

  groomFullName: z.string().max(120).default(""),
  groomNickname: z.string().max(40).default(""),
  groomParents: z.string().max(160).default(""),
  groomChildOrder: z.string().max(40).default(""),
  groomInstagram: z.string().max(60).default(""),
  groomPhoto: safeUrl,

  brideFullName: z.string().max(120).default(""),
  brideNickname: z.string().max(40).default(""),
  brideParents: z.string().max(160).default(""),
  brideChildOrder: z.string().max(40).default(""),
  brideInstagram: z.string().max(60).default(""),
  bridePhoto: safeUrl,

  akadDate: isoDate,
  akadTime: hhmm,
  akadTimezone: z.enum(["WIB", "WITA", "WIT"]),
  akadVenue: z.string().max(MAX_EVENT_VENUE_LEN).default(""),
  akadMapsUrl: safeUrl,
  akadDresscode: z.string().max(MAX_EVENT_DRESSCODE_LEN).default(""),

  receptionDate: isoDate,
  receptionTime: hhmm,
  receptionTimezone: z.enum(["WIB", "WITA", "WIT"]),
  receptionVenue: z.string().max(MAX_EVENT_VENUE_LEN).default(""),
  receptionMapsUrl: safeUrl,
  receptionDresscode: z.string().max(MAX_EVENT_DRESSCODE_LEN).default(""),

  events: z.array(WeddingEventSchema).max(MAX_EVENTS).default([]),

  heroImage: safeUrl,
  galleryImages: z.array(safeUrl).max(MAX_GALLERY_IMAGES).default([]),
  galleryVideos: z.array(safeUrl).max(MAX_GALLERY_VIDEOS).default([]),
  backsoundUrl: safeUrl,

  accounts: z.array(GiftAccountSchema).max(MAX_ACCOUNTS).default([]),
  giftAddress: z.string().max(400).default(""),

  liveStreamUrl: safeUrl,
  igFilterUrl: safeUrl,
  musicRequestUrl: safeUrl,

  greeting: z.string().max(MAX_GREETING_LEN).optional(),
  closingNote: z.string().max(MAX_CLOSING_NOTE_LEN).optional(),
  stories: z.array(StoryEntrySchema).max(MAX_STORIES).optional(),
});
export type InvitationContentInput = z.infer<typeof InvitationContentSchema>;

/** Slug undangan: huruf kecil, angka, strip; maksimal 60 karakter. */
export const SlugSchema = z
  .string()
  .min(1, "Slug wajib diisi")
  .max(60, "Slug maksimal 60 karakter")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan strip");

export const STEP_SCHEMAS = {
  template: z.object({
    slug: SlugSchema,
    title: z.string().min(1, "Judul wajib diisi").max(120),
    templateType: z.string().min(1, "Template wajib dipilih"),
  }),
  mempelai: z.object({
    coupleOrder: z.enum(["brideFirst", "groomFirst"]),
    groomFullName: z.string().min(1, "Nama lengkap mempelai pria wajib diisi").max(120),
    groomNickname: z.string().min(1, "Nama panggilan mempelai pria wajib diisi").max(40),
    groomParents: z.string().max(160),
    groomChildOrder: z.string().max(40),
    groomInstagram: z.string().max(60),
    groomPhoto: safeUrl,
    brideFullName: z.string().min(1, "Nama lengkap mempelai wanita wajib diisi").max(120),
    brideNickname: z.string().min(1, "Nama panggilan mempelai wanita wajib diisi").max(40),
    brideParents: z.string().max(160),
    brideChildOrder: z.string().max(40),
    brideInstagram: z.string().max(60),
    bridePhoto: safeUrl,
  }),
  acara: z.object({
    events: z
      .array(WeddingEventStrictSchema)
      .min(1, "Minimal 1 acara wajib diisi")
      .max(MAX_EVENTS),
  }),
  cerita: z.object({
    greeting: z.string().max(MAX_GREETING_LEN).optional(),
    closingNote: z.string().max(MAX_CLOSING_NOTE_LEN).optional(),
    stories: z.array(StoryEntryStrictSchema).max(MAX_STORIES).optional(),
  }),
  media: z.object({
    heroImage: safeUrl,
    galleryImages: z.array(safeUrl).max(MAX_GALLERY_IMAGES),
    galleryVideos: z.array(safeUrl).max(MAX_GALLERY_VIDEOS),
    backsoundUrl: safeUrl,
  }),
  hadiah: z.object({
    accounts: z.array(GiftAccountStrictSchema).max(MAX_ACCOUNTS),
    giftAddress: z.string().max(400),
    liveStreamUrl: safeUrl,
    igFilterUrl: safeUrl,
    musicRequestUrl: safeUrl,
  }),
} as const;

export type StepId = keyof typeof STEP_SCHEMAS;

/**
 * Validasi per-langkah wizard. Hanya subset field yang relevan dengan
 * langkah tersebut yang diperiksa, sehingga user tidak diblokir oleh
 * error di langkah yang belum ia buka.
 */
export function validateStep<K extends StepId>(
  step: K,
  data: unknown
):
  | { success: true; data: z.infer<(typeof STEP_SCHEMAS)[K]> }
  | { success: false; error: z.ZodError } {
  // Cast aman: `STEP_SCHEMAS[step]` di runtime selalu tepat satu skema
  // untuk key `K`, tetapi TypeScript tidak bisa mengorelasikan generic
  // index access dengan union return type secara statis.
  return STEP_SCHEMAS[step].safeParse(data) as
    | { success: true; data: z.infer<(typeof STEP_SCHEMAS)[K]> }
    | { success: false; error: z.ZodError };
}

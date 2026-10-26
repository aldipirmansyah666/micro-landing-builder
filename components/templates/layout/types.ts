import type { ReactNode } from "react";
import type { CoupleEntry, EventEntry } from "../parts";

/**
 * Konfigurasi visual untuk `InvitationLayout` universal.
 *
 * FILOSOFI: yang DIBERIKAN ke layout adalah *gaya* (class string), bukan
 * markup. Dengan begitu:
 *   - logika data (iterasi pasangan, kartu acara, galeri, rekening)
 *     ditulis SATU KALI di komponen section — bukan 18 kali;
 *   - tiap template tetap bebas memakai class miliknya sendiri, sehingga
 *     hasil render tidak berubah satu pixel pun saat diekstrak;
 *   - redesign berikutnya cukup menulis ulang `config` (atau menukar
 *     palet), bukan menyunting ulang 18 file.
 *
 * Class string di sini sengaja LITERAL, bukan variabel CSS, supaya hasil
 * render identik dengan versi sebelum ekstraksi. Palet terpusat
 * (`lib/palettes.ts`) adalah sumber kebenaran untuk nilai warnanya, dan
 * `scripts/check-palette-coverage.mjs` menjaga agar tetap sinkron.
 */

/** Class statis, atau resolver berdasarkan entri & indeks. */
export type StyleClass<T> =
  | string
  | ((entry: T, index: number, total: number) => string);

/** Cara susun baris pasangan. */
export type CoupleLayout = "stack" | "row" | "between" | "editorial";

export interface CoupleSectionStyle {
  /** Tata letak baris pasangan. */
  layout: CoupleLayout;
  /** Class wrapper tambahan untuk heading + daftar pasangan. */
  wrapper?: string;
  /** Class wrapper daftar pasangan; kosongkan untuk tanpa wrapper. */
  list?: string;
  /** Bungkus tiap pasangan dengan Reveal sendiri (bukan satu Reveal section). */
  revealItems?: boolean;
  /** Tempatkan heading di dalam wrapper `list` (mis. Verdant). */
  headingInsideList?: boolean;
  /** Class pembungkus tiap pasangan. */
  item: StyleClass<CoupleEntry>;
  /** Class nama panggilan. */
  name: StyleClass<CoupleEntry>;
  /** Class nama lengkap (hanya tampil bila beda dari nama panggilan). */
  full: StyleClass<CoupleEntry>;
  /** Class baris orang tua / anak ke- / Instagram. */
  parents: StyleClass<CoupleEntry>;
  /** Class label mempelai ("Putra dari") bila `labelAbove` aktif. */
  labelClass?: StyleClass<CoupleEntry>;
  /** Class untuk nama lengkap di layout "row" (berbeda penempatannya). */
  fullInRow?: StyleClass<CoupleEntry>;
  /** Judul opsional di atas daftar pasangan. */
  heading?: ReactNode;
  /** Class foto pada layout stack/editorial/between. */
  photoClass?: string;
  /** Class foto pada layout row. */
  rowPhotoClass?: string;
  /** Tampilkan label ("Putra dari"/"Putri dari") sebagai baris sendiri. */
  labelAbove?: boolean;
  /** Sertakan label di baris orang tua (default true). */
  parentsIncludeLabel?: boolean;
  /** Class tambahan untuk tautan Instagram. */
  instagramClass?: string;
  /** Konfigurasi layout "between" (mis. Minimalist Mono). */
  between?: {
    nameWrap: string;
    parents: string;
  };
  /** Konfigurasi layout "editorial" (mis. Élan). */
  editorial?: {
    wrapper: string;
    nameWrap: string;
    indexClass: string;
    indexFormat?: (index: number) => string;
  };
}

export interface StorySectionStyle {
  heading: string;
  sectionClass: string;
  headingClass: string;
  itemClass: string;
  marker: ReactNode;
  titleClass: string;
  textClass: string;
}

export interface CountdownSectionStyle {
  /** Class wrapper section countdown. */
  wrapper: string;
  /** Teks judul section (dipakai bila `heading` tidak diisi). */
  title?: string;
  /** Class judul section. */
  headingClass?: string;
  /** Class ikon di samping judul. */
  headingIcon?: string;
  /** Judul lengkap; bila diisi, menggantikan title/headingClass/icon. */
  heading?: ReactNode;
  /** Class grid berisi kotak countdown. */
  grid: string;
  /** Class tiap kotak countdown. */
  box: string;
  /** Class angka countdown. */
  value: string;
  /** Class label countdown. */
  label: string;
  /** Class fallback saat tanggal belum diisi / acara sudah lewat. */
  fallback: string;
  /** Teks fallback saat acara sudah lewat. */
  passedText: string;
  /** Teks fallback saat tanggal belum diisi. */
  pendingText: string;
  /** Label hari/jam/menit/detik. */
  labels?: {
    days: string;
    hours: string;
    mins: string;
    secs: string;
  };
}

/** Bentuk kartu acara. */
export type EventLayout = "card" | "rule" | "split" | "numbered" | "mono";

export interface EventSectionStyle {
  layout: EventLayout;
  /** Class pembungkus tiap kartu acara. */
  item: StyleClass<EventEntry>;
  /** Class wrapper dalam (mis. bingkai ganda). */
  inner?: string;
  /** Class header/baris judul (split/numbered/mono). */
  header?: string;
  /** Class isi kartu (split/numbered/mono/rule). */
  body?: string;
  /** Class nama acara. */
  name: string;
  /** Format nama acara (mis. "01 — Akad"). */
  nameFormat?: (entry: EventEntry, index: number) => ReactNode;
  /** Class tanggal acara. */
  date: string;
  /** Class jam acara + dresscode. */
  time: string;
  /** Teks sebelum jam (mis. "Pukul "). */
  timePrefix?: string;
  /** Teks setelah jam (mis. " WIB"). */
  timeSuffix?: string;
  /** Class lokasi acara. */
  venue: string;
  /** Class ikon lokasi. */
  venueIcon?: string;
  /** Class tombol "Lihat Lokasi". */
  maps: string;
  /** Label tombol lokasi. */
  mapsLabel: string;
  /** Ikon di atas/awal nama acara. */
  icon?: ReactNode;
  /** Ikon di dalam tombol maps. */
  mapsIcon?: ReactNode;
  /** Posisi ikon maps relatif terhadap label (default sebelum). */
  mapsIconPosition?: "before" | "after";
  /** Ornamen setelah nama acara (mis. garis pemisah). */
  nameDivider?: ReactNode;
  /** Format nomor header untuk layout "numbered". */
  headerIndexFormat?: (index: number) => string;
  /** Ikon di kanan header untuk layout "numbered". */
  headerIcon?: ReactNode;
}

export interface GallerySectionStyle {
  /** Class wrapper section galeri. */
  wrapper: string;
  /** Teks judul section (dipakai bila `heading` tidak diisi). */
  title?: string;
  /** Class judul section. */
  headingClass?: string;
  /** Class ikon di samping judul. */
  headingIcon?: string;
  /** Judul lengkap; bila diisi, menggantikan title/headingClass/icon. */
  heading?: ReactNode | ((count: number) => ReactNode);
  /** Class grid galeri. */
  grid: string;
  /** Class tiap foto/video. */
  image: StyleClass<string>;
  /** Format alt foto galeri (default "Galeri"). */
  altFormat?: (index: number) => string;
}

export interface AccountsSectionStyle {
  /** Class wrapper section rekening. */
  wrapper: string;
  /** Teks judul section (dipakai bila `heading` tidak diisi). */
  title?: string;
  /** Class judul section. */
  headingClass?: string;
  /** Class ikon di samping judul. */
  headingIcon?: string;
  /** Judul lengkap; bila diisi, menggantikan title/headingClass/icon. */
  heading?: ReactNode;
  /** Susun tombol salin di bawah (stack) atau di kanan (row). */
  layout: "stack" | "row";
  /** Class daftar rekening. */
  list: string;
  /** Class tiap kartu rekening. */
  item: string;
  /** Class pembungkus isi kartu (dipakai pada layout row). */
  contentClass?: string;
  /** Class nama bank. */
  bank: string;
  /** Class nomor rekening. */
  number: string;
  /** Class nama pemilik rekening. */
  holder: string;
  /** Class pembungkus tombol salin; kosongkan untuk tanpa wrapper. */
  copyWrapper?: string;
  /** Class tombol salin. */
  copy: string;
  /** Label untuk alamat kirim kado fisik. */
  giftLabel?: string;
}

export interface ExtraLinksSectionStyle {
  wrapper: string;
  heading?: ReactNode;
  grid: string;
  link: string;
  iconClass?: string;
}

export interface RsvpSectionStyle {
  /** Class wrapper section RSVP. */
  wrapper: string;
  /** Judul opsional di atas form. */
  heading?: ReactNode;
  /** Class wrapper di dalam slot RSVP (opsional). */
  inner?: string;
}

export interface ClosingRenderContext {
  note: string | undefined;
  names: string;
  defaultText: string;
}

export interface ClosingSectionStyle {
  /** Class penutup bawaan. */
  wrapper: string;
  /** Class baris nama di bawah penutup. */
  names: string;
  /** Teks penutup bawaan — dipakai saat pengguna tidak mengisi closingNote. */
  defaultText: string;
  /** Override markup penutup untuk template yang bentuknya berbeda. */
  render?: (context: ClosingRenderContext) => ReactNode;
}

/** Konfigurasi cover overlay (dipakai saat undangan belum dibuka). */
export interface CoverStyle {
  overlayClass: string;
  titleFont: string;
  kicker: string;
  note: string;
  buttonClass: string;
}

/**
 * Konfigurasi lengkap satu template untuk `InvitationLayout`.
 */
export interface InvitationLayoutConfig {
  /** Class elemen root halaman. */
  root: string;
  /** Class wrapper konten utama. */
  container: string;
  /** Wrapper opsional untuk semua section setelah hero (mis. Parisian). */
  sectionsWrapper?: string;
  /** Gaya cover overlay. */
  cover: CoverStyle;
  /** Gaya blok pasangan. */
  couple: CoupleSectionStyle;
  /** Gaya timeline cerita. */
  story: StorySectionStyle;
  /** Gaya countdown. */
  countdown: CountdownSectionStyle;
  /** Gaya kartu acara. */
  event: EventSectionStyle;
  /** Gaya galeri. */
  gallery: GallerySectionStyle;
  /** Gaya rekening / amplop digital. */
  accounts: AccountsSectionStyle;
  /** Gaya tautan acara (live streaming, filter IG, request musik). */
  extraLinks: ExtraLinksSectionStyle;
  /** Gaya slot RSVP. */
  rsvp: RsvpSectionStyle;
  /** Gaya penutup. */
  closing: ClosingSectionStyle;
}

/**
 * Slot konten yang terlalu khas untuk distandarkan — tiap template bebas
 * menentukan sendiri. `InvitationLayout` hanya menentukan POSISI-nya.
 */
export interface InvitationLayoutSlots {
  /** Elemen dekoratif di belakang seluruh halaman. */
  background?: ReactNode;
  /** Blok di luar container, tepat setelah cover (mis. hero full-bleed). */
  beforeContainer?: ReactNode;
  /** Blok di luar container, setelah semua section (mis. pita bawah). */
  afterContainer?: ReactNode;
  /** Blok header: kicker, nama pasangan, tanggal, ornamen. */
  hero?: ReactNode;
  /** Foto utama / foto cover versi "terbuka". */
  heroImage?: ReactNode;
  /** Kutipan pengguna. */
  quote?: ReactNode;
  /** Blok sebelum section pasangan, di luar Reveal pasangan. */
  beforeCouple?: ReactNode;
  /** Konten yang dirender DI DALAM reveal pasangan (mis. sapaan). */
  coupleLeading?: ReactNode;
}

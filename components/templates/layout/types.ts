import type { ReactNode } from "react";

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

/** Cara susun baris pasangan: bertumpuk vertikal atau berbaris kiri-kanan. */
export type CoupleLayout = "stack" | "row";

/** Bentuk kartu acara: kartu utuh, atau panel dengan header + isi. */
export type EventLayout = "card" | "rule";

export interface CoupleSectionStyle {
  /** Tata letak baris pasangan. */
  layout: CoupleLayout;
  /** Class wrapper daftar pasangan. */
  list: string;
  /** Class pembungkus tiap pasangan. */
  item: string;
  /** Class nama panggilan. */
  name: string;
  /** Class nama lengkap (hanya tampil bila beda dari nama panggilan). */
  full: string;
  /** Class baris orang tua. */
  parents: string;
  /** Class untuk nama lengkap di layout "row" (berbeda penempatannya). */
  fullInRow?: string;
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
  /** Teks judul section. */
  title: string;
  /** Class judul section. */
  headingClass: string;
  /** Class ikon di samping judul. */
  headingIcon?: string;
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
}

export interface EventSectionStyle {
  layout: EventLayout;
  /** Class pembungkus tiap kartu acara. */
  item: string;
  /** Class nama acara. */
  name: string;
  /** Class tanggal acara. */
  date: string;
  /** Class jam acara. */
  time: string;
  /** Teks sebelum jam (mis. "Pulan "). */
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
  /** Ikon di atas nama acara (layout "card"). */
  icon?: ReactNode;
  /** Class header pada layout "rule". */
  ruleHeader?: string;
  /** Class isi pada layout "rule". */
  ruleBody?: string;
}

export interface GallerySectionStyle {
  /** Class wrapper section galeri. */
  wrapper: string;
  /** Teks judul section. */
  title: string;
  /** Class judul section. */
  headingClass: string;
  /** Class ikon di samping judul. */
  headingIcon?: string;
  /** Class grid galeri. */
  grid: string;
  /** Class tiap foto. */
  image: string;
}

export interface AccountsSectionStyle {
  /** Class wrapper section rekening. */
  wrapper: string;
  /** Teks judul section. */
  title: string;
  /** Class judul section. */
  headingClass: string;
  /** Class ikon di samping judul. */
  headingIcon?: string;
  /** Class daftar rekening. */
  list: string;
  /** Class tiap kartu rekening. */
  item: string;
  /** Class nama bank. */
  bank: string;
  /** Class nomor rekening. */
  number: string;
  /** Class nama pemilik rekening. */
  holder: string;
  /** Class pembungkus tombol salin. */
  copyWrapper: string;
  /** Class tombol salin. */
  copy: string;
}

export interface RsvpSectionStyle {
  /** Class wrapper section RSVP. */
  wrapper: string;
  /** Class wrapper di dalam slot RSVP. */
  inner: string;
}

export interface ClosingSectionStyle {
  /** Class penutup. */
  wrapper: string;
  /** Class baris nama di bawah penutup. */
  names: string;
  /** Teks penutup bawaan — dipakai saat pengguna tidak mengisi closingNote. */
  defaultText: string;
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
  /** Blok header: kicker, nama pasangan, tanggal, ornamen. */
  hero?: ReactNode;
  /** Foto utama / foto cover versi "terbuka". */
  heroImage?: ReactNode;
  /** Kutipan pengguna. */
  quote?: ReactNode;
  /** Konten yang dirender DI DALAM reveal pasangan (mis. sapaan). */
  coupleLeading?: ReactNode;
}

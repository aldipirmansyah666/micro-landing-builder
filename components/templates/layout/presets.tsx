import type { InvitationLayoutConfig } from "./types";

/**
 * Preset konfigurasi layout untuk ARUNA — Minimalist Elegant.
 *
 * Class string di bawah adalah SALINAN LITERAL dari `ArunaTemplate.tsx`
 * sebelum diekstrak. Itu disengaja: dengan begitu hasil render yang
 * dihasilkan `InvitationLayout` byte-per-byte identik dengan versi lama,
 * dan bukti paritas bisa dicek otomatis lewat diff HTML.
 *
 * Untuk template lain, preset baru cukup menyalin blok di sini lalu
 * mengganti class-nya — tanpa perlu menyentuh logika section sama sekali.
 */

/** Class heading section yang dipakai bersama beberapa section. */
const SECTION_HEADING =
  "flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#9a8a5f] uppercase";

/** Class wrapper section dengan garis pemisah atas. */
const SECTION_WRAPPER = "mt-12 border-t border-[#c9a96a]/40 pt-8";

export const ARUNA_LAYOUT: InvitationLayoutConfig = {
  root: "relative min-h-full bg-[#faf7f0] font-serif text-[#3d3a34] antialiased",
  container: "mx-auto max-w-md px-8 py-14",

  cover: {
    overlayClass: "bg-[#faf7f0] text-[#3d3a34]",
    titleFont: "font-serif",
    kicker: "The Wedding Of",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass: "bg-[#3d3a34] text-[#faf7f0] shadow-lg",
  },

  couple: {
    layout: "stack",
    list: "mt-6 space-y-8",
    item: "text-center",
    name: "text-3xl font-medium text-[#2e2b26]",
    full: "mt-1 font-sans text-sm text-[#5c574c]",
    parents: "mt-2 font-sans text-xs text-[#8a8474]",
    photoClass:
      "mx-auto mb-4 h-28 w-28 rounded-full border border-[#c9a96a]/40 object-cover",
  },

  story: {
    heading: "Cerita Kami",
    sectionClass: "mt-12 border-t border-[#c9a96a]/40 pt-8 text-center",
    headingClass: "text-[11px] tracking-[0.4em] text-[#9a8a5f] uppercase",
    itemClass: "mx-auto max-w-sm",
    marker: <span aria-hidden className="text-[#c9a96a]">✦</span>,
    titleClass: "mt-1 text-xl font-medium text-[#2e2b26]",
    textClass: "mx-auto mt-2 max-w-sm font-sans text-sm leading-7 text-[#5c574c]",
  },

  countdown: {
    wrapper: "mt-12 border-t border-[#c9a96a]/40 pt-8 text-center",
    title: "Menghitung Hari",
    headingClass: SECTION_HEADING,
    headingIcon: "h-3.5 w-3.5",
    grid: "mt-5 grid grid-cols-4 gap-2",
    box: "rounded-xl border border-[#c9a96a]/40 bg-white/70 px-2 py-4",
    value: "text-2xl text-[#2e2b26]",
    label: "mt-0.5 font-sans text-[10px] tracking-widest text-[#8a8474] uppercase",
    fallback: "col-span-4 font-sans text-sm text-[#8a8474]",
    passedText: "Acara telah berlangsung. Terima kasih!",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "card",
    item:
      "mt-8 rounded-2xl border border-[#e4d9c2] bg-white/80 px-6 py-7 text-center shadow-sm",
    name: "font-sans text-[11px] tracking-[0.35em] text-[#9a8a5f] uppercase",
    date: "mt-3 text-xl",
    time: "mt-1 font-sans text-sm text-[#5c574c]",
    timePrefix: "Pukul ",
    timeSuffix: " WIB",
    venue:
      "mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-[#5c574c]",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0 text-[#9a8a5f]",
    maps:
      "mt-5 inline-flex h-11 items-center rounded-full border border-[#3d3a34] px-6 font-sans text-sm font-medium transition-colors hover:bg-[#3d3a34] hover:text-white",
    mapsLabel: "Lihat Lokasi",
  },

  gallery: {
    wrapper: SECTION_WRAPPER,
    title: "Galeri",
    headingClass: SECTION_HEADING,
    headingIcon: "h-3.5 w-3.5",
    grid: "mt-5 grid grid-cols-2 gap-2",
    image: "aspect-[3/4] w-full rounded-xl object-cover",
  },

  accounts: {
    layout: "stack",
    wrapper: SECTION_WRAPPER,
    title: "Tanda Kasih",
    headingClass: SECTION_HEADING,
    headingIcon: "h-3.5 w-3.5",
    list: "mt-5 space-y-3",
    item:
      "rounded-2xl border border-[#e4d9c2] bg-white/80 px-5 py-5 text-center",
    bank: "font-sans text-xs tracking-[0.25em] text-[#9a8a5f] uppercase",
    number: "mt-1 font-sans text-lg font-semibold tracking-wide tabular-nums",
    holder: "mt-0.5 font-sans text-xs text-[#8a8474]",
    copyWrapper: "mt-3",
    copy: "bg-[#3d3a34] text-white",
  },

  extraLinks: {
    wrapper: "mt-12 border-t border-[#c9a96a]/40 pt-8 text-center",
    grid: "mt-5 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#3d3a34] px-6 font-sans text-sm font-medium transition-colors hover:bg-[#3d3a34] hover:text-white",
  },

  rsvp: {
    wrapper: SECTION_WRAPPER,
    inner: "font-sans [&_input]:bg-white [&_textarea]:bg-white",
  },

  closing: {
    wrapper: "mt-12 text-center text-sm text-[#8a8474]",
    names: "mt-2 text-center text-xs tracking-[0.3em] text-[#9a8a5f] uppercase",
    defaultText: "Terima kasih atas doa & kehadiran Anda",
  },
};

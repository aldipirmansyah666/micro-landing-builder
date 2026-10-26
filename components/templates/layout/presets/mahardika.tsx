import { Gift, Images, Navigation, Sparkles } from "lucide-react";
import type { InvitationLayoutConfig } from "../types";

export const MAHARDIKA_LAYOUT: InvitationLayoutConfig = {
  root: "relative min-h-full bg-[#0c2b23] font-serif text-[#f5efe0] antialiased",
  container: "relative px-9 py-14",

  cover: {
    overlayClass: "bg-[#0c2b23]/95 text-[#f5efe0]",
    titleFont: "font-serif",
    kicker: "Undangan Pernikahan",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass: "bg-[#c9a96a] text-[#0c2b23]",
  },

  couple: {
    layout: "stack",
    list: "mt-10 space-y-0 border-y border-[#c9a96a]/40",
    item: (_, index) =>
      `py-6 text-center ${index > 0 ? "border-t border-[#c9a96a]/25" : ""}`,
    name: "text-2xl font-semibold text-[#f2e7c9]",
    full: "mt-1 font-sans text-sm text-[#f5efe0]/65",
    parents: "mt-2 font-sans text-xs tracking-wide text-[#f5efe0]/55",
    photoClass:
      "mx-auto mb-4 h-28 w-28 rounded-full border border-[#c9a96a]/40 object-cover",
  },

  story: {
    heading: "Kisah Kami",
    sectionClass: "mt-10 border-y border-[#c9a96a]/40 py-8 text-center",
    headingClass: "text-[11px] tracking-[0.4em] text-[#c9a96a] uppercase",
    itemClass: "mx-auto max-w-xs",
    marker: (
      <span
        aria-hidden
        className="text-[10px] tracking-[0.5em] text-[#c9a96a]"
      >
        ◆ ◆ ◆
      </span>
    ),
    titleClass: "mt-2 text-xl font-semibold text-[#f2e7c9]",
    textClass: "mt-2 font-sans text-sm leading-7 text-[#f5efe0]/70",
  },

  countdown: {
    wrapper: "mt-10 text-center",
    heading: (
      <p className="text-[11px] tracking-[0.4em] text-[#c9a96a] uppercase">
        Menuju Hari Bahagia
      </p>
    ),
    grid:
      "mx-auto mt-5 grid max-w-xs grid-cols-4 gap-px border border-[#c9a96a]/50 bg-[#c9a96a]/50",
    box: "bg-[#0c2b23] px-2 py-4",
    value: "text-2xl text-[#f2e7c9]",
    label:
      "mt-0.5 font-sans text-[10px] tracking-widest text-[#f5efe0]/55 uppercase",
    fallback:
      "col-span-4 bg-[#0c2b23] px-2 py-4 font-sans text-sm text-[#f5efe0]/70",
    passedText: "Acara telah berlangsung. Terima kasih.",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "card",
    item: "mt-8 border border-[#c9a96a]/50 px-6 py-7 text-center",
    name: "text-[11px] tracking-[0.4em] text-[#c9a96a] uppercase",
    date: "mt-3 text-xl text-[#f2e7c9]",
    time: "mt-1 font-sans text-sm text-[#f5efe0]/70",
    timePrefix: "Pukul ",
    venue:
      "mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-[#f5efe0]/80",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0 text-[#c9a96a]",
    maps:
      "mt-5 inline-flex h-11 items-center gap-2 bg-[#c9a96a] px-6 font-sans text-sm font-semibold text-[#0c2b23] transition-opacity hover:opacity-90",
    mapsLabel: "Petunjuk Arah",
    mapsIcon: <Navigation className="h-4 w-4" />,
  },

  gallery: {
    wrapper: "mt-10 text-center",
    heading: (
      <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.4em] text-[#c9a96a] uppercase">
        <Images className="h-3.5 w-3.5" /> Galeri
      </p>
    ),
    grid: "mt-5 grid grid-cols-2 gap-2",
    image: "aspect-square w-full border border-[#c9a96a]/40 object-cover",
  },

  accounts: {
    layout: "stack",
    wrapper: "mt-10 text-center",
    heading: (
      <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.4em] text-[#c9a96a] uppercase">
        <Gift className="h-3.5 w-3.5" /> Amplop Digital
      </p>
    ),
    list: "mt-5 space-y-3",
    item: "border border-[#c9a96a]/50 px-5 py-5",
    bank: "font-sans text-xs tracking-[0.3em] text-[#c9a96a] uppercase",
    number:
      "mt-1 font-sans text-xl font-semibold tracking-wider text-[#f2e7c9] tabular-nums",
    holder: "mt-0.5 font-sans text-xs text-[#f5efe0]/55",
    copyWrapper: "mt-3",
    copy: "bg-[#c9a96a] text-[#0c2b23]",
  },

  extraLinks: {
    wrapper: "mt-10 text-center",
    heading: (
      <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.4em] text-[#c9a96a] uppercase">
        <Sparkles className="h-3.5 w-3.5" /> Tautan Acara
      </p>
    ),
    grid: "mt-5 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 border border-[#c9a96a]/60 px-6 font-sans text-sm font-semibold text-[#f5efe0] transition-colors hover:bg-[#c9a96a] hover:text-[#0c2b23]",
  },

  rsvp: {
    wrapper:
      "mt-10 border-t border-[#c9a96a]/40 pt-6 [&_input]:border-[#c9a96a]/30 [&_input]:bg-white/5 [&_textarea]:border-[#c9a96a]/30 [&_textarea]:bg-white/5",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "Terima kasih",
    render: ({ note, names }) => (
      <>
        <div aria-hidden className="mx-auto mt-10 max-w-64">
          <div className="h-px bg-[#c9a96a]/60" />
          <p className="py-2 text-center text-[10px] tracking-[0.5em] text-[#c9a96a]">
            ◆ ◆ ◆
          </p>
          <div className="h-px bg-[#c9a96a]/60" />
        </div>
        <p className="mt-4 text-center font-sans text-xs text-[#f5efe0]/60">
          {note !== undefined ? note || names : `${names} — Terima kasih`}
        </p>
      </>
    ),
  },
};

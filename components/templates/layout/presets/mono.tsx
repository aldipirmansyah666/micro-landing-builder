import { Gift, Images } from "lucide-react";
import type { InvitationLayoutConfig } from "../types";

export const MONO_LAYOUT: InvitationLayoutConfig = {
  root: "relative min-h-full bg-white font-sans text-[#1a1a1a] antialiased",
  container: "mx-auto max-w-md px-8 py-14",

  cover: {
    overlayClass: "bg-white text-[#1a1a1a]",
    titleFont: "font-sans",
    kicker: "The Wedding Of",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass: "bg-[#1a1a1a] text-white",
  },

  couple: {
    layout: "between",
    wrapper: "mt-10",
    heading: (
      <p className="text-[11px] tracking-[0.3em] text-[#6a6a6a] uppercase">
        Mempelai
      </p>
    ),
    list: "mt-3 divide-y divide-[#e2e2e2] border-y border-[#e2e2e2]",
    item: "flex items-baseline justify-between gap-4 py-4",
    between: {
      nameWrap: "",
      parents: "max-w-36 text-right text-xs text-[#6a6a6a]",
    },
    name: "text-xl font-medium",
    full: "mt-0.5 text-sm text-[#6a6a6a]",
    parents: "max-w-36 text-right text-xs text-[#6a6a6a]",
  },

  story: {
    heading: "Cerita Kami",
    sectionClass: "mt-10",
    headingClass: "text-[11px] tracking-[0.3em] text-[#6a6a6a] uppercase",
    itemClass:
      "mt-3 border-t border-[#e2e2e2] pt-4 first:mt-0 first:border-t-0 first:pt-0",
    marker: (
      <span
        aria-hidden
        className="text-[10px] tracking-[0.3em] text-[#6a6a6a]"
      >
        —
      </span>
    ),
    titleClass: "mt-1 text-lg font-medium",
    textClass: "mt-1 text-sm leading-7 text-[#4a4a4a]",
  },

  countdown: {
    wrapper: "mt-10",
    heading: (
      <p className="text-[11px] tracking-[0.3em] text-[#6a6a6a] uppercase">
        Countdown
      </p>
    ),
    grid: "mt-3 grid grid-cols-4 gap-px border border-[#e2e2e2] bg-[#e2e2e2]",
    box: "bg-white px-2 py-4 text-center",
    value: "text-2xl font-medium tabular-nums",
    label: "mt-0.5 text-[10px] tracking-widest text-[#6a6a6a] uppercase",
    fallback:
      "col-span-4 bg-white px-4 py-5 text-center text-sm text-[#6a6a6a]",
    passedText: "Acara telah berlangsung. Terima kasih!",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "mono",
    item: "mt-8 border border-[#e2e2e2]",
    header:
      "flex items-baseline justify-between gap-4 border-b border-[#e2e2e2] px-5 py-3",
    name: "text-[11px] tracking-[0.3em] text-[#6a6a6a] uppercase",
    time: "text-xs tabular-nums",
    body: "px-5 py-5",
    date: "text-xl font-medium",
    venue: "mt-2 flex items-start gap-1.5 text-sm text-[#4a4a4a]",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0 text-[#6a6a6a]",
    maps:
      "mt-4 inline-flex h-10 items-center border border-[#1a1a1a] px-5 text-sm font-medium transition-colors hover:bg-[#1a1a1a] hover:text-white",
    mapsLabel: "Lihat Lokasi →",
  },

  gallery: {
    wrapper: "mt-10",
    heading: (
      <p className="flex items-center gap-2 text-[11px] tracking-[0.3em] text-[#6a6a6a] uppercase">
        <Images className="h-3.5 w-3.5" /> Galeri
      </p>
    ),
    grid: "mt-3 grid grid-cols-3 gap-1",
    image: "aspect-square w-full object-cover",
  },

  accounts: {
    layout: "row",
    wrapper: "mt-10",
    heading: (
      <p className="flex items-center gap-2 text-[11px] tracking-[0.3em] text-[#6a6a6a] uppercase">
        <Gift className="h-3.5 w-3.5" /> Amplop Digital
      </p>
    ),
    list: "mt-3 divide-y divide-[#e2e2e2] border-y border-[#e2e2e2]",
    item: "flex items-center justify-between gap-4 py-4",
    bank: "text-[11px] tracking-[0.25em] text-[#6a6a6a] uppercase",
    number: "mt-0.5 text-lg font-medium tabular-nums",
    holder: "text-xs text-[#6a6a6a]",
    copy: "border border-[#1a1a1a] text-[#1a1a1a]",
  },

  extraLinks: {
    wrapper: "mt-10",
    heading: (
      <p className="text-[11px] tracking-[0.3em] text-[#6a6a6a] uppercase">
        Tautan Acara
      </p>
    ),
    grid: "mt-3 grid gap-2",
    link:
      "inline-flex h-10 items-center justify-center gap-2 border border-[#1a1a1a] px-5 text-sm font-medium text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-white",
  },

  rsvp: {
    wrapper: "mt-10 border-t border-[#e2e2e2] pt-6",
    inner: "[&_input]:rounded-none [&_textarea]:rounded-none",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "Terima kasih",
    render: ({ note, names }) => (
      <p className="mt-10 border-t border-[#e2e2e2] pt-6 text-center text-sm text-[#6a6a6a]">
        {note !== undefined ? note || names : `Terima kasih — ${names}`}
      </p>
    ),
  },
};

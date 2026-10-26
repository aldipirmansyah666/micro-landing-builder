import { Gift, Images } from "lucide-react";
import type { InvitationLayoutConfig } from "../types";

export const KALA_LAYOUT: InvitationLayoutConfig = {
  root:
    "relative min-h-full overflow-hidden bg-[#faf3e8] font-sans text-[#4a3226] antialiased",
  container: "relative px-5 py-10",

  cover: {
    overlayClass: "bg-[#4a3226]/95 text-[#faf3e8]",
    titleFont: "font-sans",
    kicker: "🎉 Undangan Pernikahan 🎉",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass: "bg-[#c96f4a] text-white shadow-xl",
  },

  couple: {
    layout: "stack",
    list: "mx-auto mt-8 grid max-w-xs gap-3",
    item: (_, index) =>
      `rounded-[1.75rem] px-6 py-5 text-center shadow-md ${
        index === 0
          ? "rotate-1 bg-[#c96f4a] text-white shadow-[#c96f4a]/30"
          : "-rotate-1 bg-white shadow-[#c96f4a]/10"
      }`,
    name: "text-2xl font-extrabold",
    full: (_, index) =>
      `mt-0.5 text-sm ${index === 0 ? "text-white/80" : "text-[#4a3226]/70"}`,
    parents: (_, index) =>
      `mt-1.5 text-xs ${index === 0 ? "text-white/75" : "text-[#4a3226]/60"}`,
  },

  story: {
    heading: "Cerita Seru Kami",
    sectionClass: "mx-auto mt-8 max-w-xs text-center",
    headingClass: "text-sm font-black tracking-tight text-[#3d2a1e]",
    itemClass: "rounded-[1.75rem] bg-[#f7e8d5] px-5 py-4 shadow-sm",
    marker: <span aria-hidden className="text-[#c96f4a]">●</span>,
    titleClass: "mt-1 text-lg font-black text-[#3d2a1e]",
    textClass: "mt-1 text-xs leading-6 text-[#3d2a1e]/75",
  },

  countdown: {
    wrapper:
      "mx-auto mt-8 max-w-xs rounded-[1.75rem] bg-[#3f6b63] px-5 py-6 text-center text-white shadow-lg shadow-[#3f6b63]/30",
    heading: (
      <p className="text-xs font-bold tracking-[0.3em] uppercase opacity-80">
        Hitung Mundur
      </p>
    ),
    grid: "mt-4 grid grid-cols-4 gap-2",
    box: "rounded-2xl bg-white/15 px-2 py-3 backdrop-blur",
    value: "text-2xl font-extrabold",
    label: "text-[10px] font-bold tracking-wider uppercase opacity-75",
    fallback: "col-span-4 rounded-2xl bg-white/15 px-2 py-3 text-sm",
    passedText: "Acara telah berlangsung. Terima kasih! 🎉",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "card",
    item:
      "mx-auto mt-4 max-w-xs rounded-[1.75rem] border-2 border-dashed border-[#c96f4a]/50 bg-white px-6 py-6 text-center shadow-md shadow-[#c96f4a]/10",
    name: "text-sm font-extrabold tracking-wide text-[#c96f4a] uppercase",
    date: "mt-2 font-bold text-[#3d2a1e]",
    time: "text-sm opacity-70",
    timePrefix: "Pukul ",
    venue: "mt-2 flex items-start justify-center gap-1.5 text-sm",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0 text-[#c96f4a]",
    maps:
      "mt-4 inline-flex h-11 items-center rounded-full bg-[#3d2a1e] px-6 text-sm font-bold text-white transition-transform hover:scale-105",
    mapsLabel: "Buka Maps →",
  },

  gallery: {
    wrapper: "mx-auto mt-8 max-w-xs",
    heading: (
      <p className="flex items-center justify-center gap-2 text-xs font-extrabold tracking-[0.25em] text-[#c96f4a] uppercase">
        <Images className="h-4 w-4" /> Galeri Seru
      </p>
    ),
    grid: "mt-4 grid grid-cols-2 gap-2",
    image: (_, index) =>
      `aspect-square w-full border-4 border-white object-cover shadow-md transition-transform duration-500 hover:scale-[1.04] hover:-rotate-1 rounded-[1.5rem] ${
        index % 2 === 0 ? "rotate-1" : "-rotate-1"
      }`,
  },

  accounts: {
    layout: "stack",
    wrapper: "mx-auto mt-8 max-w-xs",
    heading: (
      <p className="flex items-center justify-center gap-2 text-xs font-extrabold tracking-[0.25em] text-[#c96f4a] uppercase">
        <Gift className="h-4 w-4" /> Amplop Digital
      </p>
    ),
    list: "mt-4 space-y-3",
    item: "rounded-[1.75rem] bg-white px-5 py-5 text-center shadow-md",
    bank: "text-xs font-extrabold tracking-[0.2em] text-[#3f6b63] uppercase",
    number: "mt-1 text-xl font-extrabold tabular-nums",
    holder: "mt-0.5 text-xs opacity-60",
    copyWrapper: "mt-3",
    copy: "bg-[#c96f4a] text-white",
  },

  extraLinks: {
    wrapper: "mx-auto mt-8 max-w-xs text-center",
    heading: (
      <p className="flex items-center justify-center gap-2 text-xs font-extrabold tracking-[0.25em] text-[#c96f4a] uppercase">
        Tautan Acara
      </p>
    ),
    grid: "mt-4 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-[#c96f4a]/50 px-6 text-sm font-bold text-[#4a3226] transition-colors hover:bg-[#c96f4a] hover:text-white",
  },

  rsvp: {
    wrapper: "mx-auto mt-8 max-w-xs",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "Sampai jumpa! 🎉",
    render: ({ note, names }) => (
      <p className="mt-10 text-center text-xs font-bold text-[#c96f4a]">
        {note !== undefined ? note || names : `${names} · Sampai jumpa! 🎉`}
      </p>
    ),
  },
};

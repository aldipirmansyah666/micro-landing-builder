import { Gift, Images, Sparkles } from "lucide-react";
import type { InvitationLayoutConfig } from "../types";

export const SERUNI_LAYOUT: InvitationLayoutConfig = {
  root:
    "relative min-h-full overflow-hidden bg-[#fdf6f7] font-serif text-[#6b4a52] antialiased",
  container: "relative px-6 py-12",

  cover: {
    overlayClass: "bg-[#5c3f47]/95 text-[#fdf6f7]",
    titleFont: "font-serif",
    kicker: "🌸 Undangan Pernikahan 🌸",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass: "bg-[#e8b4bc] text-[#5c3f47]",
  },

  couple: {
    layout: "stack",
    list: "mx-auto mt-10 max-w-xs space-y-4",
    item:
      "rounded-[2rem] border border-white bg-white/70 px-6 py-6 text-center shadow-lg shadow-[#e8b4bc]/30 backdrop-blur",
    name: "text-2xl font-semibold text-[#5c3f47] italic",
    full: "mt-1 font-sans text-sm text-[#6b4a52]/70",
    parents: "mt-2 font-sans text-xs text-[#a08a90]",
    photoClass:
      "mx-auto mb-4 h-28 w-28 rounded-full border-2 border-white object-cover shadow-md",
  },

  story: {
    heading: "Cerita Cinta Kami",
    sectionClass: "mx-auto mt-10 max-w-xs text-center",
    headingClass: "font-serif text-2xl text-[#c98a94] italic",
    itemClass: "rounded-[2rem] bg-white px-6 py-5 shadow-sm",
    marker: <span aria-hidden className="text-[#c98a94]">❀</span>,
    titleClass: "mt-1 font-serif text-lg text-[#6b4a52] italic",
    textClass: "mt-1 font-sans text-xs leading-6 text-[#6b4a52]/75",
  },

  countdown: {
    wrapper: "mx-auto mt-10 max-w-xs text-center",
    heading: (
      <p className="font-sans text-[11px] tracking-[0.35em] text-[#c98a94] uppercase">
        Counting down to forever
      </p>
    ),
    grid: "mt-4 grid grid-cols-4 gap-2",
    box:
      "rounded-full border border-white bg-white/70 px-2 py-4 shadow-md shadow-[#e8b4bc]/30 backdrop-blur",
    value: "text-2xl text-[#5c3f47]",
    label: "font-sans text-[10px] tracking-wider text-[#a08a90] uppercase",
    fallback:
      "col-span-4 rounded-2xl bg-white/70 px-2 py-3 font-sans text-sm",
    passedText: "Acara telah berlangsung. Terima kasih! 💐",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "card",
    item:
      "mx-auto mt-6 max-w-xs rounded-[2rem] border border-white bg-white/70 px-6 py-7 text-center shadow-lg shadow-[#e8b4bc]/30 backdrop-blur",
    name: "font-sans text-[11px] tracking-[0.35em] text-[#c98a94] uppercase",
    date: "mt-3 text-lg text-[#5c3f47]",
    time: "mt-1 font-sans text-sm opacity-70",
    timePrefix: "Pukul ",
    venue: "mt-2 flex items-start justify-center gap-1.5 font-sans text-sm opacity-80",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0 text-[#c98a94]",
    maps:
      "mt-4 inline-flex h-11 items-center rounded-full bg-[#c98a94] px-6 font-sans text-sm font-medium text-white shadow-md transition-transform hover:scale-105",
    mapsLabel: "Lihat Lokasi",
  },

  gallery: {
    wrapper: "mx-auto mt-10 max-w-xs",
    heading: (
      <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#c98a94] uppercase">
        <Images className="h-3.5 w-3.5" /> Momen Bahagia
      </p>
    ),
    grid: "mt-4 grid grid-cols-2 gap-2",
    image: (_, index) =>
      `aspect-[3/4] w-full border-2 border-white object-cover shadow-md ${
        index % 2 === 0
          ? "rounded-tl-[1.5rem] rounded-tr-[1.5rem] rounded-br-[1.5rem] rounded-bl-[0.5rem]"
          : "rounded-tl-[1.5rem] rounded-tr-[1.5rem] rounded-br-[0.5rem] rounded-bl-[1.5rem]"
      }`,
  },

  accounts: {
    layout: "stack",
    wrapper: "mx-auto mt-10 max-w-xs",
    heading: (
      <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#c98a94] uppercase">
        <Gift className="h-3.5 w-3.5" /> Wedding Gift
      </p>
    ),
    list: "mt-4 space-y-3",
    item:
      "rounded-[2rem] border border-white bg-white/70 px-5 py-5 text-center shadow-md backdrop-blur",
    bank: "font-sans text-xs tracking-[0.25em] text-[#c98a94] uppercase",
    number: "mt-1 font-sans text-lg font-semibold tabular-nums",
    holder: "mt-0.5 font-sans text-xs opacity-60",
    copyWrapper: "mt-3",
    copy: "bg-[#c98a94] text-white",
  },

  extraLinks: {
    wrapper: "mx-auto mt-10 max-w-xs text-center",
    heading: (
      <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#c98a94] uppercase">
        <Sparkles className="h-3.5 w-3.5" /> Tautan Acara
      </p>
    ),
    grid: "mt-4 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#c98a94]/60 px-6 font-sans text-sm font-medium text-[#6b4a52] transition-colors hover:bg-[#c98a94] hover:text-white",
  },

  rsvp: {
    wrapper: "mx-auto mt-10 max-w-xs font-sans",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "with love 🌸",
    render: ({ note, names }) => (
      <p className="mt-10 text-center text-xs text-[#a08a90]">
        {note !== undefined ? note || names : `${names} · with love 🌸`}
      </p>
    ),
  },
};

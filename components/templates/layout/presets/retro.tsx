import { CalendarDays, Gift, Images } from "lucide-react";
import { SectionHeading } from "../../shared";
import type { InvitationLayoutConfig } from "../types";

export const RETRO_LAYOUT: InvitationLayoutConfig = {
  root:
    "relative min-h-full overflow-hidden bg-[#fbe3c8] font-sans text-[#4a2c17] antialiased",
  container: "relative mx-auto max-w-md px-6 pt-12 pb-14",

  cover: {
    overlayClass: "bg-[#c96f4a] text-[#fdf3e3]",
    titleFont: "font-sans",
    kicker: "The Wedding Of",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass: "bg-[#2f3e33] text-[#fdf3e3] shadow-xl",
  },

  couple: {
    layout: "stack",
    list: "mt-12 grid gap-4",
    item: (_, index) =>
      `rounded-[2rem] border-4 px-6 py-7 text-center shadow-[6px_6px_0_rgba(47,62,51,1)] ${
        index === 0
          ? "rotate-1 border-[#c96f4a] bg-white"
          : "-rotate-1 border-[#2f3e33] bg-[#e8a94e]/30"
      }`,
    name: "text-4xl font-black tracking-tight",
    full: "mt-1 text-sm opacity-70",
    parents: "mt-2 text-xs opacity-70",
  },

  story: {
    heading: "Cerita Kita",
    sectionClass: "mt-8 text-center",
    headingClass: "text-lg font-black tracking-tight text-[#4a2c17]",
    itemClass:
      "rounded-[2rem] border-4 border-[#2f3e33] bg-white px-6 py-5 shadow-[4px_4px_0_#2f3e33]",
    marker: <span aria-hidden className="text-[#c96f4a]">☀</span>,
    titleClass: "mt-1 text-xl font-black text-[#4a2c17]",
    textClass: "mt-1 text-xs leading-6 text-[#4a2c17]/75",
  },

  countdown: {
    wrapper:
      "mt-8 rounded-[2rem] bg-[#2f3e33] px-6 py-8 text-center text-[#fbe3c8] shadow-[6px_6px_0_#c96f4a]",
    heading: (
      <SectionHeading
        kicker="Menghitung Hari"
        icon={<CalendarDays className="h-3.5 w-3.5" />}
        className="text-[#e8a94e]"
      />
    ),
    grid: "mt-5 grid grid-cols-4 gap-2",
    box: "rounded-2xl bg-[#fbe3c8] px-2 py-4 text-[#4a2c17]",
    value: "text-2xl font-black",
    label: "mt-0.5 text-[10px] font-bold tracking-widest uppercase opacity-60",
    fallback: "col-span-4 text-sm opacity-70",
    passedText: "Acara telah berlangsung. Terima kasih!",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "card",
    item:
      "mt-4 rounded-[2rem] border-4 border-[#2f3e33] bg-white px-6 py-7 text-center shadow-[6px_6px_0_#2f3e33]",
    name: "inline-block rounded-full bg-[#e8a94e]/50 px-4 py-1 text-[11px] font-bold tracking-[0.3em] uppercase",
    date: "mt-3 text-2xl font-black",
    time: "mt-1 text-sm font-bold",
    timePrefix: "Pukul ",
    venue: "mt-3 flex items-start justify-center gap-1.5 text-sm opacity-80",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0 text-[#c96f4a]",
    maps:
      "mt-5 inline-flex h-11 items-center rounded-full bg-[#c96f4a] px-6 text-sm font-bold text-white transition-transform hover:scale-105",
    mapsLabel: "Lihat Lokasi",
  },

  gallery: {
    wrapper: "mt-10",
    heading: (
      <SectionHeading
        kicker="Galeri"
        icon={<Images className="h-3.5 w-3.5" />}
        className="text-[#b4552d]"
      />
    ),
    grid: "mt-5 grid grid-cols-2 gap-3",
    image: (_, index) =>
      `w-full border-4 border-[#2f3e33] object-cover shadow-[4px_4px_0_#2f3e33] ${
        index % 2 === 0
          ? "aspect-square rotate-1 rounded-[2rem]"
          : "aspect-[3/4] -rotate-1 rounded-full"
      }`,
  },

  accounts: {
    layout: "stack",
    wrapper: "mt-10",
    heading: (
      <SectionHeading
        kicker="Tanda Kasih"
        icon={<Gift className="h-3.5 w-3.5" />}
        className="text-[#b4552d]"
      />
    ),
    list: "mt-5 space-y-3",
    item:
      "rounded-[2rem] border-4 border-[#2f3e33] bg-white px-5 py-5 text-center shadow-[4px_4px_0_#2f3e33]",
    bank: "text-xs font-bold tracking-[0.25em] text-[#b4552d] uppercase",
    number: "mt-1 text-lg font-black tracking-wide tabular-nums",
    holder: "mt-0.5 text-xs opacity-60",
    copyWrapper: "mt-3",
    copy: "bg-[#2f3e33] text-white",
  },

  extraLinks: {
    wrapper: "mt-10 text-center",
    heading: (
      <SectionHeading kicker="Tautan Acara" className="text-[#b4552d]" />
    ),
    grid: "mt-5 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 rounded-full border-4 border-[#2f3e33] bg-white px-6 text-sm font-bold text-[#4a2c17] transition-colors hover:bg-[#2f3e33] hover:text-white",
  },

  rsvp: {
    wrapper:
      "mt-8 rounded-[2rem] border-4 border-[#2f3e33] bg-white p-4 shadow-[6px_6px_0_#2f3e33]",
    inner:
      "[&_input]:rounded-2xl [&_input]:bg-[#fbe3c8] [&_textarea]:rounded-2xl [&_textarea]:bg-[#fbe3c8]",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "Terima kasih atas doa & kehadiran Anda ☀",
    render: ({ note, names }) => (
      <>
        {note !== undefined ? (
          note ? (
            <p className="mt-12 text-center text-sm font-bold">{note}</p>
          ) : null
        ) : (
          <p className="mt-12 text-center text-sm font-bold">
            Terima kasih atas doa & kehadiran Anda ☀
          </p>
        )}
        <p className="mt-2 text-center text-xs font-bold tracking-[0.3em] text-[#b4552d] uppercase">
          {names}
        </p>
      </>
    ),
  },
};

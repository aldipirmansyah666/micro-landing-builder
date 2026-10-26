import { CalendarDays, Gift, Images } from "lucide-react";
import { SectionHeading } from "../../shared";
import type { InvitationLayoutConfig } from "../types";

export const BLOSSOM_LAYOUT: InvitationLayoutConfig = {
  root:
    "relative min-h-full overflow-hidden bg-[#f6f3ec] font-serif text-[#4c5a4e] antialiased",
  container: "relative mx-auto max-w-md px-8 py-14",

  cover: {
    overlayClass: "bg-[#eef0e6] text-[#4c5a4e]",
    titleFont: "font-serif",
    kicker: "The Wedding Of",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass: "bg-[#7d8b7a] text-white shadow-lg",
  },

  couple: {
    layout: "stack",
    list: "mt-12 space-y-4",
    item:
      "rounded-[2.5rem] bg-gradient-to-br from-white to-[#f0e8e4] px-6 py-8 text-center shadow-sm",
    name: "font-serif text-4xl text-[#c98a94] italic",
    full: "mt-1 font-sans text-sm text-[#6a7a6c]",
    parents: "mt-2 font-sans text-xs text-[#9aa793]",
  },

  story: {
    heading: "Cerita Cinta Kami",
    sectionClass: "mt-8 text-center",
    headingClass: "font-serif text-2xl text-[#c98a94] italic",
    itemClass: "mx-auto max-w-sm rounded-[2.5rem] bg-white px-6 py-6 shadow-sm",
    marker: <span aria-hidden className="text-[#c98a94]">❀</span>,
    titleClass: "mt-1 font-serif text-xl text-[#3f4a41] italic",
    textClass: "mt-2 font-sans text-sm leading-7 text-[#6a7a6c]",
  },

  countdown: {
    wrapper:
      "mt-8 rounded-[2.5rem] bg-[#7d8b7a] px-6 py-8 text-center text-white",
    heading: (
      <SectionHeading
        kicker="Menghitung Hari"
        icon={<CalendarDays className="h-3.5 w-3.5" />}
        className="text-white/90"
      />
    ),
    grid: "mt-5 grid grid-cols-4 gap-2",
    box: "rounded-full bg-white/20 px-2 py-4 backdrop-blur",
    value: "text-2xl text-white",
    label:
      "mt-0.5 font-sans text-[10px] tracking-widest uppercase opacity-80",
    fallback: "col-span-4 font-sans text-sm opacity-80",
    passedText: "Acara telah berlangsung. Terima kasih!",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "card",
    item:
      "mt-4 rounded-[2.5rem] bg-white px-6 py-8 text-center shadow-sm",
    name: "font-sans text-[11px] tracking-[0.35em] text-[#c98a94] uppercase",
    date: "mt-3 font-serif text-2xl text-[#3f4a41] italic",
    time: "mt-1 font-sans text-sm text-[#6a7a6c]",
    timePrefix: "Pukul ",
    venue:
      "mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-[#6a7a6c]",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0 text-[#c98a94]",
    maps:
      "mt-5 inline-flex h-11 items-center rounded-full bg-[#c98a94] px-6 font-sans text-sm font-medium text-white transition-transform hover:scale-105",
    mapsLabel: "Lihat Lokasi",
  },

  gallery: {
    wrapper: "mt-8",
    heading: (
      <SectionHeading
        kicker="Galeri"
        icon={<Images className="h-3.5 w-3.5" />}
        className="text-[#9aa793]"
      />
    ),
    grid: "mt-5 grid grid-cols-2 gap-3",
    image:
      "aspect-square w-full rounded-[2rem] border-4 border-white object-cover shadow",
  },

  accounts: {
    layout: "stack",
    wrapper: "mt-8",
    heading: (
      <SectionHeading
        kicker="Tanda Kasih"
        icon={<Gift className="h-3.5 w-3.5" />}
        className="text-[#9aa793]"
      />
    ),
    list: "mt-5 space-y-3",
    item:
      "rounded-[2.5rem] bg-white px-5 py-6 text-center shadow-sm",
    bank: "font-sans text-xs tracking-[0.25em] text-[#c98a94] uppercase",
    number:
      "mt-1 font-sans text-lg font-semibold tracking-wide tabular-nums",
    holder: "mt-0.5 font-sans text-xs text-[#9aa793]",
    copyWrapper: "mt-3",
    copy: "bg-[#7d8b7a] text-white",
  },

  extraLinks: {
    wrapper: "mt-8 text-center",
    heading: (
      <SectionHeading kicker="Tautan Acara" className="text-[#9aa793]" />
    ),
    grid: "mt-5 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#9aa793]/50 px-6 font-sans text-sm font-medium text-[#4c5a4e] transition-colors hover:bg-[#7d8b7a] hover:text-white",
  },

  rsvp: {
    wrapper: "mt-8 rounded-[2.5rem] bg-white p-4 shadow-sm",
    inner:
      "font-sans [&_input]:rounded-full [&_input]:bg-[#f6f3ec] [&_textarea]:rounded-3xl [&_textarea]:bg-[#f6f3ec]",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "Terima kasih atas doa & kehadiran Anda",
    render: ({ note, names }) => (
      <>
        {note !== undefined ? (
          note ? (
            <p className="mt-12 text-center font-serif text-lg text-[#6a7a6c] italic">
              {note}
            </p>
          ) : null
        ) : (
          <p className="mt-12 text-center font-serif text-lg text-[#6a7a6c] italic">
            Terima kasih atas doa & kehadiran Anda
          </p>
        )}
        <p className="mt-2 text-center text-xs tracking-[0.3em] text-[#c98a94] uppercase">
          {names}
        </p>
      </>
    ),
  },
};

import { CalendarDays, Gift, Images } from "lucide-react";
import { SectionHeading } from "../../shared";
import type { InvitationLayoutConfig } from "../types";

export const HERITAGE_LAYOUT: InvitationLayoutConfig = {
  root: "relative min-h-full bg-[#f7f1e3] font-serif text-[#1b2a4a] antialiased",
  container: "mx-auto max-w-md px-8 py-10",

  cover: {
    overlayClass: "bg-[#1b2a4a] text-[#f7f1e3]",
    titleFont: "font-serif",
    kicker: "The Wedding Of",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass: "bg-[#c9a227] text-[#1b2a4a] shadow-lg",
  },

  couple: {
    layout: "stack",
    heading: (
      <p className="mt-10 text-center text-[11px] tracking-[0.4em] text-[#8a7a2e] uppercase">
        Mempelai
      </p>
    ),
    list: "mt-6 space-y-6",
    item:
      "border border-[#1b2a4a]/30 bg-white/60 px-6 py-7 text-center",
    name: "text-3xl font-medium",
    full: "mt-1 font-sans text-sm text-[#3d4a6a]",
    parents: "mt-2 font-sans text-xs text-[#6a7694]",
  },

  story: {
    heading: "Kisah Kami",
    sectionClass: "mt-10 border-2 border-[#1b2a4a] p-1.5 text-center",
    headingClass: "mt-2 text-[11px] tracking-[0.4em] text-[#8a7a2e] uppercase",
    itemClass: "mx-auto max-w-xs border border-[#c9a227] px-5 py-4",
    marker: <span aria-hidden className="text-[#c9a227]">◆</span>,
    titleClass: "mt-1 font-serif text-xl text-[#1b2a4a]",
    textClass: "mt-1 font-sans text-xs leading-6 text-[#3d4a6a]",
  },

  countdown: {
    wrapper:
      "mt-10 bg-[#1b2a4a] px-6 py-8 text-center text-[#f7f1e3]",
    heading: (
      <SectionHeading
        kicker="Menghitung Hari"
        icon={<CalendarDays className="h-3.5 w-3.5" />}
        className="text-[#e6c65a]"
      />
    ),
    grid: "mt-5 grid grid-cols-4 gap-2",
    box: "border border-[#c9a227]/60 px-2 py-4",
    value: "text-2xl text-[#f7f1e3]",
    label:
      "mt-0.5 font-sans text-[10px] tracking-widest text-[#e6c65a] uppercase",
    fallback: "col-span-4 font-sans text-sm opacity-70",
    passedText: "Acara telah berlangsung. Terima kasih!",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "card",
    item: "mt-8 border-2 border-[#1b2a4a] p-1.5",
    inner: "border border-[#c9a227] px-6 py-7 text-center",
    name: "font-sans text-[11px] tracking-[0.35em] text-[#8a7a2e] uppercase",
    date: "mt-3 text-xl",
    time: "mt-1 font-sans text-sm text-[#3d4a6a]",
    timePrefix: "Pukul ",
    venue:
      "mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-[#3d4a6a]",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0 text-[#8a7a2e]",
    maps:
      "mt-5 inline-flex h-11 items-center rounded-full bg-[#1b2a4a] px-6 font-sans text-sm font-medium text-[#f7f1e3] transition-colors hover:bg-[#2a3d66]",
    mapsLabel: "Lihat Lokasi",
  },

  gallery: {
    wrapper: "mt-10",
    heading: (
      <SectionHeading
        kicker="Galeri"
        icon={<Images className="h-3.5 w-3.5" />}
        className="text-[#8a7a2e]"
      />
    ),
    grid: "mt-5 grid grid-cols-2 gap-2",
    image:
      "aspect-square w-full border border-[#1b2a4a]/20 object-cover",
  },

  accounts: {
    layout: "stack",
    wrapper: "mt-10",
    heading: (
      <SectionHeading
        kicker="Tanda Kasih"
        icon={<Gift className="h-3.5 w-3.5" />}
        className="text-[#8a7a2e]"
      />
    ),
    list: "mt-5 space-y-3",
    item:
      "border border-[#1b2a4a]/30 bg-white/60 px-5 py-5 text-center",
    bank: "font-sans text-xs tracking-[0.25em] text-[#8a7a2e] uppercase",
    number:
      "mt-1 font-sans text-lg font-semibold tracking-wide tabular-nums",
    holder: "mt-0.5 font-sans text-xs text-[#6a7694]",
    copyWrapper: "mt-3",
    copy: "bg-[#1b2a4a] text-white",
  },

  extraLinks: {
    wrapper: "mt-10",
    heading: (
      <SectionHeading kicker="Tautan Acara" className="text-[#8a7a2e]" />
    ),
    grid: "mt-5 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 border border-[#1b2a4a]/30 bg-white/60 px-6 font-sans text-sm font-medium text-[#1b2a4a] transition-colors hover:bg-[#1b2a4a] hover:text-[#f7f1e3]",
  },

  rsvp: {
    wrapper: "mt-10 border border-[#1b2a4a]/20 bg-white/60 p-4",
    inner: "font-sans [&_input]:bg-white [&_textarea]:bg-white",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "Terima kasih atas doa & kehadiran Anda",
    render: ({ note, names }) => (
      <>
        {note !== undefined ? (
          note ? (
            <p className="mt-10 text-center text-sm text-[#3d4a6a]">{note}</p>
          ) : null
        ) : (
          <p className="mt-10 text-center text-sm text-[#3d4a6a]">
            Terima kasih atas doa & kehadiran Anda
          </p>
        )}
        <p className="mt-2 text-center text-xs tracking-[0.3em] text-[#8a7a2e] uppercase">
          {names}
        </p>
      </>
    ),
  },
};

import { CalendarDays, Gift, Images } from "lucide-react";
import { EightPointStar } from "../../parts";
import { SectionHeading } from "../../shared";
import type { InvitationLayoutConfig } from "../types";

export const ARABESQUE_LAYOUT: InvitationLayoutConfig = {
  root: "relative min-h-full bg-[#0b3b36] font-serif text-[#f2ead2] antialiased",
  container: "mx-auto max-w-md px-8 py-12",

  cover: {
    overlayClass: "bg-[#0b3b36] text-[#f2ead2]",
    titleFont: "font-serif",
    kicker: "Assalamu'alaikum Wr. Wb.",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass:
      "bg-[#c9a227] text-[#0b3b36] shadow-[0_0_30px_rgba(201,162,39,0.4)]",
  },

  couple: {
    layout: "stack",
    list: "mt-12 space-y-8 text-center",
    item:
      "rounded-t-full border border-[#c9a227]/50 px-6 pt-10 pb-7",
    name: "mt-2 text-4xl font-medium text-[#f7f0da]",
    full: "mt-1 font-sans text-sm text-[#c9bfa5]",
    parents: "mt-2 font-sans text-xs text-[#9a917a]",
  },

  story: {
    heading: "Kisah Kami",
    sectionClass:
      "mt-10 border border-[#c9a227]/50 bg-[#082b28] px-6 py-8 text-center",
    headingClass: "text-[11px] tracking-[0.4em] text-[#c9a227] uppercase",
    itemClass:
      "mx-auto max-w-xs rounded-t-full border border-[#c9a227]/50 px-5 pt-8 pb-6",
    marker: <span aria-hidden className="text-[#c9a227]">✦</span>,
    titleClass: "mt-2 font-serif text-xl text-[#f7f0da]",
    textClass: "mt-1 font-sans text-xs leading-6 text-[#c9bfa5]",
  },

  countdown: {
    wrapper:
      "mt-10 border border-[#c9a227]/50 bg-[#082b28] px-6 py-8 text-center",
    heading: (
      <SectionHeading
        kicker="Menghitung Hari"
        icon={<CalendarDays className="h-3.5 w-3.5" />}
        className="text-[#c9a227]"
      />
    ),
    grid: "mt-5 grid grid-cols-4 gap-2",
    box: "border border-[#c9a227]/50 bg-[#0b3b36] px-2 py-4",
    value: "text-2xl text-[#f7f0da]",
    label:
      "mt-0.5 font-sans text-[10px] tracking-widest text-[#9a917a] uppercase",
    fallback: "col-span-4 font-sans text-sm text-[#9a917a]",
    passedText: "Acara telah berlangsung. Terima kasih!",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "card",
    item:
      "mt-8 rounded-t-[10rem] border-2 border-[#c9a227] bg-[#f2ead2] px-6 pt-12 pb-8 text-center text-[#0b3b36]",
    icon: <EightPointStar className="mx-auto h-7 w-7 text-[#8a7a2e]" />,
    name: "mt-2 font-sans text-[11px] tracking-[0.35em] text-[#8a7a2e] uppercase",
    date: "mt-3 text-xl",
    time: "mt-1 font-sans text-sm text-[#4a5a4e]",
    timePrefix: "Pukul ",
    venue:
      "mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-[#4a5a4e]",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0 text-[#8a7a2e]",
    maps:
      "mt-5 inline-flex h-11 items-center rounded-full bg-[#0b3b36] px-6 font-sans text-sm font-medium text-[#f2ead2] transition-transform hover:scale-105",
    mapsLabel: "Lihat Lokasi",
  },

  gallery: {
    wrapper: "mt-12",
    heading: (
      <SectionHeading
        kicker="Galeri"
        icon={<Images className="h-3.5 w-3.5" />}
        className="text-[#c9a227]"
      />
    ),
    grid: "mt-5 grid grid-cols-2 gap-2",
    image:
      "aspect-[3/4] w-full rounded-t-full border border-[#c9a227]/50 object-cover",
  },

  accounts: {
    layout: "stack",
    wrapper: "mt-12",
    heading: (
      <SectionHeading
        kicker="Tanda Kasih"
        icon={<Gift className="h-3.5 w-3.5" />}
        className="text-[#c9a227]"
      />
    ),
    list: "mt-5 space-y-3",
    item:
      "border border-[#c9a227]/50 bg-white/[0.05] px-5 py-5 text-center",
    bank: "font-sans text-xs tracking-[0.25em] text-[#c9a227] uppercase",
    number:
      "mt-1 font-sans text-lg font-semibold tracking-wide text-white tabular-nums",
    holder: "mt-0.5 font-sans text-xs text-[#9a917a]",
    copyWrapper: "mt-3",
    copy: "bg-[#c9a227] text-[#0b3b36]",
  },

  extraLinks: {
    wrapper: "mt-12 text-center",
    heading: (
      <SectionHeading kicker="Tautan Acara" className="text-[#c9a227]" />
    ),
    grid: "mt-5 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 border border-[#c9a227]/50 bg-white/[0.05] px-6 font-sans text-sm font-medium text-[#f2ead2] transition-colors hover:bg-[#c9a227] hover:text-[#0b3b36]",
  },

  rsvp: {
    wrapper: "mt-12 border border-[#c9a227]/50 bg-[#082b28] p-4",
    inner:
      "font-sans text-[#f2ead2] [&_input]:bg-[#0b3b36] [&_input]:text-white [&_textarea]:bg-[#0b3b36] [&_textarea]:text-white",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "Terima kasih atas doa & kehadiran Anda",
    render: ({ note, names }) => (
      <>
        <div className="mt-12 flex items-center justify-center gap-4 text-[#c9a227]">
          <EightPointStar className="h-6 w-6" />
          {note !== undefined ? (
            note ? (
              <p className="text-center text-sm text-[#9a917a]">{note}</p>
            ) : null
          ) : (
            <p className="text-center text-sm text-[#9a917a]">
              Terima kasih atas doa & kehadiran Anda
            </p>
          )}
          <EightPointStar className="h-6 w-6" />
        </div>
        <p className="mt-3 text-center text-xs tracking-[0.3em] text-[#c9a227] uppercase">
          {names}
        </p>
      </>
    ),
  },
};

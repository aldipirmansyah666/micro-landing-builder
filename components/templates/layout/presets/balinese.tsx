import { CalendarDays, Gift, Images } from "lucide-react";
import { OrnateDivider, SectionHeading } from "../../shared";
import type { InvitationLayoutConfig } from "../types";

export const BALINESE_LAYOUT: InvitationLayoutConfig = {
  root: "relative min-h-full bg-[#2b0f0f] font-serif text-[#f0dfb8] antialiased",
  container: "mx-auto max-w-md px-8 py-10",

  cover: {
    overlayClass: "bg-[#2b0f0f] text-[#f0dfb8]",
    titleFont: "font-serif",
    kicker: "Om Swastiastu",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass:
      "bg-[#c9973f] text-[#2b0f0f] shadow-[0_0_30px_rgba(201,151,63,0.4)]",
  },

  couple: {
    layout: "stack",
    list: "mt-12 space-y-6 text-center",
    item: "border-y border-[#c9973f]/50 py-7",
    labelAbove: true,
    labelClass: "text-xs tracking-[0.35em] text-[#c9973f] uppercase",
    name: "mt-2 text-4xl font-medium text-[#f7ecc8]",
    full: "mt-1 font-sans text-sm text-[#d9c493]",
    parents: "mt-2 font-sans text-xs text-[#a8937a]",
    parentsIncludeLabel: false,
  },

  story: {
    heading: "Kisah Kami",
    sectionClass:
      "mt-10 border border-[#c9973f]/60 bg-[#3d1616] px-6 py-8 text-center",
    headingClass: "text-[11px] tracking-[0.45em] text-[#c9973f] uppercase",
    itemClass: "mx-auto max-w-xs",
    marker: <span aria-hidden className="text-[#c9973f]">❖</span>,
    titleClass: "mt-2 font-serif text-2xl text-[#f7ecc8]",
    textClass: "mt-2 font-sans text-xs leading-6 text-[#d9c493]",
  },

  countdown: {
    wrapper:
      "mt-10 border border-[#c9973f]/60 bg-[#3d1616] px-6 py-8 text-center",
    heading: (
      <SectionHeading
        kicker="Menghitung Hari"
        icon={<CalendarDays className="h-3.5 w-3.5" />}
        className="text-[#c9973f]"
      />
    ),
    grid: "mt-5 grid grid-cols-4 gap-2",
    box: "border border-[#c9973f]/50 bg-[#2b0f0f] px-2 py-4",
    value: "text-2xl text-[#f7ecc8]",
    label:
      "mt-0.5 font-sans text-[10px] tracking-widest text-[#a8937a] uppercase",
    fallback: "col-span-4 font-sans text-sm text-[#a8937a]",
    passedText: "Acara telah berlangsung. Terima kasih!",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "card",
    item: "mt-8 border-2 border-[#c9973f] bg-[#3d1616] p-1.5",
    inner: "px-6 py-7 text-center",
    name: "font-sans text-[11px] tracking-[0.35em] text-[#c9973f] uppercase",
    date: "mt-3 text-xl text-[#f7ecc8]",
    time: "mt-1 font-sans text-sm text-[#d9c493]",
    timePrefix: "Pukul ",
    venue:
      "mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-[#d9c493]",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0 text-[#c9973f]",
    maps:
      "mt-5 inline-flex h-11 items-center rounded-full bg-[#c9973f] px-6 font-sans text-sm font-semibold text-[#2b0f0f] transition-transform hover:scale-105",
    mapsLabel: "Lihat Lokasi",
  },

  gallery: {
    wrapper: "mt-12",
    heading: (
      <SectionHeading
        kicker="Galeri"
        icon={<Images className="h-3.5 w-3.5" />}
        className="text-[#c9973f]"
      />
    ),
    grid: "mt-5 grid grid-cols-2 gap-2",
    image:
      "aspect-[3/4] w-full border border-[#c9973f]/50 object-cover",
  },

  accounts: {
    layout: "stack",
    wrapper: "mt-12",
    heading: (
      <SectionHeading
        kicker="Tanda Kasih"
        icon={<Gift className="h-3.5 w-3.5" />}
        className="text-[#c9973f]"
      />
    ),
    list: "mt-5 space-y-3",
    item:
      "border border-[#c9973f]/50 bg-[#3d1616] px-5 py-5 text-center",
    bank: "font-sans text-xs tracking-[0.25em] text-[#c9973f] uppercase",
    number:
      "mt-1 font-sans text-lg font-semibold tracking-wide text-[#f7ecc8] tabular-nums",
    holder: "mt-0.5 font-sans text-xs text-[#a8937a]",
    copyWrapper: "mt-3",
    copy: "bg-[#c9973f] text-[#2b0f0f]",
  },

  extraLinks: {
    wrapper: "mt-12 text-center",
    heading: (
      <SectionHeading kicker="Tautan Acara" className="text-[#c9973f]" />
    ),
    grid: "mt-5 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 border border-[#c9973f]/50 bg-[#3d1616] px-6 font-sans text-sm font-medium text-[#f0dfb8] transition-colors hover:bg-[#c9973f] hover:text-[#2b0f0f]",
  },

  rsvp: {
    wrapper: "mt-12 border border-[#c9973f]/50 bg-[#3d1616] p-4",
    inner:
      "font-sans text-[#f0dfb8] [&_input]:bg-[#2b0f0f] [&_input]:text-white [&_textarea]:bg-[#2b0f0f] [&_textarea]:text-white",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "Om Shanti Shanti Shanti Om",
    render: ({ note, names }) => (
      <>
        <OrnateDivider
          ornament="❖"
          className="mx-auto mt-12 max-w-48 text-[#c9973f]"
          lineClass="bg-[#c9973f]/60"
        />
        {note !== undefined ? (
          note ? (
            <p className="mt-6 text-center text-sm text-[#a8937a]">{note}</p>
          ) : null
        ) : (
          <p className="mt-6 text-center text-sm text-[#a8937a]">
            Om Shanti Shanti Shanti Om
          </p>
        )}
        <p className="mt-2 text-center text-xs tracking-[0.3em] text-[#c9973f] uppercase">
          {names}
        </p>
      </>
    ),
  },
};

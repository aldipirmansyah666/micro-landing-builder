import { ArrowUpRight, Gift } from "lucide-react";
import type { InvitationLayoutConfig } from "../types";

export const PARISIAN_LAYOUT: InvitationLayoutConfig = {
  root: "relative min-h-full bg-white font-sans text-black antialiased",
  container: "mx-auto max-w-md",
  sectionsWrapper: "px-6 py-10",

  cover: {
    overlayClass: "bg-white text-black",
    titleFont: "font-sans",
    kicker: "N° 01 — The Wedding Issue",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass: "bg-black text-white",
  },

  couple: {
    layout: "stack",
    heading: (
      <p className="text-[11px] font-bold tracking-[0.3em] uppercase">
        01 / Mempelai
      </p>
    ),
    list: "mt-4 grid grid-cols-2 gap-0 border-2 border-black",
    item: (_, index) =>
      index === 0 ? "border-r-2 border-black p-5" : "mt-10 p-5",
    labelAbove: true,
    labelClass:
      "text-[10px] font-bold tracking-[0.25em] uppercase opacity-60",
    name: "mt-2 text-3xl leading-none font-black uppercase",
    full: "mt-2 text-xs opacity-70",
    parents: "mt-2 text-[11px] opacity-60",
    parentsIncludeLabel: false,
  },

  story: {
    heading: "Love Story",
    sectionClass: "mt-10 border-2 border-black p-5",
    headingClass: "text-[11px] font-bold tracking-[0.3em] uppercase",
    itemClass:
      "mt-4 border-t-2 border-black pt-4 first:mt-0 first:border-t-0 first:pt-0",
    marker: <span aria-hidden className="text-xs font-black">—</span>,
    titleClass: "mt-1 text-2xl font-black uppercase",
    textClass: "mt-1 text-xs leading-6 opacity-70",
  },

  countdown: {
    wrapper: "mt-10 border-2 border-black",
    heading: (
      <p className="border-b-2 border-black px-4 py-2 text-[11px] font-bold tracking-[0.3em] uppercase">
        02 / Countdown
      </p>
    ),
    grid: "grid grid-cols-4 divide-x-2 divide-black",
    box: "px-2 py-4 text-center",
    value: "text-3xl font-black tabular-nums",
    label: "mt-0.5 text-[10px] font-bold tracking-widest uppercase opacity-60",
    fallback: "col-span-4 px-4 py-6 text-center text-sm",
    passedText: "Acara telah berlangsung. Terima kasih!",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "numbered",
    item: "mt-6 border-2 border-black",
    header:
      "flex items-center justify-between border-b-2 border-black px-4 py-2 text-[11px] font-bold tracking-[0.3em] uppercase",
    headerIndexFormat: (index) => `0${3 + index}`,
    headerIcon: <ArrowUpRight className="h-4 w-4" />,
    body: "px-5 py-5",
    name: "",
    date: "text-2xl font-black uppercase",
    time: "mt-1 text-sm font-bold",
    timePrefix: "Pukul ",
    venue: "mt-3 flex items-start gap-1.5 text-sm opacity-80",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0",
    maps:
      "mt-4 inline-flex h-11 items-center bg-black px-6 text-sm font-bold text-white uppercase transition-transform hover:scale-105",
    mapsLabel: "Lihat Lokasi",
  },

  gallery: {
    wrapper: "mt-10",
    heading: (
      <p className="text-[11px] font-bold tracking-[0.3em] uppercase">
        Galeri Editorial
      </p>
    ),
    grid: "mt-4 grid grid-cols-12 gap-2",
    image: (_, index) =>
      index % 3 === 0
        ? "col-span-7 aspect-[4/3] w-full border-2 border-black object-cover"
        : "col-span-5 aspect-[3/4] w-full border-2 border-black object-cover",
  },

  accounts: {
    layout: "stack",
    wrapper: "mt-10 border-2 border-black",
    heading: (
      <p className="flex items-center gap-2 border-b-2 border-black px-4 py-2 text-[11px] font-bold tracking-[0.3em] uppercase">
        <Gift className="h-3.5 w-3.5" /> Amplop Digital
      </p>
    ),
    list: "divide-y-2 divide-black",
    item: "px-5 py-4",
    bank: "text-[10px] font-bold tracking-[0.3em] uppercase opacity-60",
    number: "mt-1 text-xl font-black tabular-nums",
    holder: "text-xs opacity-60",
    copyWrapper: "mt-3",
    copy: "bg-black text-white",
  },

  extraLinks: {
    wrapper: "mt-10 border-2 border-black p-4",
    heading: (
      <p className="text-[11px] font-bold tracking-[0.3em] uppercase">
        Tautan Acara
      </p>
    ),
    grid: "mt-3 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 border border-black px-6 text-sm font-bold text-black uppercase transition-colors hover:bg-black hover:text-white",
  },

  rsvp: {
    wrapper: "mt-10 border-2 border-black p-4",
    inner:
      "[&_input]:rounded-none [&_input]:border-black [&_textarea]:rounded-none [&_textarea]:border-black",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "Terima kasih",
    render: ({ note, names }) => (
      <>
        <p className="mt-10 border-t-2 border-black pt-6 text-center text-xs font-bold tracking-[0.25em] uppercase">
          {note !== undefined ? note || names : `${names} — Terima kasih`}
        </p>
        <p className="h-8" />
      </>
    ),
  },
};

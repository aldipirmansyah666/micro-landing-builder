import { Gift, Images } from "lucide-react";
import { BotanicalSprig } from "../../parts";
import type { InvitationLayoutConfig } from "../types";

export const SENJA_LAYOUT: InvitationLayoutConfig = {
  root: "relative min-h-full bg-[#efe7d3] font-serif text-[#3f3a2c] antialiased",
  container: "px-6 py-10",

  cover: {
    overlayClass: "bg-[#2c3324]/95 text-[#efe7d3]",
    titleFont: "font-serif",
    kicker: "Undangan Pernikahan",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass: "bg-[#e8dcc3] text-[#2c3324]",
  },

  couple: {
    layout: "stack",
    list: "mx-auto mt-8 grid max-w-sm gap-4 sm:grid-cols-2",
    item:
      "rounded-2xl border border-[#6b5b3e]/25 bg-[#f7f1e1] px-5 py-6 text-center shadow-md shadow-[#6b4f35]/10",
    name: "text-2xl font-semibold text-[#2c3324]",
    full: "mt-1 font-sans text-sm text-[#3f3a2c]/70",
    parents: "mt-2 font-sans text-xs text-[#3f3a2c]/60",
  },

  story: {
    heading: "Jejak Cerita",
    sectionClass:
      "mx-auto mt-10 max-w-sm rounded-2xl bg-[#e8dcc3]/60 px-5 py-6 text-center",
    headingClass:
      "font-sans text-[11px] tracking-[0.35em] text-[#6b5b3e] uppercase",
    itemClass: "mx-auto max-w-xs",
    marker: <span aria-hidden className="text-[#6b5b3e]">❦</span>,
    titleClass: "mt-1 font-serif text-xl text-[#3f3a2c]",
    textClass: "mt-1 font-sans text-xs leading-6 text-[#3f3a2c]/75",
  },

  countdown: {
    wrapper:
      "mx-auto mt-10 max-w-sm rounded-2xl bg-[#2c3324] px-5 py-6 text-center text-[#efe7d3]",
    heading: (
      <p className="font-sans text-[11px] tracking-[0.35em] uppercase opacity-70">
        Menuju Hari Bahagia
      </p>
    ),
    grid: "mt-4 grid grid-cols-4 gap-2",
    box: "rounded-xl border border-[#e8dcc3]/25 px-2 py-3",
    value: "text-2xl",
    label: "mt-0.5 font-sans text-[10px] tracking-widest uppercase opacity-60",
    fallback:
      "col-span-4 rounded-xl border border-[#e8dcc3]/25 px-2 py-3 font-sans text-sm",
    passedText: "Acara telah berlangsung. Terima kasih!",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "split",
    item:
      "mx-auto mt-6 max-w-sm overflow-hidden rounded-2xl border border-[#6b5b3e]/25 bg-[#f7f1e1] shadow-md shadow-[#6b4f35]/10",
    header: "bg-[#4a5d3a] px-6 py-3 text-center",
    name: "font-sans text-[11px] font-bold tracking-[0.35em] text-[#efe7d3] uppercase",
    body: "px-6 py-6 text-center",
    date: "text-lg text-[#2c3324]",
    time: "mt-1 font-sans text-sm",
    timePrefix: "Pukul ",
    venue:
      "mt-2 flex items-start justify-center gap-1.5 font-sans text-sm text-[#3f3a2c]/80",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0 text-[#4a5d3a]",
    maps:
      "mt-4 inline-flex h-11 items-center rounded-full bg-[#4a5d3a] px-6 font-sans text-sm font-semibold text-white transition-transform hover:scale-105",
    mapsLabel: "Lihat Rute",
  },

  gallery: {
    wrapper: "mx-auto mt-10 max-w-sm",
    heading: (
      <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#4a5d3a] uppercase">
        <Images className="h-3.5 w-3.5" /> Jejak Langkah
      </p>
    ),
    grid: "mt-4 grid grid-cols-2 gap-2",
    image: (_, index) =>
      `w-full rounded-xl object-cover shadow ${
        index === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"
      }`,
    altFormat: (index) => `Galeri ${index + 1}`,
  },

  accounts: {
    layout: "stack",
    wrapper: "mx-auto mt-10 max-w-sm",
    heading: (
      <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#4a5d3a] uppercase">
        <Gift className="h-3.5 w-3.5" /> Tanda Kasih
      </p>
    ),
    list: "mt-4 space-y-3",
    item:
      "rounded-2xl border border-[#6b5b3e]/25 bg-[#f7f1e1] px-5 py-4 text-center",
    bank: "font-sans text-xs tracking-[0.25em] text-[#6b5b3e] uppercase",
    number: "mt-1 font-sans text-lg font-bold tabular-nums",
    holder: "mt-0.5 font-sans text-xs opacity-60",
    copyWrapper: "mt-3",
    copy: "bg-[#4a5d3a] text-white",
  },

  extraLinks: {
    wrapper: "mx-auto mt-10 max-w-sm text-center",
    heading: (
      <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#4a5d3a] uppercase">
        Tautan Acara
      </p>
    ),
    grid: "mt-4 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#6b5b3e]/40 px-6 font-sans text-sm font-semibold text-[#3f3a2c] transition-colors hover:bg-[#4a5d3a] hover:text-white",
  },

  rsvp: {
    wrapper: "mx-auto mt-10 max-w-sm font-sans",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "Sampai jumpa di hari bahagia",
    render: ({ note, names }) => (
      <>
        <div
          aria-hidden
          className="mx-auto mt-10 flex max-w-44 items-center gap-2 text-[#6b5b3e]"
        >
          <span className="h-px flex-1 bg-[#6b5b3e]/50" />
          <BotanicalSprig className="h-10 w-4" />
          <span className="h-px flex-1 bg-[#6b5b3e]/50" />
        </div>
        <p className="mt-3 text-center font-sans text-xs text-[#3f3a2c]/70">
          {note !== undefined
            ? note || names
            : `${names} · Sampai jumpa di hari bahagia`}
        </p>
      </>
    ),
  },
};

import { CalendarDays, Gift, Images } from "lucide-react";
import { SectionHeading } from "../../shared";
import type { InvitationLayoutConfig } from "../types";

export const TERRA_LAYOUT: InvitationLayoutConfig = {
  root: "relative min-h-full bg-[#f5ede0] font-serif text-[#4a3a2c] antialiased",
  container: "relative mx-auto max-w-md px-8 py-14",

  cover: {
    overlayClass: "bg-[#f5ede0] text-[#4a3a2c]",
    titleFont: "font-serif",
    kicker: "The Wedding Of",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass: "bg-[#b4552d] text-[#fdf8ef] shadow-lg",
  },

  couple: {
    layout: "stack",
    heading: (
      <p className="mt-12 text-center text-[11px] tracking-[0.35em] text-[#b4552d] uppercase">
        Mempelai Berbahagia
      </p>
    ),
    list: "mt-6 space-y-6",
    item:
      "rounded-[2rem] border border-dashed border-[#b4552d]/40 bg-[#fdf8ef] px-6 py-7 text-center shadow-sm",
    name: "text-3xl font-medium text-[#3a2d20]",
    full: "mt-1 font-sans text-sm text-[#6a563e]",
    parents: "mt-2 font-sans text-xs text-[#8a6a4a]",
  },

  story: {
    heading: "Cerita Kami",
    sectionClass: "mt-12 text-center",
    headingClass: "text-[11px] tracking-[0.35em] text-[#b4552d] uppercase",
    itemClass:
      "mx-auto max-w-sm rounded-[2rem] border border-dashed border-[#b4552d]/40 bg-[#fdf8ef] px-6 py-5 shadow-sm",
    marker: <span aria-hidden className="text-[#b4552d]">❧</span>,
    titleClass: "mt-1 font-serif text-xl text-[#3a2d20]",
    textClass: "mt-1 font-sans text-xs leading-6 text-[#6a563e]",
  },

  countdown: {
    wrapper: "mt-12 text-center",
    heading: (
      <SectionHeading
        kicker="Menghitung Hari"
        icon={<CalendarDays className="h-3.5 w-3.5" />}
        className="text-[#b4552d]"
      />
    ),
    grid: "mt-5 grid grid-cols-4 gap-2",
    box: "rounded-2xl bg-[#3a2d20] px-2 py-4 text-[#f5ede0]",
    value: "text-2xl",
    label: "mt-0.5 font-sans text-[10px] tracking-widest uppercase opacity-70",
    fallback: "col-span-4 font-sans text-sm text-[#8a6a4a]",
    passedText: "Acara telah berlangsung. Terima kasih!",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "card",
    item:
      "mt-8 rounded-[2rem] bg-[#3a2d20] px-6 py-7 text-center text-[#f5ede0] shadow-lg",
    name: "font-sans text-[11px] tracking-[0.35em] text-[#e0a878] uppercase",
    date: "mt-3 text-xl",
    time: "mt-1 font-sans text-sm opacity-80",
    timePrefix: "Pukul ",
    venue:
      "mt-3 flex items-start justify-center gap-1.5 font-sans text-sm opacity-85",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0 text-[#e0a878]",
    maps:
      "mt-5 inline-flex h-11 items-center rounded-full bg-[#b4552d] px-6 font-sans text-sm font-medium text-white transition-transform hover:scale-105",
    mapsLabel: "Lihat Lokasi",
  },

  gallery: {
    wrapper: "mt-12",
    heading: (
      <SectionHeading
        kicker="Galeri Momen"
        icon={<Images className="h-3.5 w-3.5" />}
        className="text-[#b4552d]"
      />
    ),
    grid: "mt-5 grid grid-cols-2 gap-3",
    image: (_, index) =>
      `w-full object-cover ${
        index % 2 === 0
          ? "aspect-[3/4] rounded-t-full rounded-b-2xl"
          : "aspect-square rounded-2xl"
      }`,
  },

  accounts: {
    layout: "stack",
    wrapper: "mt-12",
    heading: (
      <SectionHeading
        kicker="Tanda Kasih"
        icon={<Gift className="h-3.5 w-3.5" />}
        className="text-[#b4552d]"
      />
    ),
    list: "mt-5 space-y-3",
    item:
      "rounded-[2rem] border border-[#e0cda8] bg-[#fdf8ef] px-5 py-5 text-center",
    bank: "font-sans text-xs tracking-[0.25em] text-[#b4552d] uppercase",
    number:
      "mt-1 font-sans text-lg font-semibold tracking-wide tabular-nums",
    holder: "mt-0.5 font-sans text-xs text-[#8a6a4a]",
    copyWrapper: "mt-3",
    copy: "bg-[#b4552d] text-white",
  },

  extraLinks: {
    wrapper: "mt-12 text-center",
    heading: (
      <SectionHeading kicker="Tautan Acara" className="text-[#b4552d]" />
    ),
    grid: "mt-5 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#b4552d]/40 px-6 font-sans text-sm font-medium text-[#4a3a2c] transition-colors hover:bg-[#b4552d] hover:text-white",
  },

  rsvp: {
    wrapper:
      "mt-12 rounded-[2rem] border border-dashed border-[#b4552d]/40 bg-[#fdf8ef] p-4",
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
            <p className="mt-12 text-center text-sm text-[#6a563e]">{note}</p>
          ) : null
        ) : (
          <p className="mt-12 text-center text-sm text-[#6a563e]">
            Terima kasih atas doa & kehadiran Anda
          </p>
        )}
        <p className="mt-2 text-center text-xs tracking-[0.3em] text-[#b4552d] uppercase">
          {names}
        </p>
      </>
    ),
  },
};

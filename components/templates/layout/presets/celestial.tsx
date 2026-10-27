import { CalendarDays, Gift, Images } from "lucide-react";
import { SectionHeading } from "../../shared";
import type { InvitationLayoutConfig } from "../types";

export const CELESTIAL_LAYOUT: InvitationLayoutConfig = {
  root:
    "relative min-h-full overflow-hidden bg-[#060a1a] font-serif text-[#ece7d4] antialiased",
  container: "relative mx-auto max-w-md px-8 py-14",

  cover: {
    overlayClass: "bg-[#060a1a] text-[#ece7d4]",
    titleFont: "font-serif",
    kicker: "The Wedding Of",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass:
      "bg-[#d4af37] text-[#060a1a] shadow-[0_0_30px_rgba(212,175,55,0.4)]",
  },

  couple: {
    layout: "stack",
    list: "mt-12 space-y-8 text-center",
    item: "",
    name:
      "mt-2 bg-gradient-to-b from-white to-[#c9b98a] bg-clip-text text-4xl font-medium text-transparent",
    full: "mt-1 font-sans text-sm text-[#b9b09a]",
    parents: "mt-2 font-sans text-xs text-[#8a8474]",
  },

  story: {
    heading: "Constellation of Us",
    sectionClass:
      "mt-12 rounded-3xl border border-[#d4af37]/30 bg-white/[0.04] px-6 py-8 text-center backdrop-blur",
    headingClass: "text-[11px] tracking-[0.4em] text-[#d4af37] uppercase",
    itemClass: "mx-auto max-w-xs",
    marker: <span aria-hidden className="text-[#d4af37]">✦</span>,
    titleClass: "mt-2 font-serif text-2xl text-[#f7ecc8]",
    textClass: "mt-1 font-sans text-xs leading-6 text-[#c9c2ab]",
  },

  countdown: {
    wrapper:
      "mt-12 rounded-3xl border border-[#d4af37]/30 bg-white/[0.04] px-6 py-8 text-center backdrop-blur",
    heading: (
      <SectionHeading
        kicker="Menghitung Hari"
        icon={<CalendarDays className="h-3.5 w-3.5" />}
        className="text-[#d4af37]"
      />
    ),
    grid: "mt-5 grid grid-cols-4 gap-2",
    box: "rounded-2xl border border-[#d4af37]/30 bg-black/40 px-2 py-4",
    value: "text-2xl text-[#f7ecc8]",
    label:
      "mt-0.5 font-sans text-[10px] tracking-widest text-[#8a8474] uppercase",
    fallback: "col-span-4 font-sans text-sm text-[#8a8474]",
    passedText: "Acara telah berlangsung. Terima kasih!",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "card",
    item:
      "mt-8 rounded-3xl border border-[#d4af37]/30 bg-gradient-to-b from-white/[0.07] to-transparent px-6 py-7 text-center",
    name: "font-sans text-[11px] tracking-[0.35em] text-[#d4af37] uppercase",
    date: "mt-3 text-xl text-[#f7ecc8]",
    time: "mt-1 font-sans text-sm text-[#b9b09a]",
    timePrefix: "Pukul ",
    venue:
      "mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-[#c9c2ab]",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0 text-[#d4af37]",
    maps:
      "mt-5 inline-flex h-11 items-center rounded-full bg-[#d4af37] px-6 font-sans text-sm font-semibold text-[#060a1a] shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-transform hover:scale-105",
    mapsLabel: "Lihat Lokasi",
  },

  gallery: {
    wrapper: "mt-12",
    heading: (
      <SectionHeading
        kicker="Galeri"
        icon={<Images className="h-3.5 w-3.5" />}
        className="text-[#d4af37]"
      />
    ),
    grid: "mt-5 grid grid-cols-2 gap-2",
    image:
      "aspect-[3/4] w-full rounded-2xl border border-[#d4af37]/25 object-cover",
  },

  accounts: {
    layout: "stack",
    wrapper: "mt-12",
    heading: (
      <SectionHeading
        kicker="Tanda Kasih"
        icon={<Gift className="h-3.5 w-3.5" />}
        className="text-[#d4af37]"
      />
    ),
    list: "mt-5 space-y-3",
    item:
      "rounded-3xl border border-[#d4af37]/30 bg-white/[0.05] px-5 py-5 text-center",
    bank: "font-sans text-xs tracking-[0.25em] text-[#d4af37] uppercase",
    number:
      "mt-1 font-sans text-lg font-semibold tracking-wide text-white tabular-nums",
    holder: "mt-0.5 font-sans text-xs text-[#8a8474]",
    copyWrapper: "mt-3",
    copy: "bg-[#d4af37] text-[#060a1a]",
  },

  extraLinks: {
    wrapper: "mt-12 text-center",
    heading: (
      <SectionHeading kicker="Tautan Acara" className="text-[#d4af37]" />
    ),
    grid: "mt-5 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#d4af37]/40 px-6 font-sans text-sm font-medium text-[#ece7d4] transition-colors hover:bg-[#d4af37] hover:text-[#060a1a]",
  },

  rsvp: {
    wrapper:
      "mt-12 rounded-3xl border border-[#d4af37]/25 bg-white/[0.04] p-4",
    inner:
      "font-sans text-[#ece7d4] [&_input]:bg-white/10 [&_input]:text-white [&_textarea]:bg-white/10 [&_textarea]:text-white",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "Terima kasih atas doa & kehadiran Anda",
    render: ({ note, names }) => (
      <>
        {note !== undefined ? (
          note ? (
            <p className="mt-12 text-center text-sm text-[#8a8474]">{note}</p>
          ) : null
        ) : (
          <p className="mt-12 text-center text-sm text-[#8a8474]">
            Terima kasih atas doa & kehadiran Anda
          </p>
        )}
        <p className="mt-2 bg-gradient-to-b from-[#f7ecc8] to-[#9a7b24] bg-clip-text text-center text-xs tracking-[0.3em] text-transparent uppercase">
          {names}
        </p>
      </>
    ),
  },
};

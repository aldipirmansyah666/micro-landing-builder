import { CalendarDays, Gift, Images } from "lucide-react";
import { SectionHeading } from "../../shared";
import type { InvitationLayoutConfig } from "../types";

export const VERDANT_LAYOUT: InvitationLayoutConfig = {
  root:
    "relative min-h-full overflow-hidden bg-gradient-to-b from-[#0b2e25] via-[#0e3d30] to-[#071f1a] font-serif text-emerald-50 antialiased",
  container: "relative mx-auto max-w-md px-6 py-14",

  cover: {
    overlayClass: "bg-[#0b2e25]/95 text-emerald-50",
    titleFont: "font-serif",
    kicker: "The Wedding Of",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass: "bg-emerald-100/90 text-[#0b2e25] shadow-xl backdrop-blur",
  },

  couple: {
    layout: "stack",
    heading: <SectionHeading kicker="Mempelai" className="text-emerald-200/80" />,
    headingInsideList: true,
    list: "mt-6 space-y-4",
    item:
      "rounded-3xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-xl",
    name: "text-3xl font-medium",
    full: "mt-1 font-sans text-sm text-emerald-100/80",
    parents: "mt-2 font-sans text-xs text-emerald-200/70",
  },

  story: {
    heading: "Cerita Kami",
    sectionClass:
      "mt-6 rounded-3xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur-lg",
    headingClass:
      "text-[11px] tracking-[0.35em] text-emerald-200/80 uppercase",
    itemClass:
      "rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl",
    marker: <span aria-hidden className="text-emerald-200/70">✦</span>,
    titleClass: "mt-1 font-serif text-xl text-white",
    textClass: "mt-1 font-sans text-xs leading-6 text-emerald-100/80",
  },

  countdown: {
    wrapper:
      "mt-6 rounded-3xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur-lg",
    heading: (
      <SectionHeading
        kicker="Menghitung Hari"
        icon={<CalendarDays className="h-3.5 w-3.5" />}
        className="text-emerald-200/80"
      />
    ),
    grid: "mt-5 grid grid-cols-4 gap-2",
    box: "rounded-2xl border border-white/20 bg-white/10 px-2 py-4 backdrop-blur",
    value: "text-2xl text-white",
    label:
      "mt-0.5 font-sans text-[10px] tracking-widest text-emerald-200/70 uppercase",
    fallback: "col-span-4 font-sans text-sm text-emerald-200/70",
    passedText: "Acara telah berlangsung. Terima kasih!",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "card",
    item:
      "mt-4 rounded-3xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-xl",
    name: "font-sans text-[11px] tracking-[0.35em] text-emerald-200/80 uppercase",
    date: "mt-3 text-xl",
    time: "mt-1 font-sans text-sm text-emerald-100/80",
    timePrefix: "Pukul ",
    venue:
      "mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-emerald-100/80",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0",
    maps:
      "mt-5 inline-flex h-11 items-center rounded-full bg-emerald-100/90 px-6 font-sans text-sm font-medium text-[#0b2e25] transition-transform hover:scale-105",
    mapsLabel: "Lihat Lokasi",
  },

  gallery: {
    wrapper:
      "mt-6 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-lg",
    heading: (
      <SectionHeading
        kicker="Galeri"
        icon={<Images className="h-3.5 w-3.5" />}
        className="text-emerald-200/80"
      />
    ),
    grid: "mt-5 grid grid-cols-2 gap-2",
    image: "aspect-[3/4] w-full rounded-2xl object-cover",
  },

  accounts: {
    layout: "stack",
    wrapper:
      "mt-6 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-lg",
    heading: (
      <SectionHeading
        kicker="Tanda Kasih"
        icon={<Gift className="h-3.5 w-3.5" />}
        className="text-emerald-200/80"
      />
    ),
    list: "mt-5 space-y-3",
    item:
      "rounded-2xl border border-white/20 bg-white/10 p-5 text-center backdrop-blur-xl",
    bank: "font-sans text-xs tracking-[0.25em] text-emerald-200/80 uppercase",
    number:
      "mt-1 font-sans text-lg font-semibold tracking-wide tabular-nums",
    holder: "mt-0.5 font-sans text-xs text-emerald-100/70",
    copyWrapper: "mt-3",
    copy: "bg-emerald-100/90 text-[#0b2e25]",
  },

  extraLinks: {
    wrapper:
      "mt-6 rounded-3xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur-lg",
    heading: (
      <SectionHeading kicker="Tautan Acara" className="text-emerald-200/80" />
    ),
    grid: "mt-5 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 font-sans text-sm font-medium text-emerald-50 backdrop-blur transition-colors hover:bg-emerald-100/90 hover:text-[#0b2e25]",
  },

  rsvp: {
    wrapper:
      "mt-6 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-lg",
    inner: "font-sans [&_input]:bg-white/90 [&_textarea]:bg-white/90",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "Terima kasih atas doa & kehadiran Anda",
    render: ({ note, names }) => (
      <>
        {note !== undefined ? (
          note ? (
            <p className="mt-10 text-center text-sm text-emerald-100/80">
              {note}
            </p>
          ) : null
        ) : (
          <p className="mt-10 text-center text-sm text-emerald-100/80">
            Terima kasih atas doa & kehadiran Anda
          </p>
        )}
        <p className="mt-2 text-center text-xs tracking-[0.3em] text-emerald-200/70 uppercase">
          {names}
        </p>
      </>
    ),
  },
};

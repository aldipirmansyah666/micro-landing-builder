import { Gift, Images, Sparkles } from "lucide-react";
import { EightPointStar } from "../../parts";
import type { InvitationLayoutConfig } from "../types";

export const AZZAHRA_LAYOUT: InvitationLayoutConfig = {
  root: "relative min-h-full bg-[#0f3a3d] font-serif text-[#f4efe3] antialiased",
  container: "px-6 py-10",

  cover: {
    overlayClass: "bg-[#0f3a3d]/95 text-[#f4efe3]",
    titleFont: "font-serif",
    kicker: "✦ Undangan Pernikahan ✦",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass: "bg-[#c2a164] text-[#0f3a3d]",
  },

  couple: {
    layout: "stack",
    list: "mx-auto mt-10 max-w-sm space-y-6",
    item:
      "rounded-t-[4rem] rounded-b-2xl border border-[#c2a164]/40 bg-white/[0.05] px-6 py-6 text-center backdrop-blur-sm",
    name: "text-2xl font-semibold",
    full: "mt-1 font-sans text-sm text-[#f4efe3]/65",
    parents: "mt-2 font-sans text-xs text-[#f4efe3]/55",
    photoClass:
      "mx-auto mb-4 h-28 w-28 rounded-t-[2rem] border border-[#c2a164]/40 object-cover",
  },

  story: {
    heading: "Kisah Kami",
    sectionClass:
      "mx-auto mt-10 max-w-sm border border-[#c2a164]/40 bg-white/[0.04] px-6 py-8 text-center",
    headingClass: "text-[11px] tracking-[0.4em] text-[#c2a164] uppercase",
    itemClass: "mx-auto max-w-xs",
    marker: <span aria-hidden className="text-[#c2a164]">✦</span>,
    titleClass: "mt-2 font-serif text-2xl text-[#f4efe3]",
    textClass: "mt-2 font-sans text-sm leading-7 text-[#e8dcc3]/75",
  },

  countdown: {
    wrapper: "mx-auto mt-10 max-w-sm text-center",
    heading: (
      <p className="text-[11px] tracking-[0.4em] text-[#c2a164] uppercase">
        Menuju Hari Penuh Berkah
      </p>
    ),
    grid: "mt-4 grid grid-cols-4 gap-2",
    box:
      "rounded-t-full rounded-b-xl border border-[#c2a164]/40 bg-white/[0.05] px-2 pt-5 pb-3",
    value: "text-2xl",
    label: "mt-0.5 font-sans text-[10px] tracking-widest uppercase opacity-60",
    fallback:
      "col-span-4 rounded-xl border border-[#c2a164]/40 px-2 py-3 font-sans text-sm",
    passedText: "Acara telah berlangsung. Barakallahu laka.",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "card",
    item:
      "mx-auto mt-6 max-w-sm rounded-t-[3rem] rounded-b-2xl border border-[#c2a164]/40 bg-white/[0.05] px-6 py-7 text-center backdrop-blur-sm",
    icon: <EightPointStar className="mx-auto h-5 w-5 text-[#c2a164]" />,
    name: "mt-2 text-[11px] tracking-[0.4em] text-[#c2a164] uppercase",
    date: "mt-3 text-lg",
    time: "mt-1 font-sans text-sm opacity-75",
    timePrefix: "Pukul ",
    venue:
      "mt-2 flex items-start justify-center gap-1.5 font-sans text-sm opacity-85",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0 text-[#c2a164]",
    maps:
      "mt-4 inline-flex h-11 items-center rounded-full bg-[#c2a164] px-6 font-sans text-sm font-semibold text-[#0f3a3d] transition-transform hover:scale-105",
    mapsLabel: "Lihat Lokasi",
  },

  gallery: {
    wrapper: "mx-auto mt-10 max-w-sm",
    heading: (
      <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.4em] text-[#c2a164] uppercase">
        <Images className="h-3.5 w-3.5" /> Galeri
      </p>
    ),
    grid: "mt-4 grid grid-cols-2 gap-2",
    image:
      "aspect-square w-full rounded-t-full rounded-b-xl border border-[#c2a164]/40 object-cover",
  },

  accounts: {
    layout: "stack",
    wrapper: "mx-auto mt-10 max-w-sm",
    heading: (
      <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.4em] text-[#c2a164] uppercase">
        <Gift className="h-3.5 w-3.5" /> Hadiah
      </p>
    ),
    list: "mt-4 space-y-3",
    item:
      "rounded-2xl border border-[#c2a164]/40 bg-white/[0.05] px-5 py-4 text-center",
    bank: "font-sans text-xs tracking-[0.3em] text-[#c2a164] uppercase",
    number: "mt-1 font-sans text-lg font-semibold tabular-nums",
    holder: "mt-0.5 font-sans text-xs opacity-60",
    copyWrapper: "mt-3",
    copy: "bg-[#c2a164] text-[#0f3a3d]",
  },

  extraLinks: {
    wrapper: "mx-auto mt-10 max-w-sm text-center",
    heading: (
      <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.4em] text-[#c2a164] uppercase">
        <Sparkles className="h-3.5 w-3.5" /> Tautan Acara
      </p>
    ),
    grid: "mt-4 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#c2a164]/60 px-6 font-sans text-sm font-medium text-[#f4efe3] transition-colors hover:bg-[#c2a164] hover:text-[#0f3a3d]",
  },

  rsvp: {
    wrapper: "mx-auto mt-10 max-w-sm font-sans [&_input]:bg-white/5 [&_textarea]:bg-white/5",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "Jazakumullah khairan atas doa Anda",
    render: ({ note, defaultText }) => (
      <>
        <div
          aria-hidden
          className="mt-10 flex items-center justify-center gap-3 text-[#c2a164]"
        >
          <span className="h-px w-16 bg-[#c2a164]/60" />
          <EightPointStar className="h-4 w-4" />
          <span className="h-px w-16 bg-[#c2a164]/60" />
        </div>
        {note !== undefined ? (
          note ? (
            <p className="mt-4 text-center font-sans text-xs opacity-70">
              {note}
            </p>
          ) : null
        ) : (
          <p className="mt-4 text-center font-sans text-xs opacity-70">
            {defaultText}
          </p>
        )}
      </>
    ),
  },
};

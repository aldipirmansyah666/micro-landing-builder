import { Gift, Images, Sparkles } from "lucide-react";
import type { InvitationLayoutConfig } from "../types";

export const PUSPANINGRAT_LAYOUT: InvitationLayoutConfig = {
  root: "relative min-h-full bg-[#f6efe2] font-serif text-[#4a3826] antialiased",
  container: "px-6 pt-4 pb-10",

  cover: {
    overlayClass: "bg-[#3a2c1c]/95 text-[#f6efe2]",
    titleFont: "font-serif",
    kicker: "ꦲꦸꦊꦩꦤ꧀ · Undangan Pernikahan",
    note: "Mohon maaf apabila ada kesalahan penulisan nama & gelar",
    buttonClass: "bg-[#8a5a2b] text-[#fbf6ea]",
  },

  couple: {
    layout: "stack",
    list:
      "mx-auto mt-10 max-w-sm rounded-2xl border-y-2 border-[#8a5a2b]/40 bg-[#fffdf6]/70 px-6 py-2",
    item: (_, index) =>
      `py-5 text-center ${index > 0 ? "border-t border-dashed border-[#8a5a2b]/30" : ""}`,
    name: "text-2xl font-semibold text-[#3a2c1c]",
    full: "mt-1 font-sans text-sm text-[#5c4a33]",
    parents: "mt-1.5 font-sans text-xs text-[#7a6549]",
    photoClass:
      "mx-auto mb-4 h-28 w-28 rounded-full border border-[#8a5a2b]/40 object-cover",
  },

  story: {
    heading: "Kisah Katresnan",
    sectionClass:
      "mt-8 border-y border-[#8a5a2b]/30 bg-[#fffdf6]/60 py-8 text-center",
    headingClass:
      "font-sans text-[11px] tracking-[0.35em] text-[#8a5a2b] uppercase",
    itemClass: "mx-auto max-w-sm",
    marker: <span aria-hidden className="text-[#8a5a2b]">❖</span>,
    titleClass: "mt-2 font-serif text-2xl text-[#4a3a26]",
    textClass:
      "mx-auto mt-2 max-w-sm font-sans text-sm leading-7 text-[#5c4a33]/80",
  },

  countdown: {
    wrapper: "mt-8 text-center",
    heading: (
      <p className="font-sans text-[11px] tracking-[0.35em] text-[#8a5a2b] uppercase">
        Dinten Bahagia
      </p>
    ),
    grid: "mx-auto mt-4 grid max-w-xs grid-cols-4 gap-2",
    box: "rounded-xl bg-[#3a2c1c] px-2 py-3.5 text-[#f6efe2]",
    value: "text-2xl",
    label:
      "mt-0.5 font-sans text-[10px] tracking-widest uppercase opacity-70",
    fallback:
      "col-span-4 rounded-xl border border-[#8a5a2b]/30 px-2 py-3 font-sans text-sm",
    passedText: "Acara sampun kalampahan. Matur nuwun.",
    pendingText: "Tanggal acara menyusul",
  },

  event: {
    layout: "card",
    item:
      "mx-auto mt-6 max-w-sm rounded-2xl border border-[#8a5a2b]/35 bg-[#fffdf6] px-6 py-6 text-center shadow-md shadow-[#8a5a2b]/10",
    name: "font-sans text-[11px] tracking-[0.35em] text-[#8a5a2b] uppercase",
    nameDivider: (
      <div aria-hidden className="mx-auto mt-3 h-px w-16 bg-[#b08d3e]/60" />
    ),
    date: "mt-3 text-lg text-[#3a2c1c]",
    time: "mt-1 font-sans text-sm",
    timePrefix: "Pukul ",
    venue:
      "mt-2 flex items-start justify-center gap-1.5 font-sans text-sm text-[#5c4a33]",
    venueIcon: "mt-0.5 h-4 w-4 shrink-0 text-[#8a5a2b]",
    maps:
      "mt-4 inline-flex h-11 items-center rounded-full bg-[#8a5a2b] px-6 font-sans text-sm font-medium text-[#fbf6ea] transition-transform hover:scale-105",
    mapsLabel: "Buka Peta",
  },

  gallery: {
    wrapper: "mx-auto mt-10 max-w-sm",
    heading: (
      <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#8a5a2b] uppercase">
        <Images className="h-3.5 w-3.5" /> Galeri
      </p>
    ),
    grid: "mt-4 grid grid-cols-2 gap-2",
    image:
      "aspect-[3/4] w-full rounded-xl border-2 border-[#fffdf6] object-cover shadow",
  },

  accounts: {
    layout: "stack",
    wrapper: "mx-auto mt-10 max-w-sm",
    heading: (
      <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#8a5a2b] uppercase">
        <Gift className="h-3.5 w-3.5" /> Tanda Kasih
      </p>
    ),
    list: "mt-4 space-y-3",
    item:
      "rounded-2xl border border-[#8a5a2b]/35 bg-[#fffdf6] px-5 py-4 text-center",
    bank: "font-sans text-xs tracking-[0.25em] text-[#8a5a2b] uppercase",
    number: "mt-1 font-sans text-lg font-semibold tabular-nums",
    holder: "mt-0.5 font-sans text-xs text-[#7a6549]",
    copyWrapper: "mt-3",
    copy: "bg-[#8a5a2b] text-[#fbf6ea]",
  },

  extraLinks: {
    wrapper: "mx-auto mt-10 max-w-sm text-center",
    heading: (
      <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#8a5a2b] uppercase">
        <Sparkles className="h-3.5 w-3.5" /> Tautan Acara
      </p>
    ),
    grid: "mt-4 grid gap-2",
    link:
      "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#8a5a2b]/60 px-6 font-sans text-sm font-medium text-[#4a3826] transition-colors hover:bg-[#8a5a2b] hover:text-[#fbf6ea]",
  },

  rsvp: {
    wrapper:
      "mx-auto mt-10 max-w-sm font-sans [&_input]:bg-[#fffdf6] [&_textarea]:bg-[#fffdf6]",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "Matur nuwun sanget 🙏",
    render: ({ note, defaultText }) =>
      note !== undefined ? (
        note ? (
          <p className="mt-10 text-center text-sm text-[#5c4a33]">{note}</p>
        ) : null
      ) : (
        <p className="mt-10 text-center text-sm text-[#5c4a33]">
          {defaultText}
        </p>
      ),
  },
};

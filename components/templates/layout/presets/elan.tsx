import { ArrowUpRight, Gift } from "lucide-react";
import type { InvitationLayoutConfig } from "../types";

export const ELAN_LAYOUT: InvitationLayoutConfig = {
  root:
    "relative min-h-full bg-[#fafafa] font-sans text-[#111111] antialiased dark:bg-[#111111] dark:text-[#fafafa]",
  container: "px-6 pt-10 pb-14",

  cover: {
    overlayClass: "bg-[#111111]/95 text-[#fafafa]",
    titleFont: "font-sans",
    kicker: "You are invited — N°01",
    note: "Please excuse any misspelling of names & titles",
    buttonClass: "bg-[#fafafa] text-[#111111]",
  },

  couple: {
    layout: "editorial",
    revealItems: true,
    list: undefined,
    item: "mt-8 border-t border-current/20 pt-4",
    name: "text-2xl font-extrabold tracking-tight uppercase",
    full: "mt-0.5 text-xs text-current/60",
    parents: "mt-1.5 text-xs text-current/60",
    editorial: {
      wrapper: "flex items-start justify-between gap-4",
      nameWrap: "flex-1 text-right",
      indexClass: "text-5xl font-black text-current/15 tabular-nums",
      indexFormat: (index) => `0${index + 1}`,
    },
  },

  story: {
    heading: "Our Story",
    sectionClass: "mt-8 border-2 border-current p-5",
    headingClass: "text-[11px] font-bold tracking-[0.3em] uppercase",
    itemClass:
      "mt-4 border-t border-current/20 pt-4 first:mt-0 first:border-t-0 first:pt-0",
    marker: (
      <span aria-hidden className="text-[10px] font-bold opacity-50">
        — N°
      </span>
    ),
    titleClass: "mt-1 text-xl font-black uppercase",
    textClass: "mt-1 text-xs leading-6 opacity-70",
  },

  countdown: {
    wrapper:
      "mt-8 bg-[#111111] px-5 py-6 text-[#fafafa] dark:bg-[#fafafa] dark:text-[#111111]",
    heading: (
      <p className="text-[10px] font-bold tracking-[0.35em] uppercase opacity-60">
        Countdown
      </p>
    ),
    grid: "mt-3 flex items-baseline gap-5",
    box: "",
    value: "text-4xl font-black",
    label: "text-[10px] tracking-[0.2em] uppercase opacity-60",
    fallback: "text-sm opacity-70",
    labels: { days: "Days", hours: "Hrs", mins: "Min", secs: "Sec" },
    passedText: "This event has passed. Thank you!",
    pendingText: "Date to be announced",
  },

  event: {
    layout: "card",
    item: "mt-8 border-t-2 border-current pt-4",
    name: "text-[11px] font-bold tracking-[0.3em] uppercase",
    nameFormat: (_, index) => `${String(index + 1).padStart(2, "0")} — ${index === 0 ? "Akad" : "Resepsi"}`,
    date: "mt-2 text-xl font-extrabold tracking-tight",
    time: "text-sm text-current/60",
    timePrefix: "",
    venue: "mt-2 text-sm text-current/75",
    maps:
      "mt-3 inline-flex h-11 items-center gap-1 text-sm font-bold underline underline-offset-4",
    mapsLabel: "Open in Maps",
    mapsIcon: <ArrowUpRight className="h-4 w-4" />,
    mapsIconPosition: "after",
  },

  gallery: {
    wrapper: "mt-10",
    heading: (count) => (
      <div className="flex items-baseline justify-between border-b border-current/20 pb-2">
        <p className="text-[11px] font-bold tracking-[0.3em] uppercase">
          Selected Frames
        </p>
        <p className="text-[11px] text-current/50">({count})</p>
      </div>
    ),
    grid: "mt-3 grid grid-cols-2 gap-2",
    image: (_, index) =>
      `w-full bg-[#e4e4e4] object-cover dark:bg-[#222222] ${
        index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
      }`,
    altFormat: (index) => `Galeri ${index + 1}`,
  },

  accounts: {
    layout: "row",
    wrapper: "mt-10",
    heading: (
      <p className="flex items-center gap-2 border-b border-current/20 pb-2 text-[11px] font-bold tracking-[0.3em] uppercase">
        <Gift className="h-3.5 w-3.5" /> Digital Envelope
      </p>
    ),
    list: "mt-3 space-y-2",
    item:
      "flex items-center justify-between gap-3 border border-current/20 px-4 py-3",
    bank: "text-[10px] font-bold tracking-[0.25em] text-current/50 uppercase",
    number: "font-bold tabular-nums",
    holder: "text-xs text-current/60",
    copy: "bg-[#111111] text-white dark:bg-[#fafafa] dark:text-[#111111]",
  },

  extraLinks: {
    wrapper: "mt-10",
    heading: (
      <p className="flex items-center gap-2 border-b border-current/20 pb-2 text-[11px] font-bold tracking-[0.3em] uppercase">
        Tautan Acara
      </p>
    ),
    grid: "mt-3 grid gap-2",
    link:
      "inline-flex h-11 items-center gap-1 text-sm font-bold underline underline-offset-4",
  },

  rsvp: {
    wrapper: "mt-10 border-t-2 border-current pt-4",
    heading: (
      <p className="text-[11px] font-bold tracking-[0.3em] uppercase">
        Wishes &amp; RSVP
      </p>
    ),
    inner: "mt-3",
  },

  closing: {
    wrapper: "",
    names: "",
    defaultText: "",
    render: ({ note, names }) => (
      <>
        {note ? (
          <p className="mt-10 text-center text-sm italic opacity-70">{note}</p>
        ) : null}
        <p className="mt-10 text-[10px] tracking-[0.3em] text-current/50 uppercase">
          Élan © 2026 — {names}
        </p>
      </>
    ),
  },
};

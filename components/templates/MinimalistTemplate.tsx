"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  Gift,
  Images,
  MapPin,
  MessageCircleHeart,
} from "lucide-react";
import { coupleNames, eventTimestamp, formatDateLong } from "@/lib/invitation";
import {
  CopyRekeningButton,
  CoverOverlay,
  MusicToggle,
  SafeImg,
  useCountdown,
} from "./shared";
import type { TemplateProps } from "./types";

/** Modern Minimalist: clean hitam-putih, sans-serif, presisi. */
export function MinimalistTemplate({ title, content, guestName, rsvpSlot }: TemplateProps) {
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const target = useMemo(() => eventTimestamp(content), [content]);
  const countdown = useCountdown(target, opened);

  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const card = "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950";

  return (
    <div className="relative min-h-full bg-white font-sans text-zinc-900 antialiased dark:bg-black dark:text-zinc-50">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          overlayClass="bg-zinc-950 text-zinc-50"
          titleFont="font-sans"
          image={content.heroImage}
          kicker="You are invited"
          names={names}
          guest={guest}
          note="Please excuse any misspelling of names & titles"
          buttonClass="bg-zinc-50 text-zinc-950"
          onOpen={() => {
            setOpened(true);
            audioRef.current?.play().catch(() => {});
          }}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle
          muted={muted}
          onToggle={() => {
            const a = audioRef.current;
            if (!a) return;
            a.muted = !a.muted;
            setMuted(a.muted);
          }}
        />
      )}

      <div className="px-6 py-12">
        <div className="text-left">
          <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-zinc-400">
            The Wedding Of
          </p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight">{names}</h2>
          {content.quote && (
            <p className="mt-4 border-l-2 border-zinc-900 pl-4 text-sm leading-7 text-zinc-600 dark:border-zinc-100 dark:text-zinc-400">
              {content.quote}
            </p>
          )}
        </div>

        <SafeImg
          src={content.heroImage}
          alt={title}
          fallbackLabel={title}
          className="mt-8 aspect-[4/5] w-full rounded-none object-cover"
        />

        <div className="mt-10 grid grid-cols-2 gap-px bg-zinc-200 dark:bg-zinc-800">
          {[
            { nick: content.groomNickname || content.groomFullName, full: content.groomFullName, parents: content.groomParents },
            { nick: content.brideNickname || content.brideFullName, full: content.brideFullName, parents: content.brideParents },
          ].map(
            (p, i) =>
              (p.nick || p.parents) && (
                <div key={i} className="bg-white px-4 py-6 dark:bg-black">
                  <p className="text-lg font-semibold tracking-tight">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && (
                    <p className="mt-0.5 text-xs text-zinc-500">{p.full}</p>
                  )}
                  {p.parents && <p className="mt-2 text-xs text-zinc-500">{p.parents}</p>}
                </div>
              )
          )}
        </div>

        <div className="mt-10">
          <p className="flex items-center gap-2 text-[11px] font-medium tracking-[0.3em] uppercase text-zinc-400">
            <Calendar className="h-3.5 w-3.5" /> Countdown
          </p>
          {countdown && !countdown.passed ? (
            <div className="mt-4 flex items-baseline gap-5">
              {[
                { v: countdown.days, l: "Days" },
                { v: countdown.hours, l: "Hrs" },
                { v: countdown.mins, l: "Min" },
                { v: countdown.secs, l: "Sec" },
              ].map((u) => (
                <div key={u.l}>
                  <p className="text-4xl font-semibold tabular-nums">{u.v}</p>
                  <p className="text-[11px] uppercase tracking-widest text-zinc-400">{u.l}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">
              {target ? "This event has passed. Thank you!" : "Date to be announced"}
            </p>
          )}
        </div>

        {[
          { no: "01", name: "Akad", date: content.akadDate, time: content.akadTime, venue: content.akadVenue, maps: content.akadMapsUrl },
          { no: "02", name: "Resepsi", date: content.receptionDate, time: content.receptionTime, venue: content.receptionVenue, maps: content.receptionMapsUrl },
        ]
          .filter((e) => e.date || e.time || e.venue)
          .map((e) => (
            <div key={e.name} className={`mt-10 border-t pt-6 ${"border-zinc-200 dark:border-zinc-800"}`}>
              <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-zinc-400">
                {e.no} — {e.name}
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight">{formatDateLong(e.date)}</p>
              {e.time && <p className="text-sm text-zinc-500">{e.time} WIB</p>}
              {e.venue && (
                <p className="mt-2 flex items-start gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {e.venue}
                </p>
              )}
              {e.maps && (
                <a href={e.maps} target="_blank" rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4">
                  Open in Maps <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
          ))}

        {content.galleryImages.length > 0 && (
          <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <p className="flex items-center gap-2 text-[11px] font-medium tracking-[0.3em] uppercase text-zinc-400">
              <Images className="h-3.5 w-3.5" /> Gallery
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {content.galleryImages.map((url) => (
                <SafeImg key={url} src={url} alt="Galeri" className="aspect-square w-full object-cover" />
              ))}
            </div>
          </div>
        )}

        {content.accounts.length > 0 && (
          <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <p className="flex items-center gap-2 text-[11px] font-medium tracking-[0.3em] uppercase text-zinc-400">
              <Gift className="h-3.5 w-3.5" /> Digital Envelope
            </p>
            <div className="mt-4 space-y-3">
              {content.accounts.map((a, i) => (
                <div key={`${a.bank}-${a.number}-${i}`} className={`rounded-2xl border p-4 ${card}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                        {a.bank || "Bank"}
                      </p>
                      <p className="mt-0.5 font-semibold tabular-nums">{a.number || "-"}</p>
                      {a.holder && <p className="text-xs text-zinc-500">a.n. {a.holder}</p>}
                    </div>
                    {a.number && (
                      <CopyRekeningButton
                        text={a.number}
                        buttonClass="bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="flex items-center gap-2 text-[11px] font-medium tracking-[0.3em] uppercase text-zinc-400">
            <MessageCircleHeart className="h-3.5 w-3.5" /> Wishes & RSVP
          </p>
          <div className="mt-4">{rsvpSlot}</div>
        </div>
      </div>
    </div>
  );
}

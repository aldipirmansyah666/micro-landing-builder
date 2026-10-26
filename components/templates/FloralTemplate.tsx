"use client";

import { useMemo, useRef, useState } from "react";
import {
  Calendar,
  Flower2,
  Gift,
  Images,
  MapPin,
  MessageCircleHeart,
  Navigation,
} from "lucide-react";
import { coupleNames, eventTimestamp, formatDateLong } from "@/lib/invitation";
import {
  CopyRekeningButton,
  CoverOverlay,
  MusicToggle,
  OrnateDivider,
  Reveal,
  SafeImg,
  SectionHeading,
  useCountdown,
  useCoverOpened,
} from "./shared";
import type { TemplateProps } from "./types";

/** Floral Romance: pastel bunga, romantis, font serif italic. */
export function FloralTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const [opened, setOpened] = useCoverOpened(defaultOpened);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const target = useMemo(() => eventTimestamp(content), [content]);
  const countdown = useCountdown(target, opened);

  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const card = "border-rose-200/70 bg-white/80 shadow-lg shadow-rose-200/50 backdrop-blur-md";

  return (
    <div className="relative min-h-full bg-gradient-to-b from-rose-50 via-pink-50 to-rose-100 font-serif text-rose-950 antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-rose-950/90 text-rose-50"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="🌸 Undangan Pernikahan 🌸"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-rose-200 text-rose-950"
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

      <div className="px-5 py-10">
        <Reveal>
        <div className="text-center">
          <Flower2 className="animate-float-slow mx-auto h-7 w-7 text-rose-400" />
          <p className="mt-2 text-[11px] tracking-[0.3em] uppercase text-rose-400">
            Assalamu&apos;alaikum Wr. Wb.
          </p>
          {content.quote && (
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-rose-900/80 italic">
              &ldquo;{content.quote}&rdquo;
            </p>
          )}
        </div>
        </Reveal>

        <Reveal delayMs={80}>
        <div className="mt-8 text-center">
          <h2 className="text-4xl font-semibold text-rose-900 italic">{names}</h2>
          <p className="mt-2 text-xs text-rose-400">🌷 Bersama restu keluarga tercinta 🌷</p>
          <OrnateDivider lineClass="bg-rose-300" ornament="❀" className="mx-auto mt-4 max-w-44 text-rose-400" />
          <div className="mt-5 grid gap-3">
            {[
              { nick: content.groomNickname || content.groomFullName, full: content.groomFullName, parents: content.groomParents, label: "Putra dari" },
              { nick: content.brideNickname || content.brideFullName, full: content.brideFullName, parents: content.brideParents, label: "Putri dari" },
            ].map(
              (p) =>
                (p.nick || p.parents) && (
                  <div key={p.label} className={`rounded-[2rem] border px-5 py-5 shadow-sm shadow-rose-100 ${card}`}>
                    <p className="text-2xl font-semibold text-rose-900 italic">{p.nick || "-"}</p>
                    {p.full && p.full !== p.nick && (
                      <p className="mt-0.5 text-sm text-rose-900/60">{p.full}</p>
                    )}
                    {p.parents && (
                      <p className="mt-2 text-xs text-rose-900/50">{p.label} {p.parents}</p>
                    )}
                  </div>
                )
            )}
          </div>
        </div>
        </Reveal>

        <Reveal>
        <div className="mt-8 text-center">
          <SectionHeading
            kicker="Counting Down To Forever"
            icon={<Calendar className="h-3.5 w-3.5" />}
            className="text-rose-400"
          />
          {countdown && !countdown.passed ? (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[
                { v: countdown.days, l: "Hari" },
                { v: countdown.hours, l: "Jam" },
                { v: countdown.mins, l: "Menit" },
                { v: countdown.secs, l: "Detik" },
              ].map((u) => (
                <div key={u.l} className={`rounded-full border px-2 py-4 ${card}`}>
                  <p className="text-2xl font-semibold text-rose-800 tabular-nums">{u.v}</p>
                  <p className="text-[11px] text-rose-400">{u.l}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${card}`}>
              {target ? "Acara telah berlangsung. Terima kasih! 💐" : "Tanggal acara menyusul"}
            </p>
          )}
        </div>
        </Reveal>

        <Reveal>
        <div className="relative mt-8">
        <div aria-hidden className="absolute -inset-1 rounded-[2.8rem] bg-gradient-to-br from-rose-200 via-white to-pink-200 blur-[2px]" />
        <SafeImg
          key={content.heroImage}
          src={content.heroImage}
          alt={title}
          fallbackLabel={title}
          className="relative aspect-[4/5] w-full rounded-[2.5rem] border-4 border-white object-cover shadow-xl shadow-rose-200"
        />
        </div>
        </Reveal>

        {[
          { name: "Akad Nikah 💍", date: content.akadDate, time: content.akadTime, timezone: content.akadTimezone, venue: content.akadVenue, maps: content.akadMapsUrl },
          { name: "Resepsi 🎉", date: content.receptionDate, time: content.receptionTime, timezone: content.receptionTimezone, venue: content.receptionVenue, maps: content.receptionMapsUrl },
        ]
          .filter((e) => e.date || e.time || e.venue)
          .map((e) => (
            <Reveal key={e.name}>
            <div className={`mt-4 rounded-[2rem] border px-5 py-6 text-center shadow-sm shadow-rose-100 ${card}`}>
              <p className="text-lg font-semibold text-rose-900">{e.name}</p>
              <OrnateDivider lineClass="bg-rose-200" ornament="❀" className="mx-auto mt-3 max-w-32 text-rose-300" />
              <p className="mt-2 text-sm">{formatDateLong(e.date)}</p>
              {e.time && <p className="text-sm text-rose-900/60">Pukul {e.time} {e.timezone}</p>}
              {e.venue && <p className="mt-2 text-sm text-rose-900/80">{e.venue}</p>}
              {e.maps && (
                <a href={e.maps} target="_blank" rel="noopener noreferrer"
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-rose-400 px-5 text-sm font-medium text-white shadow-lg shadow-rose-300/40 transition-all hover:scale-105">
                  <Navigation className="h-4 w-4" /> Buka Maps
                </a>
              )}
            </div>
            </Reveal>
          ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
          <div className="mt-8">
            <SectionHeading
              kicker="Our Memories"
              icon={<Images className="h-3.5 w-3.5" />}
              className="text-rose-400"
            />
            <OrnateDivider lineClass="bg-rose-200" ornament="❀" className="mx-auto mt-3 max-w-32 text-rose-300" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {content.galleryImages.map((url) => (
                <SafeImg key={url} src={url} alt="Galeri"
                  className="aspect-[3/4] w-full rounded-[1.5rem] border-2 border-white object-cover shadow-md shadow-rose-100 transition-transform duration-500 hover:scale-[1.03] hover:rotate-[0.5deg]" />
              ))}
            </div>
          </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
          <div className="mt-8">
            <SectionHeading
              kicker="Wedding Gift"
              icon={<Gift className="h-3.5 w-3.5" />}
              className="text-rose-400"
            />
            <OrnateDivider lineClass="bg-rose-200" ornament="❀" className="mx-auto mt-3 max-w-32 text-rose-300" />
            <div className="mt-4 grid gap-3">
              {content.accounts.map((a, i) => (
                <div key={`${a.bank}-${a.number}-${i}`} className={`rounded-[2rem] border px-5 py-4 text-center shadow-sm shadow-rose-100 ${card}`}>
                  <p className="text-xs font-semibold tracking-widest uppercase text-rose-400">{a.bank || "Bank"}</p>
                  <p className="mt-1 text-xl font-semibold tracking-wide tabular-nums">{a.number || "-"}</p>
                  {a.holder && <p className="mt-0.5 text-xs text-rose-900/50">a.n. {a.holder}</p>}
                  {a.number && (
                    <div className="mt-3">
                      <CopyRekeningButton text={a.number} buttonClass="bg-rose-400 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          </Reveal>
        )}

        <Reveal>
        <div className="mt-8">
          <SectionHeading
            kicker="Send Your Wishes"
            icon={<MessageCircleHeart className="h-3.5 w-3.5" />}
            className="text-rose-400"
          />
          <OrnateDivider lineClass="bg-rose-200" ornament="❀" className="mx-auto mt-3 max-w-32 text-rose-300" />
          <div className="mt-4">{rsvpSlot}</div>
        </div>
        </Reveal>

        <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-rose-400">
          <MapPin className="h-3.5 w-3.5" /> {names} · With love 🌸
        </p>
      </div>
    </div>
  );
}

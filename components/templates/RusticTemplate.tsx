"use client";

import { useMemo, useRef, useState } from "react";
import {
  Calendar,
  Gift,
  Images,
  Leaf,
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

/** Rustic Earthy: nuansa kayu/hangat, tone earthy, font casual. */
export function RusticTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const [opened, setOpened] = useCoverOpened(defaultOpened);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const target = useMemo(() => eventTimestamp(content), [content]);
  const countdown = useCountdown(target, opened);

  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const card = "border-amber-900/20 bg-[#fffdf8] shadow-lg shadow-amber-900/10";

  return (
    <div className="relative min-h-full bg-[#f5efe3] font-sans text-stone-800 antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#3b2d20]/95 text-amber-50"
          titleFont="font-sans"
          image={content.heroImage}
          kicker="~ Undangan Pernikahan ~"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-amber-100 text-stone-900"
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
          <Leaf className="animate-float-slow mx-auto h-6 w-6 text-amber-800" />
          <p className="mt-2 text-[11px] tracking-[0.3em] uppercase text-stone-500">
            Assalamu&apos;alaikum Wr. Wb.
          </p>
          {content.quote && (
            <p className="mx-auto mt-4 max-w-md rounded-2xl border border-dashed border-amber-900/30 bg-[#fffdf8] px-5 py-4 text-sm leading-7 text-stone-600 italic shadow-sm">
              &ldquo;{content.quote}&rdquo;
            </p>
          )}
        </div>
        </Reveal>

        <Reveal delayMs={80}>
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">{names}</h2>
          <p className="mt-1 text-xs text-stone-500">~ Dua hati, satu tujuan ~</p>
          <OrnateDivider lineClass="bg-amber-900/30" ornament="🍂" className="mx-auto mt-4 max-w-44 text-amber-800" />
          <div className="mt-5 grid gap-3">
            {[
              { nick: content.groomNickname || content.groomFullName, full: content.groomFullName, parents: content.groomParents, label: "Putra dari" },
              { nick: content.brideNickname || content.brideFullName, full: content.brideFullName, parents: content.brideParents, label: "Putri dari" },
            ].map(
              (p) =>
                (p.nick || p.parents) && (
                  <div key={p.label} className={`rounded-3xl border-2 px-5 py-5 ${card}`}>
                    <p className="text-xl font-bold text-amber-900">{p.nick || "-"}</p>
                    {p.full && p.full !== p.nick && (
                      <p className="mt-0.5 text-sm text-stone-500">{p.full}</p>
                    )}
                    {p.parents && (
                      <p className="mt-2 text-xs text-stone-500">{p.label} {p.parents}</p>
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
            kicker="Save The Date"
            icon={<Calendar className="h-3.5 w-3.5" />}
            className="font-bold text-amber-900"
          />
          {countdown && !countdown.passed ? (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[
                { v: countdown.days, l: "Hari" },
                { v: countdown.hours, l: "Jam" },
                { v: countdown.mins, l: "Menit" },
                { v: countdown.secs, l: "Detik" },
              ].map((u) => (
                <div key={u.l} className="rounded-3xl bg-amber-900 px-2 py-3 text-amber-50">
                  <p className="text-2xl font-bold tabular-nums">{u.v}</p>
                  <p className="text-[11px] opacity-70">{u.l}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${card}`}>
              {target ? "Acara telah berlangsung. Terima kasih! 🎉" : "Tanggal acara menyusul"}
            </p>
          )}
        </div>
        </Reveal>

        <Reveal>
        <div className="relative mt-8">
        <div aria-hidden className="absolute -inset-1 rounded-[1.9rem] border-2 border-dashed border-amber-900/30" />
        <SafeImg
          key={content.heroImage}
          src={content.heroImage}
          alt={title}
          fallbackLabel={title}
          className="relative aspect-[4/5] w-full rounded-3xl border-4 border-[#fffdf8] object-cover shadow-lg"
        />
        </div>
        </Reveal>

        {[
          { name: "Akad Nikah", date: content.akadDate, time: content.akadTime, venue: content.akadVenue, maps: content.akadMapsUrl },
          { name: "Resepsi", date: content.receptionDate, time: content.receptionTime, venue: content.receptionVenue, maps: content.receptionMapsUrl },
        ]
          .filter((e) => e.date || e.time || e.venue)
          .map((e) => (
            <Reveal key={e.name}>
            <div className={`mt-4 rounded-3xl border-2 border-amber-900/20 px-5 py-6 text-center ${card}`}>
              <p className="text-base font-bold text-amber-900">🌿 {e.name}</p>
              <OrnateDivider lineClass="bg-amber-900/20" ornament="•" className="mx-auto mt-3 max-w-32 text-amber-800" />
              <p className="mt-2 text-sm font-medium">{formatDateLong(e.date)}</p>
              {e.time && <p className="text-sm text-stone-500">Pukul {e.time} WIB</p>}
              {e.venue && <p className="mt-2 text-sm">{e.venue}</p>}
              {e.maps && (
                <a href={e.maps} target="_blank" rel="noopener noreferrer"
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-amber-900 px-5 text-sm font-medium text-amber-50 shadow-lg shadow-amber-900/25 transition-all hover:scale-105">
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
              kicker="Galeri Kami"
              icon={<Images className="h-3.5 w-3.5" />}
              className="font-bold text-amber-900"
            />
            <OrnateDivider lineClass="bg-amber-900/20" ornament="•" className="mx-auto mt-3 max-w-32 text-amber-800" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {content.galleryImages.map((url, i) => (
                <SafeImg key={url} src={url} alt="Galeri"
                  className={`w-full rounded-3xl border-2 border-[#fffdf8] object-cover shadow transition-transform duration-500 hover:scale-[1.03] ${i % 3 === 0 ? "aspect-square" : "aspect-[4/5]"}`} />
              ))}
            </div>
          </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
          <div className="mt-8">
            <SectionHeading
              kicker="Amplop Digital"
              icon={<Gift className="h-3.5 w-3.5" />}
              className="font-bold text-amber-900"
            />
            <OrnateDivider lineClass="bg-amber-900/20" ornament="•" className="mx-auto mt-3 max-w-32 text-amber-800" />
            <div className="mt-4 grid gap-3">
              {content.accounts.map((a, i) => (
                <div key={`${a.bank}-${a.number}-${i}`} className={`rounded-3xl border-2 border-amber-900/20 px-5 py-4 text-center ${card}`}>
                  <p className="text-xs font-bold tracking-widest uppercase text-amber-900">{a.bank || "Bank"}</p>
                  <p className="mt-1 text-xl font-bold tracking-wide tabular-nums">{a.number || "-"}</p>
                  {a.holder && <p className="mt-0.5 text-xs text-stone-500">a.n. {a.holder}</p>}
                  {a.number && (
                    <div className="mt-3">
                      <CopyRekeningButton text={a.number} buttonClass="bg-amber-900 text-amber-50" />
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
            kicker="Ucapan & RSVP"
            icon={<MessageCircleHeart className="h-3.5 w-3.5" />}
            className="font-bold text-amber-900"
          />
          <OrnateDivider lineClass="bg-amber-900/20" ornament="•" className="mx-auto mt-3 max-w-32 text-amber-800" />
          <div className="mt-4">{rsvpSlot}</div>
        </div>
        </Reveal>

        <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-stone-500">
          <MapPin className="h-3.5 w-3.5" /> {names} · Sampai jumpa!
        </p>
      </div>
    </div>
  );
}

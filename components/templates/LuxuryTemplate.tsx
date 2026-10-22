"use client";

import { useMemo, useRef, useState } from "react";
import {
  Calendar,
  Crown,
  Gem,
  Gift,
  Images,
  MapPin,
  MessageCircleHeart,
  Navigation,
  Sparkles,
} from "lucide-react";
import {
  coupleNames,
  eventTimestamp,
  formatDateLong,
} from "@/lib/invitation";
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

/**
 * Luxury Gold & Emerald: emerald gelap + aksen emas berkilau,
 * bingkai ganda, kartu kaca (glassmorphism), tipografi serif mewah.
 */
export function LuxuryTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const [opened, setOpened] = useCoverOpened(defaultOpened);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const target = useMemo(() => eventTimestamp(content), [content]);
  const countdown = useCountdown(target, opened);

  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const gold = "text-amber-200";
  const card =
    "border-amber-200/25 bg-white/[0.06] shadow-2xl shadow-black/50 backdrop-blur-md";

  return (
    <div className="relative min-h-full overflow-hidden bg-emerald-950 font-serif text-emerald-50 antialiased">
      {/* Ornamen cahaya latar */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-glow-pulse absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-300/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-emerald-950/95 text-amber-50"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="✦ Undangan Pernikahan ✦"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 text-emerald-950 shadow-lg shadow-amber-400/30"
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

      <div className="relative px-5 py-10">
        <Reveal>
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-200/40 bg-amber-200/10 shadow-lg shadow-amber-400/20">
              <Crown className="animate-float-slow h-6 w-6 text-amber-200" />
            </div>
            <p className={`mt-3 text-[11px] tracking-[0.35em] uppercase ${gold}/70`}>
              Assalamu&apos;alaikum Wr. Wb.
            </p>
            {content.quote && (
              <p className="mx-auto mt-4 max-w-md rounded-2xl border border-amber-200/20 bg-white/[0.04] px-5 py-4 text-sm leading-7 text-emerald-50/85 italic backdrop-blur-sm">
                &ldquo;{content.quote}&rdquo;
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mt-8 text-center">
            <p className={`flex items-center justify-center gap-1.5 text-[11px] tracking-[0.3em] uppercase ${gold}/60`}>
              <Sparkles className="h-3.5 w-3.5" /> The Wedding Of
            </p>
            <h2 className="text-shimmer-gold mt-3 text-4xl font-semibold leading-tight">
              {names}
            </h2>
            <OrnateDivider
              lineClass="bg-gradient-to-r from-transparent via-amber-200/70 to-transparent"
              ornament="💎"
              className="mx-auto mt-5 max-w-52 text-amber-200"
            />
            <div className="mt-5 grid gap-3">
              {[
                { nick: content.groomNickname || content.groomFullName, full: content.groomFullName, parents: content.groomParents, label: "Putra dari" },
                { nick: content.brideNickname || content.brideFullName, full: content.brideFullName, parents: content.brideParents, label: "Putri dari" },
              ].map(
                (p) =>
                  (p.nick || p.parents) && (
                    <div key={p.label} className={`relative rounded-3xl border p-[1px] ${"border-amber-200/30"}`}>
                      <div className={`rounded-3xl px-5 py-6 ${card}`}>
                        <Gem className="mx-auto h-4 w-4 text-amber-200/70" />
                        <p className="text-shimmer-gold mt-2 text-2xl font-semibold">{p.nick || "-"}</p>
                        {p.full && p.full !== p.nick && (
                          <p className="mt-0.5 text-sm text-emerald-50/70">{p.full}</p>
                        )}
                        {p.parents && (
                          <p className="mt-2 text-xs text-emerald-50/55">{p.label} {p.parents}</p>
                        )}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-8 text-center">
            <SectionHeading
              kicker="Menghitung Hari Bahagia"
              icon={<Calendar className="h-3.5 w-3.5" />}
              className={`${gold}/70`}
            />
            {countdown && !countdown.passed ? (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[
                  { v: countdown.days, l: "Hari" },
                  { v: countdown.hours, l: "Jam" },
                  { v: countdown.mins, l: "Menit" },
                  { v: countdown.secs, l: "Detik" },
                ].map((u) => (
                  <div key={u.l} className={`rounded-2xl border px-2 py-4 ${card}`}>
                    <p className="text-shimmer-gold text-2xl font-semibold tabular-nums">{u.v}</p>
                    <p className="mt-0.5 text-[11px] text-emerald-50/60">{u.l}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${card}`}>
                {target ? "Acara telah berlangsung. Terima kasih! 💎" : "Tanggal acara menyusul"}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal>
          <div className="relative mt-8">
            <div aria-hidden className="absolute -inset-1.5 rounded-[1.7rem] bg-gradient-to-br from-amber-200 via-amber-400/40 to-emerald-700 blur-[3px]" />
            <SafeImg
              key={content.heroImage}
              src={content.heroImage}
              alt={title}
              fallbackLabel={title}
              className="relative aspect-[4/5] w-full rounded-3xl border border-amber-100/50 object-cover"
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
              <div className={`mt-4 rounded-3xl border px-5 py-6 text-center ${card}`}>
                <SectionHeading
                  kicker={e.name}
                  icon={<MapPin className="h-3.5 w-3.5" />}
                  className={`${gold}/75`}
                />
                <OrnateDivider lineClass="bg-amber-200/30" ornament="✦" className="mx-auto mt-3 max-w-36 text-amber-200/70" />
                <p className="mt-3 text-lg text-emerald-50">{formatDateLong(e.date)}</p>
                {e.time && <p className="text-sm text-amber-100/75">Pukul {e.time} WIB</p>}
                {e.venue && <p className="mt-2 text-sm text-emerald-50/85">{e.venue}</p>}
                {e.maps && (
                  <a href={e.maps} target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 px-5 text-sm font-semibold text-emerald-950 shadow-lg shadow-amber-400/30 transition-all hover:scale-105">
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
                kicker="Galeri Momen"
                icon={<Images className="h-3.5 w-3.5" />}
                className={`${gold}/70`}
              />
              <OrnateDivider lineClass="bg-amber-200/30" ornament="✦" className="mx-auto mt-3 max-w-36 text-amber-200/70" />
              <div className="mt-4 grid grid-cols-2 gap-2">
                {content.galleryImages.map((url) => (
                  <div key={url} className="rounded-2xl border border-amber-200/25 p-1 backdrop-blur-sm">
                    <SafeImg src={url} alt="Galeri"
                      className="aspect-square w-full rounded-xl object-cover transition-transform duration-500 hover:scale-[1.02]" />
                  </div>
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
                className={`${gold}/70`}
              />
              <OrnateDivider lineClass="bg-amber-200/30" ornament="✦" className="mx-auto mt-3 max-w-36 text-amber-200/70" />
              <div className="mt-4 grid gap-3">
                {content.accounts.map((a, i) => (
                  <div key={`${a.bank}-${a.number}-${i}`} className={`rounded-3xl border px-5 py-5 text-center ${card}`}>
                    <p className={`text-xs font-semibold tracking-[0.25em] uppercase ${gold}/70`}>{a.bank || "Bank"}</p>
                    <p className="text-shimmer-gold mt-1 text-xl font-semibold tracking-wide tabular-nums">{a.number || "-"}</p>
                    {a.holder && <p className="mt-0.5 text-xs text-emerald-50/60">a.n. {a.holder}</p>}
                    {a.number && (
                      <div className="mt-3">
                        <CopyRekeningButton text={a.number} buttonClass="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 text-emerald-950" />
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
              className={`${gold}/70`}
            />
            <OrnateDivider lineClass="bg-amber-200/30" ornament="✦" className="mx-auto mt-3 max-w-36 text-amber-200/70" />
            <div className="mt-4 [&_input]:border-amber-200/20 [&_input]:bg-white/5 [&_select]:border-amber-200/20 [&_select]:bg-white/5 [&_textarea]:border-amber-200/20 [&_textarea]:bg-white/5">
              {rsvpSlot}
            </div>
          </div>
        </Reveal>

        <p className={`mt-10 text-center text-xs ${gold}/50`}>
          ✦ {names} ✦
        </p>
      </div>
    </div>
  );
}

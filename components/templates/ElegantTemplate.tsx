"use client";

import { useMemo, useRef, useState } from "react";
import {
  Calendar,
  Crown,
  ExternalLink,
  Gift,
  Heart,
  Images,
  MapPin,
  MessageCircleHeart,
  Navigation,
} from "lucide-react";
import {
  coupleNames,
  eventTimestamp,
  formatDateLong,
  instagramHandle,
  instagramHref,
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
import { coupleEntries, eventEntries } from "./parts";
import type { TemplateProps } from "./types";

/** Elegant Gold: mewah, latar gelap, aksen emas, font serif. */
export function ElegantTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const [opened, setOpened] = useCoverOpened(defaultOpened);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const target = useMemo(() => eventTimestamp(content), [content]);
  const countdown = useCountdown(target, opened);

  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const card =
    "border-amber-200/20 bg-stone-900/80 shadow-xl shadow-black/40 backdrop-blur-sm";

  return (
    <div className="relative min-h-full bg-stone-950 font-serif text-amber-50 antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-stone-950/95 text-amber-50"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="Undangan Pernikahan"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-amber-300 text-stone-950"
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
          <Crown className="animate-float-slow mx-auto h-6 w-6 text-amber-300" />
          <p className="mt-2 text-[11px] tracking-[0.3em] uppercase text-amber-200/70">
            Assalamu&apos;alaikum Wr. Wb.
          </p>
          {content.quote && (
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-amber-100/80 italic">
              &ldquo;{content.quote}&rdquo;
            </p>
          )}
        </div>
        </Reveal>

        <Reveal delayMs={80}>
        <div className="mt-8 text-center">
          <h2 className="text-shimmer-gold text-4xl font-semibold">{names}</h2>
          <OrnateDivider lineClass="bg-amber-300/50" ornament="❦" className="mx-auto mt-4 max-w-48 text-amber-300" />
          {coupleEntries(content).map(
            (p) =>
              (p.nick || p.parents || p.childOrder || instagramHref(p.instagram)) && (
                <div key={p.key} className={`mt-4 rounded-2xl border px-5 py-5 ${card}`}>
                  <p className="text-2xl font-semibold text-amber-100">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && (
                    <p className="mt-0.5 text-sm text-amber-100/70">{p.full}</p>
                  )}
                  {p.childOrder && (
                    <p className="mt-2 text-xs text-amber-100/60">Anak ke-{p.childOrder}</p>
                  )}
                  {p.parents && (
                    <p className="mt-1 text-xs text-amber-100/60">{p.label} {p.parents}</p>
                  )}
                  {instagramHref(p.instagram) && (
                    <a
                      href={instagramHref(p.instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-amber-100/60 underline underline-offset-2"
                    >
                      {instagramHandle(p.instagram) || "Instagram"}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )
          )}
        </div>
        </Reveal>

        <Reveal delayMs={120}>
        <div className="mt-8 text-center">
          <SectionHeading
            kicker="Menghitung Hari"
            icon={<Calendar className="h-3.5 w-3.5" />}
            className="text-amber-200/70"
          />
          {countdown && !countdown.passed ? (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[
                { v: countdown.days, l: "Hari" },
                { v: countdown.hours, l: "Jam" },
                { v: countdown.mins, l: "Menit" },
                { v: countdown.secs, l: "Detik" },
              ].map((u) => (
                <div key={u.l} className={`rounded-2xl border px-2 py-3 ${card}`}>
                  <p className="text-2xl font-semibold text-amber-100 tabular-nums">{u.v}</p>
                  <p className="text-[11px] text-amber-100/60">{u.l}</p>
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
        <div className="relative mt-8 rounded-2xl border border-amber-200/30 p-1.5">
        <SafeImg
          key={content.heroImage}
          src={content.heroImage}
          alt={title}
          fallbackLabel={title}
          className="aspect-[4/5] w-full rounded-xl border border-amber-200/20 object-cover"
        />
        </div>
        </Reveal>

        {eventEntries(content).map((e) => (
            <Reveal key={e.key}>
            <div className={`mt-4 rounded-2xl border px-5 py-6 text-center ${card}`}>
              <SectionHeading
                kicker={e.name}
                icon={<MapPin className="h-3.5 w-3.5" />}
                className="text-amber-200/70"
              />
              <OrnateDivider lineClass="bg-amber-300/30" ornament="✦" className="mx-auto mt-3 max-w-36 text-amber-300/70" />
              <p className="mt-3 text-lg">{formatDateLong(e.date)}</p>
              {e.time && <p className="text-sm text-amber-100/70">Pukul {e.time} {e.timezone}</p>}
              {e.venue && <p className="mt-2 text-sm text-amber-100/80">{e.venue}</p>}
              {e.maps && (
                <a href={e.maps} target="_blank" rel="noopener noreferrer"
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-amber-300 px-5 text-sm font-medium text-stone-950 shadow-lg shadow-amber-300/20 transition-all hover:scale-105 hover:shadow-amber-300/40">
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
              className="text-amber-200/70"
            />
            <OrnateDivider lineClass="bg-amber-300/30" ornament="✦" className="mx-auto mt-3 max-w-36 text-amber-300/70" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {content.galleryImages.map((url) => (
                <SafeImg key={url} src={url} alt="Galeri"
                  className="aspect-square w-full rounded-2xl border border-amber-200/20 object-cover transition-transform duration-500 hover:scale-[1.02]" />
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
              className="text-amber-200/70"
            />
            <OrnateDivider lineClass="bg-amber-300/30" ornament="✦" className="mx-auto mt-3 max-w-36 text-amber-300/70" />
            <div className="mt-4 grid gap-3">
              {content.accounts.map((a, i) => (
                <div key={`${a.bank}-${a.number}-${i}`} className={`rounded-2xl border px-5 py-4 text-center ${card}`}>
                  <p className="text-xs font-semibold tracking-widest uppercase text-amber-200/70">{a.bank || "Bank"}</p>
                  <p className="mt-1 text-xl font-semibold tracking-wide text-amber-100 tabular-nums">{a.number || "-"}</p>
                  {a.holder && <p className="mt-0.5 text-xs text-amber-100/60">a.n. {a.holder}</p>}
                  {a.number && (
                    <div className="mt-3">
                      <CopyRekeningButton text={a.number} buttonClass="bg-amber-300 text-stone-950" />
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
            className="text-amber-200/70"
          />
          <OrnateDivider lineClass="bg-amber-300/30" ornament="✦" className="mx-auto mt-3 max-w-36 text-amber-300/70" />
          <div className="mt-4 [&_input]:bg-stone-900 [&_select]:bg-stone-900 [&_textarea]:bg-stone-900">
            {rsvpSlot}
          </div>
        </div>
        </Reveal>

        <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-amber-100/50">
          <Heart className="h-3.5 w-3.5" /> {names}
        </p>
      </div>
    </div>
  );
}

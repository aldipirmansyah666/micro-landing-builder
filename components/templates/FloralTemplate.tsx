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
  SafeImg,
  useCountdown,
} from "./shared";
import type { TemplateProps } from "./types";

/** Floral Romance: pastel bunga, romantis, font serif italic. */
export function FloralTemplate({ title, content, guestName, rsvpSlot }: TemplateProps) {
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const target = useMemo(() => eventTimestamp(content), [content]);
  const countdown = useCountdown(target, opened);

  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const card = "border-rose-200/70 bg-white/80 backdrop-blur";

  return (
    <div className="relative min-h-full bg-gradient-to-b from-rose-50 via-pink-50 to-rose-100 font-serif text-rose-950 antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
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
        <div className="text-center">
          <Flower2 className="mx-auto h-7 w-7 text-rose-400" />
          <p className="mt-2 text-[11px] tracking-[0.3em] uppercase text-rose-400">
            Assalamu&apos;alaikum Wr. Wb.
          </p>
          {content.quote && (
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-rose-900/80 italic">
              &ldquo;{content.quote}&rdquo;
            </p>
          )}
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-4xl font-semibold text-rose-900 italic">{names}</h2>
          <p className="mt-2 text-xs text-rose-400">🌷 Bersama restu keluarga tercinta 🌷</p>
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

        <div className="mt-8 text-center">
          <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.25em] uppercase text-rose-400">
            <Calendar className="h-3.5 w-3.5" /> Counting Down To Forever
          </p>
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

        <SafeImg
          src={content.heroImage}
          alt={title}
          fallbackLabel={title}
          className="mt-8 aspect-[4/5] w-full rounded-[2.5rem] border-4 border-white object-cover shadow-xl shadow-rose-100"
        />

        {[
          { name: "Akad Nikah 💍", date: content.akadDate, time: content.akadTime, venue: content.akadVenue, maps: content.akadMapsUrl },
          { name: "Resepsi 🎉", date: content.receptionDate, time: content.receptionTime, venue: content.receptionVenue, maps: content.receptionMapsUrl },
        ]
          .filter((e) => e.date || e.time || e.venue)
          .map((e) => (
            <div key={e.name} className={`mt-4 rounded-[2rem] border px-5 py-6 text-center shadow-sm shadow-rose-100 ${card}`}>
              <p className="text-lg font-semibold text-rose-900">{e.name}</p>
              <p className="mt-2 text-sm">{formatDateLong(e.date)}</p>
              {e.time && <p className="text-sm text-rose-900/60">Pukul {e.time} WIB</p>}
              {e.venue && <p className="mt-2 text-sm text-rose-900/80">{e.venue}</p>}
              {e.maps && (
                <a href={e.maps} target="_blank" rel="noopener noreferrer"
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-rose-400 px-5 text-sm font-medium text-white transition-transform hover:scale-105">
                  <Navigation className="h-4 w-4" /> Buka Maps
                </a>
              )}
            </div>
          ))}

        {content.galleryImages.length > 0 && (
          <div className="mt-8">
            <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.25em] uppercase text-rose-400">
              <Images className="h-3.5 w-3.5" /> Our Memories
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {content.galleryImages.map((url) => (
                <SafeImg key={url} src={url} alt="Galeri"
                  className="aspect-[3/4] w-full rounded-[1.5rem] border-2 border-white object-cover shadow-md shadow-rose-100" />
              ))}
            </div>
          </div>
        )}

        {content.accounts.length > 0 && (
          <div className="mt-8">
            <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.25em] uppercase text-rose-400">
              <Gift className="h-3.5 w-3.5" /> Wedding Gift
            </p>
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
        )}

        <div className="mt-8">
          <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.25em] uppercase text-rose-400">
            <MessageCircleHeart className="h-3.5 w-3.5" /> Send Your Wishes
          </p>
          <div className="mt-4">{rsvpSlot}</div>
        </div>

        <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-rose-400">
          <MapPin className="h-3.5 w-3.5" /> {names} · With love 🌸
        </p>
      </div>
    </div>
  );
}

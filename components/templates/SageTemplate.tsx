"use client";

import { useMemo, useRef, useState } from "react";
import {
  Calendar,
  Flower2,
  Gift,
  Images,
  Leaf,
  MapPin,
  MessageCircleHeart,
  Navigation,
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
 * Sage Botanical: pastel sage + krem botani, lembut dan segar,
 * kartu kaca buram, bingkai daun, tipografi serif elegan.
 */
export function SageTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const [opened, setOpened] = useCoverOpened(defaultOpened);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const target = useMemo(() => eventTimestamp(content), [content]);
  const countdown = useCountdown(target, opened);

  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const tone = "text-[#5b6e58]";
  const card =
    "border-[#c9d6c3]/80 bg-white/70 shadow-xl shadow-[#8a9b85]/15 backdrop-blur-md";

  return (
    <div className="relative min-h-full overflow-hidden bg-gradient-to-b from-[#f2f5ee] via-[#eaf0e4] to-[#dde7d4] font-serif text-[#3d4a3a] antialiased">
      {/* Ornamen dedaunan latar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 text-[#8a9b85]/25">
        <Leaf className="animate-float-slow absolute left-4 top-24 h-10 w-10 rotate-[-20deg]" />
        <Leaf className="animate-float-slow absolute right-6 top-[42%] h-8 w-8 rotate-[30deg]" />
        <Flower2 className="absolute bottom-40 left-6 h-7 w-7 rotate-[15deg] opacity-60" />
        <Leaf className="absolute bottom-24 right-8 h-12 w-12 rotate-[-35deg] opacity-50" />
      </div>

      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#2f3d2c]/95 text-[#eef3e8]"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="🌿 Undangan Pernikahan 🌿"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#5b6e58] text-white shadow-lg shadow-black/30"
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
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#8a9b85]/40 bg-white/60 shadow-md shadow-[#8a9b85]/20 backdrop-blur">
              <Leaf className="animate-float-slow h-6 w-6 text-[#5b6e58]" />
            </div>
            <p className={`mt-3 text-[11px] tracking-[0.35em] uppercase ${tone}/70`}>
              Assalamu&apos;alaikum Wr. Wb.
            </p>
            {content.quote && (
              <p className="mx-auto mt-4 max-w-md rounded-3xl border border-[#8a9b85]/30 bg-white/60 px-5 py-4 text-sm leading-7 text-[#3d4a3a]/85 italic backdrop-blur-md">
                &ldquo;{content.quote}&rdquo;
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mt-8 text-center">
            <p className={`text-[11px] tracking-[0.3em] uppercase ${tone}/60`}>
              With love, we invite you to
            </p>
            <h2 className="mt-2 text-4xl font-semibold italic text-[#2f3d2c]">{names}</h2>
            <OrnateDivider lineClass="bg-[#8a9b85]/50" ornament="❧" className={`mx-auto mt-4 max-w-48 ${tone}`} />
            <div className="mt-5 grid gap-3">
              {[
                { nick: content.groomNickname || content.groomFullName, full: content.groomFullName, parents: content.groomParents, label: "Putra dari" },
                { nick: content.brideNickname || content.brideFullName, full: content.brideFullName, parents: content.brideParents, label: "Putri dari" },
              ].map(
                (p) =>
                  (p.nick || p.parents) && (
                    <div key={p.label} className={`rounded-[1.75rem] border px-5 py-6 ${card}`}>
                      <Flower2 className="mx-auto h-4 w-4 text-[#8a9b85]" />
                      <p className="mt-2 text-2xl font-semibold italic text-[#2f3d2c]">{p.nick || "-"}</p>
                      {p.full && p.full !== p.nick && (
                        <p className="mt-0.5 text-sm text-[#3d4a3a]/65">{p.full}</p>
                      )}
                      {p.parents && (
                        <p className="mt-2 text-xs text-[#3d4a3a]/55">{p.label} {p.parents}</p>
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
              kicker="Save Our Date"
              icon={<Calendar className="h-3.5 w-3.5" />}
              className={tone}
            />
            {countdown && !countdown.passed ? (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[
                  { v: countdown.days, l: "Hari" },
                  { v: countdown.hours, l: "Jam" },
                  { v: countdown.mins, l: "Menit" },
                  { v: countdown.secs, l: "Detik" },
                ].map((u) => (
                  <div key={u.l} className={`rounded-3xl border px-2 py-4 ${card}`}>
                    <p className="text-2xl font-semibold text-[#2f3d2c] tabular-nums">{u.v}</p>
                    <p className={`text-[11px] ${tone}/70`}>{u.l}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${card}`}>
                {target ? "Acara telah berlangsung. Terima kasih! 🌿" : "Tanggal acara menyusul"}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal>
          <div className="relative mt-8">
            <div aria-hidden className="absolute -inset-1 rounded-[2.2rem] border-2 border-[#8a9b85]/40" />
            <div aria-hidden className="absolute -inset-2.5 rounded-[2.6rem] border border-dashed border-[#8a9b85]/30" />
            <SafeImg
              key={content.heroImage}
              src={content.heroImage}
              alt={title}
              fallbackLabel={title}
              className="relative aspect-[4/5] w-full rounded-[2rem] border-4 border-white/90 object-cover shadow-xl shadow-[#8a9b85]/30"
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
              <div className={`mt-4 rounded-[1.75rem] border px-5 py-6 text-center ${card}`}>
                <SectionHeading
                  kicker={`🍃 ${e.name}`}
                  icon={<MapPin className="h-3.5 w-3.5" />}
                  className={tone}
                />
                <OrnateDivider lineClass="bg-[#8a9b85]/40" ornament="❧" className={`mx-auto mt-3 max-w-32 ${tone}/70`} />
                <p className="mt-2 text-base font-semibold text-[#2f3d2c]">{formatDateLong(e.date)}</p>
                {e.time && <p className="text-sm text-[#3d4a3a]/65">Pukul {e.time} WIB</p>}
                {e.venue && <p className="mt-2 text-sm text-[#3d4a3a]/85">{e.venue}</p>}
                {e.maps && (
                  <a href={e.maps} target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-[#5b6e58] px-5 text-sm font-medium text-white shadow-lg shadow-[#5b6e58]/30 transition-all hover:scale-105">
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
                kicker="Our Garden Memories"
                icon={<Images className="h-3.5 w-3.5" />}
                className={tone}
              />
              <OrnateDivider lineClass="bg-[#8a9b85]/40" ornament="❧" className={`mx-auto mt-3 max-w-36 ${tone}/70`} />
              <div className="mt-4 grid grid-cols-2 gap-2">
                {content.galleryImages.map((url, i) => (
                  <SafeImg key={url} src={url} alt="Galeri"
                    className={`w-full border-2 border-white/90 object-cover shadow-md shadow-[#8a9b85]/25 transition-transform duration-500 hover:scale-[1.03] ${i % 2 === 0 ? "rounded-[1.5rem_1.5rem_1.5rem_0.5rem] aspect-[3/4]" : "rounded-[1.5rem_1.5rem_0.5rem_1.5rem] aspect-[3/4]"}`} />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mt-8">
              <SectionHeading
                kicker="Tanda Kasih"
                icon={<Gift className="h-3.5 w-3.5" />}
                className={tone}
              />
              <OrnateDivider lineClass="bg-[#8a9b85]/40" ornament="❧" className={`mx-auto mt-3 max-w-32 ${tone}/70`} />
              <div className="mt-4 grid gap-3">
                {content.accounts.map((a, i) => (
                  <div key={`${a.bank}-${a.number}-${i}`} className={`rounded-[1.75rem] border px-5 py-5 text-center ${card}`}>
                    <p className={`text-xs font-semibold tracking-[0.25em] uppercase ${tone}`}>{a.bank || "Bank"}</p>
                    <p className="mt-1 text-xl font-semibold tracking-wide text-[#2f3d2c] tabular-nums">{a.number || "-"}</p>
                    {a.holder && <p className="mt-0.5 text-xs text-[#3d4a3a]/55">a.n. {a.holder}</p>}
                    {a.number && (
                      <div className="mt-3">
                        <CopyRekeningButton text={a.number} buttonClass="bg-[#5b6e58] text-white" />
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
              className={tone}
            />
            <OrnateDivider lineClass="bg-[#8a9b85]/40" ornament="❧" className={`mx-auto mt-3 max-w-32 ${tone}/70`} />
            <div className="mt-4">{rsvpSlot}</div>
          </div>
        </Reveal>

        <p className={`mt-10 flex items-center justify-center gap-1.5 text-center text-xs ${tone}/60`}>
          <Leaf className="h-3.5 w-3.5" /> {names} · Tumbuh bersama 🌿
        </p>
      </div>
    </div>
  );
}

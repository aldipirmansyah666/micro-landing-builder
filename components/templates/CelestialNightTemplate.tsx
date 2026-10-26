"use client";

import { CalendarDays, Gift, Images, MapPin, Sparkles } from "lucide-react";
import { coupleNames, formatDateLong } from "@/lib/invitation";
import {
  CoverOverlay,
  CopyRekeningButton,
  MusicToggle,
  Reveal,
  SafeImg,
  SectionHeading,
} from "./shared";
import {
  CountdownUnits,
  coupleEntries,
  eventEntries,
  StoryTimeline,
  useInvitationState,
} from "./parts";
import type { TemplateProps } from "./types";

/**
 * CELESTIAL NIGHT — Dark Mode Luxury. Midnight blue/black dengan
 * taburan bintang emas dan shimmer lembut yang misterius-elegan.
 */
export function CelestialNightTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const eventDate = content.akadDate || content.receptionDate;

  return (
    <div className="relative min-h-full overflow-hidden bg-[#060a1a] font-serif text-[#ece7d4] antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#060a1a] text-[#ece7d4]"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="The Wedding Of"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#d4af37] text-[#060a1a] shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      {/* Taburan bintang */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute top-10 left-8 h-1 w-1 rounded-full bg-[#d4af37] opacity-80" />
        <span className="absolute top-24 right-10 h-0.5 w-0.5 rounded-full bg-white opacity-70" />
        <span className="absolute top-40 left-1/4 h-1 w-1 rounded-full bg-white opacity-50" />
        <span className="absolute top-64 right-1/4 h-0.5 w-0.5 rounded-full bg-[#d4af37] opacity-90" />
        <span className="absolute top-96 left-10 h-0.5 w-0.5 rounded-full bg-white opacity-60" />
        <span className="absolute top-[32rem] right-8 h-1 w-1 rounded-full bg-[#d4af37] opacity-70" />
        <span className="absolute top-[44rem] left-1/3 h-0.5 w-0.5 rounded-full bg-white opacity-60" />
        <span className="absolute top-[56rem] right-12 h-1 w-1 rounded-full bg-white opacity-50" />
      </div>
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#1b2a5e]/60 blur-3xl" />

      <div className="relative mx-auto max-w-md px-8 py-14">
        <Reveal>
          <div className="text-center">
            <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.45em] text-[#d4af37] uppercase">
              <Sparkles className="h-3.5 w-3.5" /> The Wedding Of
            </p>
            <h2 className="mt-5 bg-gradient-to-b from-[#f7ecc8] via-[#e8cf8a] to-[#9a7b24] bg-clip-text text-5xl leading-tight font-medium text-transparent">
              {names}
            </h2>
            {eventDate && (
              <p className="mt-4 text-sm tracking-[0.25em] text-[#b9b09a] uppercase">{formatDateLong(eventDate)}</p>
            )}
            <div aria-hidden className="mx-auto mt-7 flex max-w-52 items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d4af37]" />
              <span className="text-[#d4af37]">✦</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="relative mx-auto mt-10 max-w-xs">
            <div aria-hidden className="absolute -inset-3 rounded-[2.5rem] bg-[#d4af37]/15 blur-xl" />
            <SafeImg
              key={content.heroImage}
              src={content.heroImage}
              alt={title}
              fallbackLabel={title}
              className="relative aspect-[3/4] w-full rounded-[2rem] border border-[#d4af37]/50 object-cover shadow-[0_0_40px_rgba(212,175,55,0.15)]"
            />
          </div>
        </Reveal>

        {content.quote && (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm text-center text-[15px] leading-8 text-[#c9c2ab] italic">
              &ldquo;{content.quote}&rdquo;
            </p>
          </Reveal>
        )}

        {content.greeting ? (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm text-center font-serif text-xl leading-9 text-[#e8d9a8] italic">
              {content.greeting}
            </p>
          </Reveal>
        ) : null}

        <Reveal>
          <div className="mt-12 space-y-8 text-center">
            {coupleEntries(content)
              .filter((p) => p.nick || p.parents)
              .map((p) => (
                <div key={p.key}>
                  <p className="text-xs tracking-[0.35em] text-[#d4af37] uppercase">{p.label}</p>
                  <p className="mt-2 bg-gradient-to-b from-white to-[#c9b98a] bg-clip-text text-4xl font-medium text-transparent">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && <p className="mt-1 font-sans text-sm text-[#b9b09a]">{p.full}</p>}
                  {p.parents && <p className="mt-2 font-sans text-xs text-[#8a8474]">{p.parents}</p>}
                </div>
              ))}
          </div>
        </Reveal>

        <StoryTimeline
          stories={content.stories}
          heading="Constellation of Us"
          sectionClass="mt-12 rounded-3xl border border-[#d4af37]/30 bg-white/[0.04] px-6 py-8 text-center backdrop-blur"
          headingClass="text-[11px] tracking-[0.4em] text-[#d4af37] uppercase"
          itemClass="mx-auto max-w-xs"
          marker={<span aria-hidden className="text-[#d4af37]">✦</span>}
          titleClass="mt-2 font-serif text-2xl text-[#f7ecc8]"
          textClass="mt-1 font-sans text-xs leading-6 text-[#c9c2ab]"
        />

        <Reveal>
          <div className="mt-12 rounded-3xl border border-[#d4af37]/30 bg-white/[0.04] px-6 py-8 text-center backdrop-blur">
            <SectionHeading kicker="Menghitung Hari" icon={<CalendarDays className="h-3.5 w-3.5" />} className="text-[#d4af37]" />
            <div className="mt-5 grid grid-cols-4 gap-2">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="rounded-2xl border border-[#d4af37]/30 bg-black/40 px-2 py-4"
                valueClass="text-2xl text-[#f7ecc8]"
                labelClass="mt-0.5 font-sans text-[10px] tracking-widest text-[#8a8474] uppercase"
                fallback={
                  <p className="col-span-4 font-sans text-sm text-[#8a8474]">
                    {target ? "Acara telah berlangsung. Terima kasih!" : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mt-8 rounded-3xl border border-[#d4af37]/30 bg-gradient-to-b from-white/[0.07] to-transparent px-6 py-7 text-center">
              <p className="font-sans text-[11px] tracking-[0.35em] text-[#d4af37] uppercase">{e.name}</p>
              <p className="mt-3 text-xl text-[#f7ecc8]">{formatDateLong(e.date)}</p>
              {e.time && <p className="mt-1 font-sans text-sm text-[#b9b09a]">Pukul {e.time} {e.timezone}</p>}
              {e.venue && (
                <p className="mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-[#c9c2ab]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d4af37]" />
                  {e.venue}
                </p>
              )}
              {e.maps && (
                <a href={e.maps} target="_blank" rel="noopener noreferrer"
                  className="mt-5 inline-flex h-11 items-center rounded-full bg-[#d4af37] px-6 font-sans text-sm font-semibold text-[#060a1a] shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-transform hover:scale-105">
                  Lihat Lokasi
                </a>
              )}
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mt-12">
              <SectionHeading kicker="Galeri" icon={<Images className="h-3.5 w-3.5" />} className="text-[#d4af37]" />
              <div className="mt-5 grid grid-cols-2 gap-2">
                {content.galleryImages.map((url) => (
                  <SafeImg key={url} src={url} alt="Galeri" className="aspect-[3/4] w-full rounded-2xl border border-[#d4af37]/25 object-cover" />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mt-12">
              <SectionHeading kicker="Tanda Kasih" icon={<Gift className="h-3.5 w-3.5" />} className="text-[#d4af37]" />
              <div className="mt-5 space-y-3">
                {content.accounts.map((a, i) => (
                  <div key={`${a.bank}-${a.number}-${i}`} className="rounded-3xl border border-[#d4af37]/30 bg-white/[0.05] px-5 py-5 text-center">
                    <p className="font-sans text-xs tracking-[0.25em] text-[#d4af37] uppercase">{a.bank || "Bank"}</p>
                    <p className="mt-1 font-sans text-lg font-semibold tracking-wide text-white tabular-nums">{a.number || "-"}</p>
                    {a.holder && <p className="mt-0.5 font-sans text-xs text-[#8a8474]">a.n. {a.holder}</p>}
                    {a.number && <div className="mt-3"><CopyRekeningButton text={a.number} buttonClass="bg-[#d4af37] text-[#060a1a]" /></div>}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-12 rounded-3xl border border-[#d4af37]/25 bg-white/[0.04] p-4">
            <div className="font-sans text-[#ece7d4] [&_input]:bg-white/10 [&_input]:text-white [&_textarea]:bg-white/10 [&_textarea]:text-white">{rsvpSlot}</div>
          </div>
        </Reveal>

        {content.closingNote !== undefined ? (
          content.closingNote ? (
            <p className="mt-12 text-center text-sm text-[#8a8474]">{content.closingNote}</p>
          ) : null
        ) : (
          <p className="mt-12 text-center text-sm text-[#8a8474]">Terima kasih atas doa & kehadiran Anda</p>
        )}
        <p className="mt-2 bg-gradient-to-b from-[#f7ecc8] to-[#9a7b24] bg-clip-text text-center text-xs tracking-[0.3em] text-transparent uppercase">{names}</p>
      </div>
    </div>
  );
}

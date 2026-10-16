"use client";

import { CalendarDays, Gift, Images, MapPin, Sun } from "lucide-react";
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
 * RETRO SUNSET — Warm Terracotta 90s. Sunburst arch mustard &
 * peach, kartu membulat berani, dan aksen playful yang hangat.
 */
export function RetroSunsetTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const eventDate = content.akadDate || content.receptionDate;

  return (
    <div className="relative min-h-full overflow-hidden bg-[#fbe3c8] font-sans text-[#4a2c17] antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#c96f4a] text-[#fdf3e3]"
          titleFont="font-sans"
          image={content.heroImage}
          kicker="The Wedding Of"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#2f3e33] text-[#fdf3e3] shadow-xl"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      <div className="relative mx-auto max-w-md px-6 pt-12 pb-14">
        {/* Sunburst arch di belakang judul */}
        <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2">
          <div className="flex h-72 w-72 items-center justify-center rounded-b-full bg-[#e8a94e]/40">
            <div className="flex h-56 w-56 items-center justify-center rounded-b-full bg-[#e8a94e]/50">
              <div className="h-40 w-40 rounded-b-full bg-[#c96f4a]/50" />
            </div>
          </div>
        </div>

        <Reveal>
          <div className="relative pt-16 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#2f3e33] px-4 py-1.5 text-[11px] font-bold tracking-[0.3em] text-[#fbe3c8] uppercase">
              <Sun className="h-3.5 w-3.5" /> The Wedding Of
            </p>
            <h2 className="mt-4 text-5xl leading-[1.02] font-black tracking-tight">{names}</h2>
            {eventDate && (
              <p className="mx-auto mt-4 w-fit -rotate-2 rounded-2xl bg-[#c96f4a] px-5 py-2 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg">
                {formatDateLong(eventDate)}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="relative mx-auto mt-10 max-w-xs -rotate-2 rounded-[2.5rem] border-4 border-[#2f3e33] bg-white p-2 shadow-[8px_8px_0_#2f3e33]">
            <SafeImg
              key={content.heroImage}
              src={content.heroImage}
              alt={title}
              fallbackLabel={title}
              className="aspect-[3/4] w-full rounded-[2rem] object-cover"
            />
          </div>
        </Reveal>

        {content.quote && (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm rotate-1 rounded-[2rem] bg-[#2f3e33] px-6 py-5 text-center text-[15px] leading-8 text-[#fbe3c8] italic shadow-[6px_6px_0_rgba(201,111,74,0.6)]">
              &ldquo;{content.quote}&rdquo;
            </p>
          </Reveal>
        )}

        {content.greeting ? (
          <Reveal>
            <p className="mx-auto mt-8 w-fit -rotate-1 rounded-2xl bg-[#e8a94e]/50 px-5 py-2 text-center text-sm font-bold text-[#4a2c17]">
              {content.greeting}
            </p>
          </Reveal>
        ) : null}

        <Reveal>
          <div className="mt-12 grid gap-4">
            {coupleEntries(content)
              .filter((p) => p.nick || p.parents)
              .map((p, i) => (
                <div key={p.key}
                  className={`rounded-[2rem] border-4 px-6 py-7 text-center shadow-[6px_6px_0_rgba(47,62,51,1)] ${i === 0 ? "rotate-1 border-[#c96f4a] bg-white" : "-rotate-1 border-[#2f3e33] bg-[#e8a94e]/30"}`}>
                  <p className="text-4xl font-black tracking-tight">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && <p className="mt-1 text-sm opacity-70">{p.full}</p>}
                  {p.parents && <p className="mt-2 text-xs opacity-70">{p.label} {p.parents}</p>}
                </div>
              ))}
          </div>
        </Reveal>

        <StoryTimeline
          stories={content.stories}
          heading="Cerita Kita"
          sectionClass="mt-8 text-center"
          headingClass="text-lg font-black tracking-tight text-[#4a2c17]"
          itemClass="rounded-[2rem] border-4 border-[#2f3e33] bg-white px-6 py-5 shadow-[4px_4px_0_#2f3e33]"
          marker={<span aria-hidden className="text-[#c96f4a]">☀</span>}
          titleClass="mt-1 text-xl font-black text-[#4a2c17]"
          textClass="mt-1 text-xs leading-6 text-[#4a2c17]/75"
        />

        <Reveal>
          <div className="mt-8 rounded-[2rem] bg-[#2f3e33] px-6 py-8 text-center text-[#fbe3c8] shadow-[6px_6px_0_#c96f4a]">
            <SectionHeading kicker="Menghitung Hari" icon={<CalendarDays className="h-3.5 w-3.5" />} className="text-[#e8a94e]" />
            <div className="mt-5 grid grid-cols-4 gap-2">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="rounded-2xl bg-[#fbe3c8] px-2 py-4 text-[#4a2c17]"
                valueClass="text-2xl font-black"
                labelClass="mt-0.5 text-[10px] font-bold tracking-widest uppercase opacity-60"
                fallback={
                  <p className="col-span-4 text-sm opacity-70">
                    {target ? "Acara telah berlangsung. Terima kasih!" : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mt-4 rounded-[2rem] border-4 border-[#2f3e33] bg-white px-6 py-7 text-center shadow-[6px_6px_0_#2f3e33]">
              <p className="inline-block rounded-full bg-[#e8a94e]/50 px-4 py-1 text-[11px] font-bold tracking-[0.3em] uppercase">{e.name}</p>
              <p className="mt-3 text-2xl font-black">{formatDateLong(e.date)}</p>
              {e.time && <p className="mt-1 text-sm font-bold">Pukul {e.time} WIB</p>}
              {e.venue && (
                <p className="mt-3 flex items-start justify-center gap-1.5 text-sm opacity-80">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c96f4a]" />
                  {e.venue}
                </p>
              )}
              {e.maps && (
                <a href={e.maps} target="_blank" rel="noopener noreferrer"
                  className="mt-5 inline-flex h-11 items-center rounded-full bg-[#c96f4a] px-6 text-sm font-bold text-white transition-transform hover:scale-105">
                  Lihat Lokasi
                </a>
              )}
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mt-10">
              <SectionHeading kicker="Galeri" icon={<Images className="h-3.5 w-3.5" />} className="text-[#b4552d]" />
              <div className="mt-5 grid grid-cols-2 gap-3">
                {content.galleryImages.map((url, i) => (
                  <SafeImg key={url} src={url} alt="Galeri"
                    className={`w-full border-4 border-[#2f3e33] object-cover shadow-[4px_4px_0_#2f3e33] ${i % 2 === 0 ? "aspect-square rotate-1 rounded-[2rem]" : "aspect-[3/4] -rotate-1 rounded-full"}`} />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mt-10">
              <SectionHeading kicker="Tanda Kasih" icon={<Gift className="h-3.5 w-3.5" />} className="text-[#b4552d]" />
              <div className="mt-5 space-y-3">
                {content.accounts.map((a, i) => (
                  <div key={`${a.bank}-${a.number}-${i}`} className="rounded-[2rem] border-4 border-[#2f3e33] bg-white px-5 py-5 text-center shadow-[4px_4px_0_#2f3e33]">
                    <p className="text-xs font-bold tracking-[0.25em] text-[#b4552d] uppercase">{a.bank || "Bank"}</p>
                    <p className="mt-1 text-lg font-black tracking-wide tabular-nums">{a.number || "-"}</p>
                    {a.holder && <p className="mt-0.5 text-xs opacity-60">a.n. {a.holder}</p>}
                    {a.number && <div className="mt-3"><CopyRekeningButton text={a.number} buttonClass="bg-[#2f3e33] text-white" /></div>}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-8 rounded-[2rem] border-4 border-[#2f3e33] bg-white p-4 shadow-[6px_6px_0_#2f3e33]">
            <div className="[&_input]:rounded-2xl [&_input]:bg-[#fbe3c8] [&_textarea]:rounded-2xl [&_textarea]:bg-[#fbe3c8]">{rsvpSlot}</div>
          </div>
        </Reveal>

        {content.closingNote !== undefined ? (
          content.closingNote ? (
            <p className="mt-12 text-center text-sm font-bold">{content.closingNote}</p>
          ) : null
        ) : (
          <p className="mt-12 text-center text-sm font-bold">Terima kasih atas doa & kehadiran Anda ☀</p>
        )}
        <p className="mt-2 text-center text-xs font-bold tracking-[0.3em] text-[#b4552d] uppercase">{names}</p>
      </div>
    </div>
  );
}

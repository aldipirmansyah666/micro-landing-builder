"use client";

import { CalendarDays, Gift, Images, MapPin } from "lucide-react";
import { coupleNames, formatDateLong, resolveGreeting } from "@/lib/invitation";
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
  EightPointStar,
  eventEntries,
  StoryTimeline,
  useInvitationState,
} from "./parts";
import type { TemplateProps } from "./types";

/**
 * ARABESQUE SAKRAL — Islamic Architecture & Gold Foil. Mihrab
 * melengkung, mozaik geometris emas, emerald & gold yang sakral.
 */
export function ArabesqueSakralTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const greeting = resolveGreeting(content.greeting, "Bismillahirrahmanirrahim");
  const eventDate = content.akadDate || content.receptionDate;

  return (
    <div className="relative min-h-full bg-[#0b3b36] font-serif text-[#f2ead2] antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#0b3b36] text-[#f2ead2]"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="Assalamu'alaikum Wr. Wb."
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#c9a227] text-[#0b3b36] shadow-[0_0_30px_rgba(201,162,39,0.4)]"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      {/* Pita mozaik geometris emas */}
      <div
        aria-hidden
        className="h-6 opacity-70"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, #c9a227 0 2px, transparent 2px 10px, #c9a227 10px 12px, transparent 12px 20px)" }}
      />

      <div className="mx-auto max-w-md px-8 py-12">
        <Reveal>
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 text-[#c9a227]">
              <EightPointStar className="h-8 w-8" />
              {greeting && (
                <p className="text-[11px] tracking-[0.4em] uppercase">{greeting}</p>
              )}
              <EightPointStar className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-4xl leading-snug font-medium text-[#f7f0da]">{names}</h2>
            {eventDate && (
              <p className="mt-3 text-sm tracking-[0.22em] text-[#c9a227] uppercase">{formatDateLong(eventDate)}</p>
            )}
          </div>
        </Reveal>

        {/* Foto bingkai mihrab melengkung */}
        <Reveal delayMs={80}>
          <div className="mx-auto mt-8 max-w-xs rounded-t-full border-2 border-[#c9a227] p-2 pt-2">
            <SafeImg
              key={content.heroImage}
              src={content.heroImage}
              alt={title}
              fallbackLabel={title}
              className="aspect-[3/4] w-full rounded-t-full object-cover"
            />
          </div>
        </Reveal>

        {content.quote && (
          <Reveal>
            <div className="mx-auto mt-10 max-w-sm border border-[#c9a227]/50 bg-white/[0.04] px-6 py-6 text-center">
              <EightPointStar className="mx-auto h-6 w-6 text-[#c9a227]" />
              <p className="mt-3 text-[15px] leading-8 text-[#e2d5b3] italic">&ldquo;{content.quote}&rdquo;</p>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-12 space-y-8 text-center">
            {coupleEntries(content)
              .filter((p) => p.nick || p.parents)
              .map((p) => (
                <div key={p.key} className="rounded-t-full border border-[#c9a227]/50 px-6 pt-10 pb-7">
                  <p className="text-xs tracking-[0.35em] text-[#c9a227] uppercase">{p.label}</p>
                  <p className="mt-2 text-4xl font-medium text-[#f7f0da]">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && <p className="mt-1 font-sans text-sm text-[#c9bfa5]">{p.full}</p>}
                  {p.parents && <p className="mt-2 font-sans text-xs text-[#9a917a]">{p.parents}</p>}
                </div>
              ))}
          </div>
        </Reveal>

        <StoryTimeline
          stories={content.stories}
          heading="Kisah Kami"
          sectionClass="mt-10 border border-[#c9a227]/50 bg-[#082b28] px-6 py-8 text-center"
          headingClass="text-[11px] tracking-[0.4em] text-[#c9a227] uppercase"
          itemClass="mx-auto max-w-xs rounded-t-full border border-[#c9a227]/50 px-5 pt-8 pb-6"
          marker={<span aria-hidden className="text-[#c9a227]">✦</span>}
          titleClass="mt-2 font-serif text-xl text-[#f7f0da]"
          textClass="mt-1 font-sans text-xs leading-6 text-[#c9bfa5]"
        />

        <Reveal>
          <div className="mt-10 border border-[#c9a227]/50 bg-[#082b28] px-6 py-8 text-center">
            <SectionHeading kicker="Menghitung Hari" icon={<CalendarDays className="h-3.5 w-3.5" />} className="text-[#c9a227]" />
            <div className="mt-5 grid grid-cols-4 gap-2">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="border border-[#c9a227]/50 bg-[#0b3b36] px-2 py-4"
                valueClass="text-2xl text-[#f7f0da]"
                labelClass="mt-0.5 font-sans text-[10px] tracking-widest text-[#9a917a] uppercase"
                fallback={
                  <p className="col-span-4 font-sans text-sm text-[#9a917a]">
                    {target ? "Acara telah berlangsung. Terima kasih!" : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mt-8 rounded-t-[10rem] border-2 border-[#c9a227] bg-[#f2ead2] px-6 pt-12 pb-8 text-center text-[#0b3b36]">
              <EightPointStar className="mx-auto h-7 w-7 text-[#8a7a2e]" />
              <p className="mt-2 font-sans text-[11px] tracking-[0.35em] text-[#8a7a2e] uppercase">{e.name}</p>
              <p className="mt-3 text-xl">{formatDateLong(e.date)}</p>
              {e.time && <p className="mt-1 font-sans text-sm text-[#4a5a4e]">Pukul {e.time} WIB</p>}
              {e.venue && (
                <p className="mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-[#4a5a4e]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8a7a2e]" />
                  {e.venue}
                </p>
              )}
              {e.maps && (
                <a href={e.maps} target="_blank" rel="noopener noreferrer"
                  className="mt-5 inline-flex h-11 items-center rounded-full bg-[#0b3b36] px-6 font-sans text-sm font-medium text-[#f2ead2] transition-transform hover:scale-105">
                  Lihat Lokasi
                </a>
              )}
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mt-12">
              <SectionHeading kicker="Galeri" icon={<Images className="h-3.5 w-3.5" />} className="text-[#c9a227]" />
              <div className="mt-5 grid grid-cols-2 gap-2">
                {content.galleryImages.map((url) => (
                  <SafeImg key={url} src={url} alt="Galeri" className="aspect-[3/4] w-full rounded-t-full border border-[#c9a227]/50 object-cover" />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mt-12">
              <SectionHeading kicker="Tanda Kasih" icon={<Gift className="h-3.5 w-3.5" />} className="text-[#c9a227]" />
              <div className="mt-5 space-y-3">
                {content.accounts.map((a, i) => (
                  <div key={`${a.bank}-${a.number}-${i}`} className="border border-[#c9a227]/50 bg-white/[0.05] px-5 py-5 text-center">
                    <p className="font-sans text-xs tracking-[0.25em] text-[#c9a227] uppercase">{a.bank || "Bank"}</p>
                    <p className="mt-1 font-sans text-lg font-semibold tracking-wide text-white tabular-nums">{a.number || "-"}</p>
                    {a.holder && <p className="mt-0.5 font-sans text-xs text-[#9a917a]">a.n. {a.holder}</p>}
                    {a.number && <div className="mt-3"><CopyRekeningButton text={a.number} buttonClass="bg-[#c9a227] text-[#0b3b36]" /></div>}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-12 border border-[#c9a227]/50 bg-[#082b28] p-4">
            <div className="font-sans text-[#f2ead2] [&_input]:bg-[#0b3b36] [&_input]:text-white [&_textarea]:bg-[#0b3b36] [&_textarea]:text-white">{rsvpSlot}</div>
          </div>
        </Reveal>

        <div className="mt-12 flex items-center justify-center gap-4 text-[#c9a227]">
          <EightPointStar className="h-6 w-6" />
          {content.closingNote !== undefined ? (
            content.closingNote ? (
              <p className="text-center text-sm text-[#9a917a]">{content.closingNote}</p>
            ) : null
          ) : (
            <p className="text-center text-sm text-[#9a917a]">Terima kasih atas doa & kehadiran Anda</p>
          )}
          <EightPointStar className="h-6 w-6" />
        </div>
        <p className="mt-3 text-center text-xs tracking-[0.3em] text-[#c9a227] uppercase">{names}</p>
      </div>

      <div
        aria-hidden
        className="h-6 opacity-70"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, #c9a227 0 2px, transparent 2px 10px, #c9a227 10px 12px, transparent 12px 20px)" }}
      />
    </div>
  );
}

"use client";

import { CalendarDays, Gift, Images, MapPin } from "lucide-react";
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
  KawungBand,
  StoryTimeline,
  useInvitationState,
} from "./parts";
import type { TemplateProps } from "./types";

/**
 * SURABAYA HERITAGE — Traditional Peranakan/Jawa Minimalis.
 * Navy pekat & krem gading dengan garis kawung emas tipis,
 * bingkai ganda simetris yang tenang dan berkelas.
 */
export function SurabayaHeritageTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const eventDate = content.akadDate || content.receptionDate;

  return (
    <div className="relative min-h-full bg-[#f7f1e3] font-serif text-[#1b2a4a] antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#1b2a4a] text-[#f7f1e3]"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="The Wedding Of"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#c9a227] text-[#1b2a4a] shadow-lg"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      {/* Pita kawung emas atas & bawah */}
      <div aria-hidden className="h-10 text-[#c9a227] opacity-70"><KawungBand className="h-full w-full" /></div>

      <div className="mx-auto max-w-md px-8 py-10">
        <Reveal>
          <div className="border-2 border-[#1b2a4a] p-1.5">
            <div className="border border-[#c9a227] px-6 py-10 text-center">
              <p className="text-[11px] tracking-[0.45em] text-[#8a7a2e] uppercase">The Wedding Of</p>
              <h2 className="mt-4 text-4xl leading-snug font-medium">{names}</h2>
              {eventDate && (
                <p className="mt-3 text-sm tracking-[0.2em] text-[#8a7a2e] uppercase">{formatDateLong(eventDate)}</p>
              )}
              <div aria-hidden className="mx-auto mt-6 flex max-w-48 items-center gap-2">
                <span className="h-px flex-1 bg-[#c9a227]" />
                <span className="text-xs text-[#c9a227]">◆ ◆ ◆</span>
                <span className="h-px flex-1 bg-[#c9a227]" />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <SafeImg
            key={content.heroImage}
            src={content.heroImage}
            alt={title}
            fallbackLabel={title}
            className="mx-auto mt-8 aspect-[4/5] w-full max-w-xs border-2 border-[#1b2a4a] object-cover p-1.5 shadow-lg"
          />
        </Reveal>

        {content.quote && (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm border-y border-[#c9a227] py-6 text-center text-[15px] leading-8 text-[#3d4a6a] italic">
              &ldquo;{content.quote}&rdquo;
            </p>
          </Reveal>
        )}

        {content.greeting ? (
          <Reveal>
            <p className="mx-auto mt-8 max-w-sm border-y border-[#c9a227] py-4 text-center font-serif text-lg leading-8 text-[#3d4a6a] italic">
              {content.greeting}
            </p>
          </Reveal>
        ) : null}

        <Reveal>
          <p className="mt-10 text-center text-[11px] tracking-[0.4em] text-[#8a7a2e] uppercase">Mempelai</p>
          <div className="mt-6 space-y-6">
            {coupleEntries(content)
              .filter((p) => p.nick || p.parents)
              .map((p) => (
                <div key={p.key} className="border border-[#1b2a4a]/30 bg-white/60 px-6 py-7 text-center">
                  <p className="text-3xl font-medium">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && <p className="mt-1 font-sans text-sm text-[#3d4a6a]">{p.full}</p>}
                  {p.parents && <p className="mt-2 font-sans text-xs text-[#6a7694]">{p.label} {p.parents}</p>}
                </div>
              ))}
          </div>
        </Reveal>

        <StoryTimeline
          stories={content.stories}
          heading="Kisah Kami"
          sectionClass="mt-10 border-2 border-[#1b2a4a] p-1.5 text-center"
          headingClass="mt-2 text-[11px] tracking-[0.4em] text-[#8a7a2e] uppercase"
          itemClass="mx-auto max-w-xs border border-[#c9a227] px-5 py-4"
          marker={<span aria-hidden className="text-[#c9a227]">◆</span>}
          titleClass="mt-1 font-serif text-xl text-[#1b2a4a]"
          textClass="mt-1 font-sans text-xs leading-6 text-[#3d4a6a]"
        />

        <Reveal>
          <div className="mt-10 bg-[#1b2a4a] px-6 py-8 text-center text-[#f7f1e3]">
            <SectionHeading kicker="Menghitung Hari" icon={<CalendarDays className="h-3.5 w-3.5" />} className="text-[#e6c65a]" />
            <div className="mt-5 grid grid-cols-4 gap-2">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="border border-[#c9a227]/60 px-2 py-4"
                valueClass="text-2xl text-[#f7f1e3]"
                labelClass="mt-0.5 font-sans text-[10px] tracking-widest text-[#e6c65a] uppercase"
                fallback={
                  <p className="col-span-4 font-sans text-sm opacity-70">
                    {target ? "Acara telah berlangsung. Terima kasih!" : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mt-8 border-2 border-[#1b2a4a] p-1.5">
              <div className="border border-[#c9a227] px-6 py-7 text-center">
                <p className="font-sans text-[11px] tracking-[0.35em] text-[#8a7a2e] uppercase">{e.name}</p>
                <p className="mt-3 text-xl">{formatDateLong(e.date)}</p>
                {e.time && <p className="mt-1 font-sans text-sm text-[#3d4a6a]">Pukul {e.time} WIB</p>}
                {e.venue && (
                  <p className="mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-[#3d4a6a]">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8a7a2e]" />
                    {e.venue}
                  </p>
                )}
                {e.maps && (
                  <a href={e.maps} target="_blank" rel="noopener noreferrer"
                    className="mt-5 inline-flex h-11 items-center rounded-full bg-[#1b2a4a] px-6 font-sans text-sm font-medium text-[#f7f1e3] transition-colors hover:bg-[#2a3d66]">
                    Lihat Lokasi
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mt-10">
              <SectionHeading kicker="Galeri" icon={<Images className="h-3.5 w-3.5" />} className="text-[#8a7a2e]" />
              <div className="mt-5 grid grid-cols-2 gap-2">
                {content.galleryImages.map((url) => (
                  <SafeImg key={url} src={url} alt="Galeri" className="aspect-square w-full border border-[#1b2a4a]/20 object-cover" />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mt-10">
              <SectionHeading kicker="Tanda Kasih" icon={<Gift className="h-3.5 w-3.5" />} className="text-[#8a7a2e]" />
              <div className="mt-5 space-y-3">
                {content.accounts.map((a, i) => (
                  <div key={`${a.bank}-${a.number}-${i}`} className="border border-[#1b2a4a]/30 bg-white/60 px-5 py-5 text-center">
                    <p className="font-sans text-xs tracking-[0.25em] text-[#8a7a2e] uppercase">{a.bank || "Bank"}</p>
                    <p className="mt-1 font-sans text-lg font-semibold tracking-wide tabular-nums">{a.number || "-"}</p>
                    {a.holder && <p className="mt-0.5 font-sans text-xs text-[#6a7694]">a.n. {a.holder}</p>}
                    {a.number && <div className="mt-3"><CopyRekeningButton text={a.number} buttonClass="bg-[#1b2a4a] text-white" /></div>}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-10 border border-[#1b2a4a]/20 bg-white/60 p-4">
            <div className="font-sans [&_input]:bg-white [&_textarea]:bg-white">{rsvpSlot}</div>
          </div>
        </Reveal>

        {content.closingNote !== undefined ? (
          content.closingNote ? (
            <p className="mt-10 text-center text-sm text-[#3d4a6a]">{content.closingNote}</p>
          ) : null
        ) : (
          <p className="mt-10 text-center text-sm text-[#3d4a6a]">Terima kasih atas doa & kehadiran Anda</p>
        )}
        <p className="mt-2 text-center text-xs tracking-[0.3em] text-[#8a7a2e] uppercase">{names}</p>
      </div>

      <div aria-hidden className="h-10 text-[#c9a227] opacity-70"><KawungBand className="h-full w-full" /></div>
    </div>
  );
}

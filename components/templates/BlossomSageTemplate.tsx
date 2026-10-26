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
  BotanicalSprig,
  CountdownUnits,
  coupleEntries,
  eventEntries,
  StoryTimeline,
  useInvitationState,
} from "./parts";
import type { TemplateProps } from "./types";

/**
 * BLOSSOM SAGE — Pastel Watercolor & Botanical. Sage green lembut,
 * pink pastel, kaligrafi italic, dan kartu membulat yang manis.
 */
export function BlossomSageTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const eventDate = content.akadDate || content.receptionDate;

  return (
    <div className="relative min-h-full overflow-hidden bg-[#f6f3ec] font-serif text-[#4c5a4e] antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#eef0e6] text-[#4c5a4e]"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="The Wedding Of"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#7d8b7a] text-white shadow-lg"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      {/* Blob watercolor pastel */}
      <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#e8b4b8]/30 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute top-64 -left-20 h-64 w-64 rounded-full bg-[#a8b8a0]/30 blur-2xl" />

      <div className="relative mx-auto max-w-md px-8 py-14">
        <Reveal>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <BotanicalSprig className="h-16 w-5 text-[#7d8b7a]/60" />
              <p className="text-[11px] tracking-[0.4em] text-[#9aa793] uppercase">The Wedding Of</p>
              <BotanicalSprig className="h-16 w-5 -scale-x-100 text-[#c98a94]/60" />
            </div>
            <h2 className="mt-4 text-5xl leading-tight font-medium text-[#3f4a41] italic">{names}</h2>
            {eventDate && (
              <p className="mx-auto mt-4 w-fit rounded-full bg-[#e8b4b8]/30 px-5 py-1.5 text-xs tracking-[0.2em] text-[#8a6a6e] uppercase">
                {formatDateLong(eventDate)}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="relative mx-auto mt-8 max-w-xs">
            <div aria-hidden className="absolute -inset-2 rounded-full bg-gradient-to-br from-[#a8b8a0]/40 to-[#e8b4b8]/40 blur-md" />
            <SafeImg
              key={content.heroImage}
              src={content.heroImage}
              alt={title}
              fallbackLabel={title}
              className="relative aspect-[3/4] w-full rounded-full border-4 border-white object-cover shadow-xl"
            />
          </div>
        </Reveal>

        {content.quote && (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm text-center font-serif text-xl leading-9 text-[#6a7a6c] italic">
              ❝ {content.quote} ❞
            </p>
          </Reveal>
        )}

        {/* Blossom tidak punya slot salam bawaan: baris sapaan hanya
            muncul bila pengguna mengisi kustom (data lama tak berubah). */}
        {content.greeting ? (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm text-center font-serif text-xl leading-9 text-[#6a7a6c] italic">
              {content.greeting}
            </p>
          </Reveal>
        ) : null}

        <Reveal>
          <div className="mt-12 space-y-4">
            {coupleEntries(content)
              .filter((p) => p.nick || p.parents)
              .map((p) => (
                <div key={p.key} className="rounded-[2.5rem] bg-gradient-to-br from-white to-[#f0e8e4] px-6 py-8 text-center shadow-sm">
                  <p className="font-serif text-4xl text-[#c98a94] italic">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && <p className="mt-1 font-sans text-sm text-[#6a7a6c]">{p.full}</p>}
                  {p.parents && <p className="mt-2 font-sans text-xs text-[#9aa793]">{p.label} {p.parents}</p>}
                </div>
              ))}
          </div>
        </Reveal>

        <StoryTimeline
          stories={content.stories}
          heading="Cerita Cinta Kami"
          sectionClass="mt-8 text-center"
          headingClass="font-serif text-2xl text-[#c98a94] italic"
          itemClass="mx-auto max-w-sm rounded-[2.5rem] bg-white px-6 py-6 shadow-sm"
          marker={<span aria-hidden className="text-[#c98a94]">❀</span>}
          titleClass="mt-1 font-serif text-xl text-[#3f4a41] italic"
          textClass="mt-2 font-sans text-sm leading-7 text-[#6a7a6c]"
        />

        <Reveal>
          <div className="mt-8 rounded-[2.5rem] bg-[#7d8b7a] px-6 py-8 text-center text-white">
            <SectionHeading kicker="Menghitung Hari" icon={<CalendarDays className="h-3.5 w-3.5" />} className="text-white/90" />
            <div className="mt-5 grid grid-cols-4 gap-2">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="rounded-full bg-white/20 px-2 py-4 backdrop-blur"
                valueClass="text-2xl text-white"
                labelClass="mt-0.5 font-sans text-[10px] tracking-widest uppercase opacity-80"
                fallback={
                  <p className="col-span-4 font-sans text-sm opacity-80">
                    {target ? "Acara telah berlangsung. Terima kasih!" : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mt-4 rounded-[2.5rem] bg-white px-6 py-8 text-center shadow-sm">
              <p className="font-sans text-[11px] tracking-[0.35em] text-[#c98a94] uppercase">{e.name}</p>
              <p className="mt-3 font-serif text-2xl text-[#3f4a41] italic">{formatDateLong(e.date)}</p>
              {e.time && <p className="mt-1 font-sans text-sm text-[#6a7a6c]">Pukul {e.time} {e.timezone}</p>}
              {e.venue && (
                <p className="mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-[#6a7a6c]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c98a94]" />
                  {e.venue}
                </p>
              )}
              {e.maps && (
                <a href={e.maps} target="_blank" rel="noopener noreferrer"
                  className="mt-5 inline-flex h-11 items-center rounded-full bg-[#c98a94] px-6 font-sans text-sm font-medium text-white transition-transform hover:scale-105">
                  Lihat Lokasi
                </a>
              )}
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mt-8">
              <SectionHeading kicker="Galeri" icon={<Images className="h-3.5 w-3.5" />} className="text-[#9aa793]" />
              <div className="mt-5 grid grid-cols-2 gap-3">
                {content.galleryImages.map((url) => (
                  <SafeImg key={url} src={url} alt="Galeri" className="aspect-square w-full rounded-[2rem] border-4 border-white object-cover shadow" />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mt-8">
              <SectionHeading kicker="Tanda Kasih" icon={<Gift className="h-3.5 w-3.5" />} className="text-[#9aa793]" />
              <div className="mt-5 space-y-3">
                {content.accounts.map((a, i) => (
                  <div key={`${a.bank}-${a.number}-${i}`} className="rounded-[2.5rem] bg-white px-5 py-6 text-center shadow-sm">
                    <p className="font-sans text-xs tracking-[0.25em] text-[#c98a94] uppercase">{a.bank || "Bank"}</p>
                    <p className="mt-1 font-sans text-lg font-semibold tracking-wide tabular-nums">{a.number || "-"}</p>
                    {a.holder && <p className="mt-0.5 font-sans text-xs text-[#9aa793]">a.n. {a.holder}</p>}
                    {a.number && <div className="mt-3"><CopyRekeningButton text={a.number} buttonClass="bg-[#7d8b7a] text-white" /></div>}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-8 rounded-[2.5rem] bg-white p-4 shadow-sm">
            <div className="font-sans [&_input]:rounded-full [&_input]:bg-[#f6f3ec] [&_textarea]:rounded-3xl [&_textarea]:bg-[#f6f3ec]">{rsvpSlot}</div>
          </div>
        </Reveal>

        {content.closingNote !== undefined ? (
          content.closingNote ? (
            <p className="mt-12 text-center font-serif text-lg text-[#6a7a6c] italic">
              {content.closingNote}
            </p>
          ) : null
        ) : (
          <p className="mt-12 text-center font-serif text-lg text-[#6a7a6c] italic">
            Terima kasih atas doa & kehadiran Anda
          </p>
        )}
        <p className="mt-2 text-center text-xs tracking-[0.3em] text-[#c98a94] uppercase">{names}</p>
      </div>
    </div>
  );
}

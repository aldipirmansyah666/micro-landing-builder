"use client";

import { Gift, Images, MapPin } from "lucide-react";
import { coupleNames, formatDateLong } from "@/lib/invitation";
import {
  CoverOverlay,
  CopyRekeningButton,
  MusicToggle,
  Reveal,
  SafeImg,
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
 * MINIMALIST MONO — Ultra Clean Typography. Charcoal & white,
 * hairline rules, daftar terstruktur — tanpa ornamen berlebih.
 */
export function MinimalistMonoTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const eventDate = content.akadDate || content.receptionDate;

  return (
    <div className="relative min-h-full bg-white font-sans text-[#1a1a1a] antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-white text-[#1a1a1a]"
          titleFont="font-sans"
          image={content.heroImage}
          kicker="The Wedding Of"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#1a1a1a] text-white"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      <div className="mx-auto max-w-md px-8 py-14">
        <Reveal>
          <div>
            <p className="text-[11px] tracking-[0.3em] text-[#6a6a6a] uppercase">The Wedding Of</p>
            <h2 className="mt-3 text-4xl leading-tight font-medium tracking-tight">{names}</h2>
            {eventDate && <p className="mt-3 text-sm text-[#6a6a6a]">{formatDateLong(eventDate)}</p>}
            <hr className="mt-6 border-[#e2e2e2]" />
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <SafeImg
            key={content.heroImage}
            src={content.heroImage}
            alt={title}
            fallbackLabel={title}
            className="mt-8 aspect-[4/3] w-full object-cover"
          />
        </Reveal>

        {content.quote && (
          <Reveal>
            <blockquote className="mt-8 border-l-2 border-[#1a1a1a] pl-4 text-[15px] leading-8 text-[#4a4a4a]">
              {content.quote}
            </blockquote>
          </Reveal>
        )}

        {content.greeting ? (
          <p className="mt-8 border-l-2 border-[#1a1a1a] pl-4 text-sm leading-7 text-[#4a4a4a]">
            {content.greeting}
          </p>
        ) : null}

        <Reveal>
          <div className="mt-10">
            <p className="text-[11px] tracking-[0.3em] text-[#6a6a6a] uppercase">Mempelai</p>
            <div className="mt-3 divide-y divide-[#e2e2e2] border-y border-[#e2e2e2]">
              {coupleEntries(content)
                .filter((p) => p.nick || p.parents)
                .map((p) => (
                  <div key={p.key} className="flex items-baseline justify-between gap-4 py-4">
                    <div>
                      <p className="text-xl font-medium">{p.nick || "-"}</p>
                      {p.full && p.full !== p.nick && <p className="mt-0.5 text-sm text-[#6a6a6a]">{p.full}</p>}
                    </div>
                    {p.parents && <p className="max-w-36 text-right text-xs text-[#6a6a6a]">{p.label} {p.parents}</p>}
                  </div>
                ))}
            </div>
          </div>
        </Reveal>

        <StoryTimeline
          stories={content.stories}
          heading="Cerita Kami"
          sectionClass="mt-10"
          headingClass="text-[11px] tracking-[0.3em] text-[#6a6a6a] uppercase"
          itemClass="mt-3 border-t border-[#e2e2e2] pt-4 first:mt-0 first:border-t-0 first:pt-0"
          marker={<span aria-hidden className="text-[10px] tracking-[0.3em] text-[#6a6a6a]">—</span>}
          titleClass="mt-1 text-lg font-medium"
          textClass="mt-1 text-sm leading-7 text-[#4a4a4a]"
        />

        <Reveal>
          <div className="mt-10">
            <p className="text-[11px] tracking-[0.3em] text-[#6a6a6a] uppercase">Countdown</p>
            <div className="mt-3 grid grid-cols-4 gap-px border border-[#e2e2e2] bg-[#e2e2e2]">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="bg-white px-2 py-4 text-center"
                valueClass="text-2xl font-medium tabular-nums"
                labelClass="mt-0.5 text-[10px] tracking-widest text-[#6a6a6a] uppercase"
                fallback={
                  <p className="col-span-4 bg-white px-4 py-5 text-center text-sm text-[#6a6a6a]">
                    {target ? "Acara telah berlangsung. Terima kasih!" : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mt-8 border border-[#e2e2e2]">
              <div className="flex items-baseline justify-between gap-4 border-b border-[#e2e2e2] px-5 py-3">
                <p className="text-[11px] tracking-[0.3em] text-[#6a6a6a] uppercase">{e.name}</p>
                {e.time && <p className="text-xs tabular-nums">{e.time} {e.timezone}</p>}
              </div>
              <div className="px-5 py-5">
                <p className="text-xl font-medium">{formatDateLong(e.date)}</p>
                {e.venue && (
                  <p className="mt-2 flex items-start gap-1.5 text-sm text-[#4a4a4a]">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#6a6a6a]" />
                    {e.venue}
                  </p>
                )}
                {e.maps && (
                  <a href={e.maps} target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex h-10 items-center border border-[#1a1a1a] px-5 text-sm font-medium transition-colors hover:bg-[#1a1a1a] hover:text-white">
                    Lihat Lokasi →
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mt-10">
              <p className="flex items-center gap-2 text-[11px] tracking-[0.3em] text-[#6a6a6a] uppercase">
                <Images className="h-3.5 w-3.5" /> Galeri
              </p>
              <div className="mt-3 grid grid-cols-3 gap-1">
                {content.galleryImages.map((url) => (
                  <SafeImg key={url} src={url} alt="Galeri" className="aspect-square w-full object-cover" />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mt-10">
              <p className="flex items-center gap-2 text-[11px] tracking-[0.3em] text-[#6a6a6a] uppercase">
                <Gift className="h-3.5 w-3.5" /> Amplop Digital
              </p>
              <div className="mt-3 divide-y divide-[#e2e2e2] border-y border-[#e2e2e2]">
                {content.accounts.map((a, i) => (
                  <div key={`${a.bank}-${a.number}-${i}`} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <p className="text-[11px] tracking-[0.25em] text-[#6a6a6a] uppercase">{a.bank || "Bank"}</p>
                      <p className="mt-0.5 text-lg font-medium tabular-nums">{a.number || "-"}</p>
                      {a.holder && <p className="text-xs text-[#6a6a6a]">a.n. {a.holder}</p>}
                    </div>
                    {a.number && <CopyRekeningButton text={a.number} buttonClass="border border-[#1a1a1a] text-[#1a1a1a]" />}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-10 border-t border-[#e2e2e2] pt-6">
            <div className="[&_input]:rounded-none [&_textarea]:rounded-none">{rsvpSlot}</div>
          </div>
        </Reveal>

        <p className="mt-10 border-t border-[#e2e2e2] pt-6 text-center text-sm text-[#6a6a6a]">
          {content.closingNote !== undefined
            ? content.closingNote || names
            : `Terima kasih — ${names}`}
        </p>
      </div>
    </div>
  );
}

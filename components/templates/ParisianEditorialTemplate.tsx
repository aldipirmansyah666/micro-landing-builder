"use client";

import { ArrowUpRight, Gift, MapPin } from "lucide-react";
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
 * PARISIAN EDITORIAL — Luxury Fashion Magazine. Monokrom bold,
 * grid asimetris, tipografi raksasa, dan penomoran editorial.
 */
export function ParisianEditorialTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const eventDate = content.akadDate || content.receptionDate;
  const couples = coupleEntries(content).filter((p) => p.nick || p.parents);

  return (
    <div className="relative min-h-full bg-white font-sans text-black antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-white text-black"
          titleFont="font-sans"
          image={content.heroImage}
          kicker="N° 01 — The Wedding Issue"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-black text-white"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      <div className="mx-auto max-w-md">
        {/* Masthead majalah */}
        <div className="flex items-center justify-between border-b-2 border-black px-6 py-3 text-[10px] font-bold tracking-[0.25em] uppercase">
          <span>Parisian</span>
          <span>Édition Mariage</span>
        </div>

        <div className="px-6 pt-10">
          <Reveal>
            <p className="text-[11px] font-bold tracking-[0.3em] uppercase">N° 01 — The Wedding Of</p>
            <h2 className="mt-3 text-6xl leading-[0.95] font-black tracking-tight uppercase">
              {content.groomNickname || content.groomFullName || "Groom"}
              <span className="block text-white [-webkit-text-stroke:2px_black]">&</span>
              {content.brideNickname || content.brideFullName || "Bride"}
            </h2>
            {eventDate && (
              <p className="mt-4 inline-block bg-black px-3 py-1.5 text-[11px] font-bold tracking-[0.2em] text-white uppercase">
                {formatDateLong(eventDate)}
              </p>
            )}
          </Reveal>
        </div>

        <Reveal delayMs={80}>
          <div className="mt-8 grid grid-cols-12 gap-0 border-y-2 border-black">
            <div className="col-span-7">
              <SafeImg key={content.heroImage} src={content.heroImage} alt={title} fallbackLabel={title} className="aspect-[3/4] w-full object-cover" />
            </div>
            <div className="col-span-5 flex flex-col justify-between border-l-2 border-black bg-black p-4 text-white">
              <p className="text-4xl leading-none font-black">“LOVE”</p>
              <p className="mt-4 text-[11px] leading-relaxed uppercase opacity-80">
                {content.quote || "Dua hati, satu cerita — diabadikan dalam satu edisi spesial."}
              </p>
              <p className="mt-4 text-[10px] tracking-[0.3em] uppercase opacity-60">Cover Story ↓</p>
            </div>
          </div>
        </Reveal>

        <div className="px-6 py-10">
          {content.greeting ? (
            <p className="border-l-4 border-black pl-4 text-sm font-bold uppercase italic">
              {content.greeting}
            </p>
          ) : null}
          <Reveal>
            <p className="text-[11px] font-bold tracking-[0.3em] uppercase">01 / Mempelai</p>
            <div className="mt-4 grid grid-cols-2 gap-0 border-2 border-black">
              {couples.map((p, i) => (
                <div key={p.key} className={i === 0 ? "border-r-2 border-black p-5" : "mt-10 p-5"}>
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase opacity-60">{p.label}</p>
                  <p className="mt-2 text-3xl leading-none font-black uppercase">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && <p className="mt-2 text-xs opacity-70">{p.full}</p>}
                  {p.parents && <p className="mt-2 text-[11px] opacity-60">{p.parents}</p>}
                </div>
              ))}
            </div>
          </Reveal>

          <StoryTimeline
            stories={content.stories}
            heading="Love Story"
            sectionClass="mt-10 border-2 border-black p-5"
            headingClass="text-[11px] font-bold tracking-[0.3em] uppercase"
            itemClass="mt-4 border-t-2 border-black pt-4 first:mt-0 first:border-t-0 first:pt-0"
            marker={<span aria-hidden className="text-xs font-black">—</span>}
            titleClass="mt-1 text-2xl font-black uppercase"
            textClass="mt-1 text-xs leading-6 opacity-70"
          />

          <Reveal>
            <div className="mt-10 border-2 border-black">
              <p className="border-b-2 border-black px-4 py-2 text-[11px] font-bold tracking-[0.3em] uppercase">02 / Countdown</p>
              <div className="grid grid-cols-4 divide-x-2 divide-black">
                <CountdownUnits
                  target={target}
                  opened={opened}
                  boxClass="px-2 py-4 text-center"
                  valueClass="text-3xl font-black tabular-nums"
                  labelClass="mt-0.5 text-[10px] font-bold tracking-widest uppercase opacity-60"
                  fallback={
                    <p className="col-span-4 px-4 py-6 text-center text-sm">
                      {target ? "Acara telah berlangsung. Terima kasih!" : "Tanggal acara menyusul"}
                    </p>
                  }
                />
              </div>
            </div>
          </Reveal>

          {eventEntries(content).map((e, i) => (
            <Reveal key={e.key}>
              <div className="mt-6 border-2 border-black">
                <p className="flex items-center justify-between border-b-2 border-black px-4 py-2 text-[11px] font-bold tracking-[0.3em] uppercase">
                  0{3 + i} / {e.name} <ArrowUpRight className="h-4 w-4" />
                </p>
                <div className="px-5 py-5">
                  <p className="text-2xl font-black uppercase">{formatDateLong(e.date)}</p>
                  {e.time && <p className="mt-1 text-sm font-bold">Pukul {e.time} WIB</p>}
                  {e.venue && (
                    <p className="mt-3 flex items-start gap-1.5 text-sm opacity-80">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                      {e.venue}
                    </p>
                  )}
                  {e.maps && (
                    <a href={e.maps} target="_blank" rel="noopener noreferrer"
                      className="mt-4 inline-flex h-11 items-center bg-black px-6 text-sm font-bold text-white uppercase transition-transform hover:scale-105">
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
                <p className="text-[11px] font-bold tracking-[0.3em] uppercase">Galeri Editorial</p>
                <div className="mt-4 grid grid-cols-12 gap-2">
                  {content.galleryImages.map((url, i) => (
                    <SafeImg key={url} src={url} alt="Galeri"
                      className={i % 3 === 0 ? "col-span-7 aspect-[4/3] w-full border-2 border-black object-cover" : "col-span-5 aspect-[3/4] w-full border-2 border-black object-cover"} />
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {content.accounts.length > 0 && (
            <Reveal>
              <div className="mt-10 border-2 border-black">
                <p className="flex items-center gap-2 border-b-2 border-black px-4 py-2 text-[11px] font-bold tracking-[0.3em] uppercase">
                  <Gift className="h-3.5 w-3.5" /> Amplop Digital
                </p>
                <div className="divide-y-2 divide-black">
                  {content.accounts.map((a, i) => (
                    <div key={`${a.bank}-${a.number}-${i}`} className="px-5 py-4">
                      <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">{a.bank || "Bank"}</p>
                      <p className="mt-1 text-xl font-black tabular-nums">{a.number || "-"}</p>
                      {a.holder && <p className="text-xs opacity-60">a.n. {a.holder}</p>}
                      {a.number && <div className="mt-3"><CopyRekeningButton text={a.number} buttonClass="bg-black text-white" /></div>}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          <Reveal>
            <div className="mt-10 border-2 border-black p-4">
              <div className="[&_input]:rounded-none [&_input]:border-black [&_textarea]:rounded-none [&_textarea]:border-black">{rsvpSlot}</div>
            </div>
          </Reveal>

          <p className="mt-10 border-t-2 border-black pt-6 text-center text-xs font-bold tracking-[0.25em] uppercase">
            {content.closingNote !== undefined
              ? content.closingNote || names
              : `${names} — Terima kasih`}
          </p>
          <p className="h-8" />
        </div>
      </div>
    </div>
  );
}

"use client";

import { Gift, Images, MapPin, Navigation } from "lucide-react";
import { coupleNames, formatDateLong, resolveGreeting } from "@/lib/invitation";
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
  coupleInitials,
  eventEntries,
  StoryTimeline,
  useInvitationState,
} from "./parts";
import type { TemplateProps } from "./types";

/**
 * MAHARDIKA — Luxury Classic. Deep emerald + champagne gold yang
 * tenang, bingkai klasik ganda, monogram inisial, simetris formal.
 */
export function MahardikaTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const greeting = resolveGreeting(content.greeting, "Assalamu'alaikum Wr. Wb.");

  return (
    <div className="relative min-h-full bg-[#0c2b23] font-serif text-[#f5efe0] antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#0c2b23]/95 text-[#f5efe0]"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="Undangan Pernikahan"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#c9a96a] text-[#0c2b23]"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      {/* Bingkai klasik ganda mengelilingi seluruh halaman */}
      <div aria-hidden className="pointer-events-none absolute inset-3 rounded-sm border border-[#c9a96a]/50" />
      <div aria-hidden className="pointer-events-none absolute inset-4 rounded-sm border border-[#c9a96a]/25" />

      <div className="relative px-9 py-14">
        <Reveal>
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#c9a96a]/70">
              <span className="text-xl tracking-widest text-[#e8d5a3]">
                {coupleInitials(content)}
              </span>
            </div>
            {greeting && (
              <p className="mt-5 text-[11px] tracking-[0.45em] text-[#c9a96a] uppercase">
                {greeting}
              </p>
            )}
            {content.quote && (
              <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#f5efe0]/75 italic">
                &ldquo;{content.quote}&rdquo;
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mt-8 text-center">
            <h2 className="text-4xl leading-tight font-semibold text-[#f2e7c9]">
              {names}
            </h2>
            <div aria-hidden className="mx-auto mt-6 max-w-64">
              <div className="h-px bg-[#c9a96a]/60" />
              <p className="py-2 text-[10px] tracking-[0.5em] text-[#c9a96a]">◆ ◆ ◆</p>
              <div className="h-px bg-[#c9a96a]/60" />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <SafeImg
            key={content.heroImage}
            src={content.heroImage}
            alt={title}
            fallbackLabel={title}
            className="mx-auto mt-8 aspect-[4/5] w-full border-2 border-[#c9a96a]/60 bg-[#123b31] object-cover p-1.5"
          />
        </Reveal>

        <Reveal>
          <div className="mt-10 space-y-0 border-y border-[#c9a96a]/40">
            {coupleEntries(content)
              .filter((p) => p.nick || p.parents)
              .map((p, i) => (
                <div
                  key={p.key}
                  className={`py-6 text-center ${i > 0 ? "border-t border-[#c9a96a]/25" : ""}`}
                >
                  <p className="text-2xl font-semibold text-[#f2e7c9]">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && (
                    <p className="mt-1 font-sans text-sm text-[#f5efe0]/65">{p.full}</p>
                  )}
                  {p.parents && (
                    <p className="mt-2 font-sans text-xs tracking-wide text-[#f5efe0]/55">
                      {p.label} {p.parents}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </Reveal>

        <StoryTimeline
          stories={content.stories}
          heading="Kisah Kami"
          sectionClass="mt-10 border-y border-[#c9a96a]/40 py-8 text-center"
          headingClass="text-[11px] tracking-[0.4em] text-[#c9a96a] uppercase"
          itemClass="mx-auto max-w-xs"
          marker={<span aria-hidden className="text-[10px] tracking-[0.5em] text-[#c9a96a]">◆ ◆ ◆</span>}
          titleClass="mt-2 text-xl font-semibold text-[#f2e7c9]"
          textClass="mt-2 font-sans text-sm leading-7 text-[#f5efe0]/70"
        />

        <Reveal>
          <div className="mt-10 text-center">
            <p className="text-[11px] tracking-[0.4em] text-[#c9a96a] uppercase">
              Menuju Hari Bahagia
            </p>
            <div className="mx-auto mt-5 grid max-w-xs grid-cols-4 gap-px border border-[#c9a96a]/50 bg-[#c9a96a]/50">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="bg-[#0c2b23] px-2 py-4"
                valueClass="text-2xl text-[#f2e7c9]"
                labelClass="mt-0.5 font-sans text-[10px] tracking-widest text-[#f5efe0]/55 uppercase"
                fallback={
                  <p className="col-span-4 bg-[#0c2b23] px-2 py-4 font-sans text-sm text-[#f5efe0]/70">
                    {target ? "Acara telah berlangsung. Terima kasih." : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mt-8 border border-[#c9a96a]/50 px-6 py-7 text-center">
              <p className="text-[11px] tracking-[0.4em] text-[#c9a96a] uppercase">
                {e.name}
              </p>
              <p className="mt-3 text-xl text-[#f2e7c9]">{formatDateLong(e.date)}</p>
              {e.time && (
                <p className="mt-1 font-sans text-sm text-[#f5efe0]/70">Pukul {e.time} {e.timezone}</p>
              )}
              {e.venue && (
                <p className="mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-[#f5efe0]/80">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a96a]" />
                  {e.venue}
                </p>
              )}
              {e.maps && (
                <a
                  href={e.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex h-11 items-center gap-2 bg-[#c9a96a] px-6 font-sans text-sm font-semibold text-[#0c2b23] transition-opacity hover:opacity-90"
                >
                  <Navigation className="h-4 w-4" /> Petunjuk Arah
                </a>
              )}
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mt-10 text-center">
              <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.4em] text-[#c9a96a] uppercase">
                <Images className="h-3.5 w-3.5" /> Galeri
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {content.galleryImages.map((url) => (
                  <SafeImg
                    key={url}
                    src={url}
                    alt="Galeri"
                    className="aspect-square w-full border border-[#c9a96a]/40 object-cover"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mt-10 text-center">
              <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.4em] text-[#c9a96a] uppercase">
                <Gift className="h-3.5 w-3.5" /> Amplop Digital
              </p>
              <div className="mt-5 space-y-3">
                {content.accounts.map((a, i) => (
                  <div
                    key={`${a.bank}-${a.number}-${i}`}
                    className="border border-[#c9a96a]/50 px-5 py-5"
                  >
                    <p className="font-sans text-xs tracking-[0.3em] text-[#c9a96a] uppercase">
                      {a.bank || "Bank"}
                    </p>
                    <p className="mt-1 font-sans text-xl font-semibold tracking-wider text-[#f2e7c9] tabular-nums">
                      {a.number || "-"}
                    </p>
                    {a.holder && (
                      <p className="mt-0.5 font-sans text-xs text-[#f5efe0]/55">a.n. {a.holder}</p>
                    )}
                    {a.number && (
                      <div className="mt-3">
                        <CopyRekeningButton text={a.number} buttonClass="bg-[#c9a96a] text-[#0c2b23]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-10 border-t border-[#c9a96a]/40 pt-6 [&_input]:border-[#c9a96a]/30 [&_input]:bg-white/5 [&_textarea]:border-[#c9a96a]/30 [&_textarea]:bg-white/5">
            {rsvpSlot}
          </div>
        </Reveal>

        <div aria-hidden className="mx-auto mt-10 max-w-64">
          <div className="h-px bg-[#c9a96a]/60" />
          <p className="py-2 text-center text-[10px] tracking-[0.5em] text-[#c9a96a]">◆ ◆ ◆</p>
          <div className="h-px bg-[#c9a96a]/60" />
        </div>
        <p className="mt-4 text-center font-sans text-xs text-[#f5efe0]/60">
          {content.closingNote !== undefined
            ? content.closingNote || names
            : `${names} — Terima kasih`}
        </p>
      </div>
    </div>
  );
}

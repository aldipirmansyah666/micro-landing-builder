"use client";

import { Gift, Images, MapPin } from "lucide-react";
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
  KawungBand,
  coupleEntries,
  eventEntries,
  StoryTimeline,
  useInvitationState,
} from "./parts";
import type { TemplateProps } from "./types";

/**
 * PUSPANINGRAT — Traditional Modern Jawa. Krem hangat, cokelat sogan,
 * emas redup, pita motif kawung orisinal yang diterapkan secukupnya.
 */
export function PuspaningratTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const greeting = resolveGreeting(content.greeting, "Sugeng Rawuh · Assalamu'alaikum Wr. Wb.");

  return (
    <div className="relative min-h-full bg-[#f6efe2] font-serif text-[#4a3826] antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#3a2c1c]/95 text-[#f6efe2]"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="ꦲꦸꦊꦩꦤ꧀ · Undangan Pernikahan"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#8a5a2b] text-[#fbf6ea]"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      {/* Pita kawung atas */}
      <div aria-hidden className="h-16 overflow-hidden text-[#8a5a2b]/30">
        <KawungBand className="h-full w-full" />
      </div>

      <div className="px-6 pt-4 pb-10">
        <Reveal>
          <div className="text-center">
            {greeting && (
              <p className="text-[11px] tracking-[0.4em] text-[#8a5a2b] uppercase">
                {greeting}
              </p>
            )}
            {content.quote && (
              <p className="mx-auto mt-4 max-w-sm rounded-xl border border-[#8a5a2b]/30 bg-[#fffdf6] px-5 py-4 text-sm leading-7 text-[#5c4a33] italic">
                &ldquo;{content.quote}&rdquo;
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mt-8 text-center">
            <h2 className="text-4xl leading-tight font-semibold text-[#3a2c1c]">{names}</h2>
            <div aria-hidden className="mx-auto mt-5 flex max-w-52 items-center gap-2 text-[#b08d3e]">
              <span className="h-px flex-1 bg-[#b08d3e]/60" />
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10" cy="10" r="6" />
                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              </svg>
              <span className="h-px flex-1 bg-[#b08d3e]/60" />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="relative mx-auto mt-8 max-w-xs">
            <div aria-hidden className="absolute -inset-2 rounded-2xl border-2 border-[#8a5a2b]/50" />
            <div aria-hidden className="absolute -inset-3.5 rounded-2xl border border-[#b08d3e]/40" />
            <SafeImg
              key={content.heroImage}
              src={content.heroImage}
              alt={title}
              fallbackLabel={title}
              className="relative aspect-[3/4] w-full rounded-xl object-cover"
            />
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-10 max-w-sm rounded-2xl border-y-2 border-[#8a5a2b]/40 bg-[#fffdf6]/70 px-6 py-2">
            {coupleEntries(content)
              .filter((p) => p.nick || p.parents)
              .map((p, i) => (
                <div
                  key={p.key}
                  className={`py-5 text-center ${i > 0 ? "border-t border-dashed border-[#8a5a2b]/30" : ""}`}
                >
                  <p className="text-2xl font-semibold text-[#3a2c1c]">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && (
                    <p className="mt-1 font-sans text-sm text-[#5c4a33]">{p.full}</p>
                  )}
                  {p.parents && (
                    <p className="mt-1.5 font-sans text-xs text-[#7a6549]">
                      {p.label} {p.parents}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </Reveal>

        <StoryTimeline
          stories={content.stories}
          heading="Kisah Katresnan"
          sectionClass="mt-8 border-y border-[#8a5a2b]/30 bg-[#fffdf6]/60 py-8 text-center"
          headingClass="font-sans text-[11px] tracking-[0.35em] text-[#8a5a2b] uppercase"
          itemClass="mx-auto max-w-sm"
          marker={<span aria-hidden className="text-[#8a5a2b]">❖</span>}
          titleClass="mt-2 font-serif text-2xl text-[#4a3a26]"
          textClass="mx-auto mt-2 max-w-sm font-sans text-sm leading-7 text-[#5c4a33]/80"
        />

        <Reveal>
          <div className="mt-8 text-center">
            <p className="font-sans text-[11px] tracking-[0.35em] text-[#8a5a2b] uppercase">
              Dinten Bahagia
            </p>
            <div className="mx-auto mt-4 grid max-w-xs grid-cols-4 gap-2">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="rounded-xl bg-[#3a2c1c] px-2 py-3.5 text-[#f6efe2]"
                valueClass="text-2xl"
                labelClass="mt-0.5 font-sans text-[10px] tracking-widest uppercase opacity-70"
                fallback={
                  <p className="col-span-4 rounded-xl border border-[#8a5a2b]/30 px-2 py-3 font-sans text-sm">
                    {target ? "Acara sampun kalampahan. Matur nuwun." : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-[#8a5a2b]/35 bg-[#fffdf6] px-6 py-6 text-center shadow-md shadow-[#8a5a2b]/10">
              <p className="font-sans text-[11px] tracking-[0.35em] text-[#8a5a2b] uppercase">
                {e.name}
              </p>
              <div aria-hidden className="mx-auto mt-3 h-px w-16 bg-[#b08d3e]/60" />
              <p className="mt-3 text-lg text-[#3a2c1c]">{formatDateLong(e.date)}</p>
              {e.time && <p className="mt-1 font-sans text-sm">Pukul {e.time} {e.timezone}</p>}
              {e.venue && (
                <p className="mt-2 flex items-start justify-center gap-1.5 font-sans text-sm text-[#5c4a33]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8a5a2b]" />
                  {e.venue}
                </p>
              )}
              {e.maps && (
                <a
                  href={e.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-11 items-center rounded-full bg-[#8a5a2b] px-6 font-sans text-sm font-medium text-[#fbf6ea] transition-transform hover:scale-105"
                >
                  Buka Peta
                </a>
              )}
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mx-auto mt-10 max-w-sm">
              <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#8a5a2b] uppercase">
                <Images className="h-3.5 w-3.5" /> Galeri
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {content.galleryImages.map((url) => (
                  <SafeImg
                    key={url}
                    src={url}
                    alt="Galeri"
                    className="aspect-[3/4] w-full rounded-xl border-2 border-[#fffdf6] object-cover shadow"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mx-auto mt-10 max-w-sm">
              <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#8a5a2b] uppercase">
                <Gift className="h-3.5 w-3.5" /> Tanda Kasih
              </p>
              <div className="mt-4 space-y-3">
                {content.accounts.map((a, i) => (
                  <div
                    key={`${a.bank}-${a.number}-${i}`}
                    className="rounded-2xl border border-[#8a5a2b]/35 bg-[#fffdf6] px-5 py-4 text-center"
                  >
                    <p className="font-sans text-xs tracking-[0.25em] text-[#8a5a2b] uppercase">
                      {a.bank || "Bank"}
                    </p>
                    <p className="mt-1 font-sans text-lg font-semibold tabular-nums">{a.number || "-"}</p>
                    {a.holder && <p className="mt-0.5 font-sans text-xs text-[#7a6549]">a.n. {a.holder}</p>}
                    {a.number && (
                      <div className="mt-3">
                        <CopyRekeningButton text={a.number} buttonClass="bg-[#8a5a2b] text-[#fbf6ea]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mx-auto mt-10 max-w-sm font-sans [&_input]:bg-[#fffdf6] [&_textarea]:bg-[#fffdf6]">
            {rsvpSlot}
          </div>
        </Reveal>

        {content.closingNote !== undefined ? (
          content.closingNote ? (
            <p className="mt-10 text-center text-sm text-[#5c4a33]">{content.closingNote}</p>
          ) : null
        ) : (
          <p className="mt-10 text-center text-sm text-[#5c4a33]">Matur nuwun sanget 🙏</p>
        )}
      </div>

      {/* Pita kawung bawah */}
      <div aria-hidden className="h-16 overflow-hidden text-[#8a5a2b]/30">
        <KawungBand className="h-full w-full" />
      </div>
    </div>
  );
}

"use client";

import { Gift, Images, MapPin, Sparkles } from "lucide-react";
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
 * KALA — Modern Playful. Terracotta, krem, peach, teal redup;
 * bentuk geometris ceria, sudut membulat besar, tetap profesional.
 */
export function KalaTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);

  return (
    <div className="relative min-h-full overflow-hidden bg-[#faf3e8] font-sans text-[#4a3226] antialiased">
      {/* Bentuk geometris ceria */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-float-slow absolute -top-10 -right-10 h-44 w-44 rounded-full bg-[#f2c9a8]/60" />
        <div className="absolute top-64 -left-14 h-40 w-40 rounded-[2.5rem] rotate-12 bg-[#9dbfb4]/40" />
        <div className="absolute right-6 bottom-96 h-16 w-16 rounded-full bg-[#c96f4a]/25" />
      </div>

      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#4a3226]/95 text-[#faf3e8]"
          titleFont="font-sans"
          image={content.heroImage}
          kicker="🎉 Undangan Pernikahan 🎉"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#c96f4a] text-white shadow-xl"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      <div className="relative px-5 py-10">
        <Reveal>
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c96f4a]/15 px-4 py-1.5 text-xs font-bold text-[#c96f4a]">
              <Sparkles className="h-3.5 w-3.5" /> Kami Menikah!
            </span>
            <h2 className="mx-auto mt-4 max-w-xs text-4xl leading-tight font-extrabold tracking-tight text-[#3d2a1e]">
              {names}
            </h2>
            {content.quote && (
              <p className="mx-auto mt-4 max-w-xs rounded-3xl rounded-bl-lg bg-white px-5 py-4 text-sm leading-7 shadow-md shadow-[#c96f4a]/10">
                &ldquo;{content.quote}&rdquo;
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="relative mx-auto mt-8 max-w-xs">
            <div aria-hidden className="absolute -inset-2 rotate-2 rounded-[2.5rem] bg-[#c96f4a]" />
            <div aria-hidden className="absolute -inset-2 -rotate-1 rounded-[2.5rem] bg-[#3f6b63]" />
            <SafeImg
              key={content.heroImage}
              src={content.heroImage}
              alt={title}
              fallbackLabel={title}
              className="relative aspect-[4/5] w-full rounded-[2rem] border-4 border-white object-cover shadow-xl"
            />
            <span className="absolute -top-3 -right-2 rotate-12 rounded-full bg-[#3f6b63] px-3 py-1.5 text-[11px] font-bold text-white shadow-lg">
              Save the Date ✓
            </span>
          </div>
        </Reveal>

        {content.greeting ? (
          <Reveal>
            <p className="mx-auto mt-6 w-fit -rotate-2 rounded-full bg-[#3f6b63] px-5 py-2 text-center text-xs font-bold text-white shadow-md">
              {content.greeting}
            </p>
          </Reveal>
        ) : null}

        <Reveal>
          <div className="mx-auto mt-8 grid max-w-xs gap-3">
            {coupleEntries(content)
              .filter((p) => p.nick || p.parents)
              .map((p, i) => (
                <div
                  key={p.key}
                  className={`rounded-[1.75rem] px-6 py-5 text-center shadow-md ${
                    i === 0
                      ? "rotate-1 bg-[#c96f4a] text-white shadow-[#c96f4a]/30"
                      : "-rotate-1 bg-white shadow-[#c96f4a]/10"
                  }`}
                >
                  <p className="text-2xl font-extrabold">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && (
                    <p className={`mt-0.5 text-sm ${i === 0 ? "text-white/80" : "text-[#4a3226]/70"}`}>
                      {p.full}
                    </p>
                  )}
                  {p.parents && (
                    <p className={`mt-1.5 text-xs ${i === 0 ? "text-white/75" : "text-[#4a3226]/60"}`}>
                      {p.label} {p.parents}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </Reveal>

        <StoryTimeline
          stories={content.stories}
          heading="Cerita Seru Kami"
          sectionClass="mx-auto mt-8 max-w-xs text-center"
          headingClass="text-sm font-black tracking-tight text-[#3d2a1e]"
          itemClass="rounded-[1.75rem] bg-[#f7e8d5] px-5 py-4 shadow-sm"
          marker={<span aria-hidden className="text-[#c96f4a]">●</span>}
          titleClass="mt-1 text-lg font-black text-[#3d2a1e]"
          textClass="mt-1 text-xs leading-6 text-[#3d2a1e]/75"
        />

        <Reveal>
          <div className="mx-auto mt-8 max-w-xs rounded-[1.75rem] bg-[#3f6b63] px-5 py-6 text-center text-white shadow-lg shadow-[#3f6b63]/30">
            <p className="text-xs font-bold tracking-[0.3em] uppercase opacity-80">
              Hitung Mundur
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="rounded-2xl bg-white/15 px-2 py-3 backdrop-blur"
                valueClass="text-2xl font-extrabold"
                labelClass="text-[10px] font-bold tracking-wider uppercase opacity-75"
                fallback={
                  <p className="col-span-4 rounded-2xl bg-white/15 px-2 py-3 text-sm">
                    {target ? "Acara telah berlangsung. Terima kasih! 🎉" : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mx-auto mt-4 max-w-xs rounded-[1.75rem] border-2 border-dashed border-[#c96f4a]/50 bg-white px-6 py-6 text-center shadow-md shadow-[#c96f4a]/10">
              <p className="text-sm font-extrabold tracking-wide text-[#c96f4a] uppercase">
                {e.name}
              </p>
              <p className="mt-2 font-bold text-[#3d2a1e]">{formatDateLong(e.date)}</p>
              {e.time && <p className="text-sm opacity-70">Pukul {e.time} {e.timezone}</p>}
              {e.venue && (
                <p className="mt-2 flex items-start justify-center gap-1.5 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c96f4a]" />
                  {e.venue}
                </p>
              )}
              {e.maps && (
                <a
                  href={e.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-11 items-center rounded-full bg-[#3d2a1e] px-6 text-sm font-bold text-white transition-transform hover:scale-105"
                >
                  Buka Maps →
                </a>
              )}
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mx-auto mt-8 max-w-xs">
              <p className="flex items-center justify-center gap-2 text-xs font-extrabold tracking-[0.25em] text-[#c96f4a] uppercase">
                <Images className="h-4 w-4" /> Galeri Seru
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {content.galleryImages.map((url, i) => (
                  <SafeImg
                    key={url}
                    src={url}
                    alt="Galeri"
                    className={`aspect-square w-full border-4 border-white object-cover shadow-md transition-transform duration-500 hover:scale-[1.04] hover:-rotate-1 ${
                      i % 2 === 0 ? "rounded-[1.5rem] rotate-1" : "rounded-[1.5rem] -rotate-1"
                    }`}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mx-auto mt-8 max-w-xs">
              <p className="flex items-center justify-center gap-2 text-xs font-extrabold tracking-[0.25em] text-[#c96f4a] uppercase">
                <Gift className="h-4 w-4" /> Amplop Digital
              </p>
              <div className="mt-4 space-y-3">
                {content.accounts.map((a, i) => (
                  <div
                    key={`${a.bank}-${a.number}-${i}`}
                    className="rounded-[1.75rem] bg-white px-5 py-5 text-center shadow-md"
                  >
                    <p className="text-xs font-extrabold tracking-[0.2em] text-[#3f6b63] uppercase">
                      {a.bank || "Bank"}
                    </p>
                    <p className="mt-1 text-xl font-extrabold tabular-nums">{a.number || "-"}</p>
                    {a.holder && <p className="mt-0.5 text-xs opacity-60">a.n. {a.holder}</p>}
                    {a.number && (
                      <div className="mt-3">
                        <CopyRekeningButton text={a.number} buttonClass="bg-[#c96f4a] text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mx-auto mt-8 max-w-xs">{rsvpSlot}</div>
        </Reveal>

        <p className="mt-10 text-center text-xs font-bold text-[#c96f4a]">
          {content.closingNote !== undefined
            ? content.closingNote || names
            : `${names} · Sampai jumpa! 🎉`}
        </p>
      </div>
    </div>
  );
}

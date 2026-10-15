"use client";

import { ArrowUpRight, Gift } from "lucide-react";
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
  useInvitationState,
} from "./parts";
import type { TemplateProps } from "./types";

/**
 * ÉLAN — Modern Editorial. Monokrom tegas, tipografi raksasa,
 * penomoran editorial, grid asimetris. Foto pengguna ditampilkan
 * apa adanya tanpa filter yang mengubah karakternya.
 */
export function ElanTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const couples = coupleEntries(content).filter((p) => p.nick || p.parents);
  const events = eventEntries(content, "01 — Akad", "02 — Resepsi");

  return (
    <div className="relative min-h-full bg-[#fafafa] font-sans text-[#111111] antialiased dark:bg-[#111111] dark:text-[#fafafa]">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#111111]/95 text-[#fafafa]"
          titleFont="font-sans"
          image={content.heroImage}
          kicker="You are invited — N°01"
          names={names}
          guest={guest}
          note="Please excuse any misspelling of names & titles"
          buttonClass="bg-[#fafafa] text-[#111111]"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      <div className="px-6 pt-10 pb-14">
        {/* Masthead editorial */}
        <Reveal>
          <div className="flex items-baseline justify-between border-b-2 border-current pb-3">
            <p className="text-[11px] font-bold tracking-[0.3em] uppercase">Élan</p>
            <p className="text-[11px] tracking-[0.3em] text-current/60 uppercase">
              Wedding Edition
            </p>
          </div>
          <h2 className="mt-5 text-[2.9rem] leading-[0.95] font-black tracking-tight uppercase">
            {names}
          </h2>
          <p className="mt-3 text-xs tracking-[0.25em] text-current/60 uppercase">
            {content.akadDate ? formatDateLong(content.akadDate) : "Save the date"}
          </p>
        </Reveal>

        {/* Split asimetris: foto dominan + kolom teks */}
        <Reveal delayMs={80}>
          <div className="mt-8 grid grid-cols-12 gap-3">
            <div className="col-span-8">
              <SafeImg
                key={content.heroImage}
                src={content.heroImage}
                alt={title}
                fallbackLabel={title}
                className="aspect-[3/4] w-full bg-[#e4e4e4] object-cover dark:bg-[#222222]"
              />
            </div>
            <div className="col-span-4 flex flex-col justify-between border-l border-current/20 pl-3">
              <p className="text-[10px] leading-5 font-bold tracking-[0.2em] uppercase">
                The
                <br />
                Wedding
                <br />
                Of
              </p>
              {content.quote && (
                <p className="line-clamp-6 text-[11px] leading-5 text-current/70 italic">
                  &ldquo;{content.quote}&rdquo;
                </p>
              )}
              <p className="text-[10px] tracking-[0.2em] text-current/50 uppercase">
                Fig. 01
              </p>
            </div>
          </div>
        </Reveal>

        {/* Mempelai bernomor editorial */}
        {couples.map((p, i) => (
          <Reveal key={p.key}>
            <div className="mt-8 border-t border-current/20 pt-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-5xl font-black text-current/15 tabular-nums">
                  0{i + 1}
                </p>
                <div className="flex-1 text-right">
                  <p className="text-2xl font-extrabold tracking-tight uppercase">
                    {p.nick || "-"}
                  </p>
                  {p.full && p.full !== p.nick && (
                    <p className="mt-0.5 text-xs text-current/60">{p.full}</p>
                  )}
                  {p.parents && (
                    <p className="mt-1.5 text-xs text-current/60">
                      {p.label} {p.parents}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}

        {/* Countdown tabular tegas */}
        <Reveal>
          <div className="mt-8 bg-[#111111] px-5 py-6 text-[#fafafa] dark:bg-[#fafafa] dark:text-[#111111]">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase opacity-60">
              Countdown
            </p>
            <div className="mt-3 flex items-baseline gap-5">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass=""
                valueClass="text-4xl font-black"
                labelClass="text-[10px] tracking-[0.2em] uppercase opacity-60"
                labels={{ days: "Days", hours: "Hrs", mins: "Min", secs: "Sec" }}
                fallback={
                  <p className="text-sm opacity-70">
                    {target ? "This event has passed. Thank you!" : "Date to be announced"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {events.map((e) => (
          <Reveal key={e.key}>
            <div className="mt-8 border-t-2 border-current pt-4">
              <p className="text-[11px] font-bold tracking-[0.3em] uppercase">{e.name}</p>
              <p className="mt-2 text-xl font-extrabold tracking-tight">
                {formatDateLong(e.date)}
              </p>
              {e.time && <p className="text-sm text-current/60">{e.time} WIB</p>}
              {e.venue && <p className="mt-2 text-sm text-current/75">{e.venue}</p>}
              {e.maps && (
                <a
                  href={e.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex h-11 items-center gap-1 text-sm font-bold underline underline-offset-4"
                >
                  Open in Maps <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mt-10">
              <div className="flex items-baseline justify-between border-b border-current/20 pb-2">
                <p className="text-[11px] font-bold tracking-[0.3em] uppercase">Selected Frames</p>
                <p className="text-[11px] text-current/50">({content.galleryImages.length})</p>
              </div>
              {/* Grid asimetris: foto pertama membentang */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {content.galleryImages.map((url, i) => (
                  <SafeImg
                    key={url}
                    src={url}
                    alt={`Galeri ${i + 1}`}
                    className={`w-full bg-[#e4e4e4] object-cover dark:bg-[#222222] ${
                      i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
                    }`}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mt-10">
              <p className="flex items-center gap-2 border-b border-current/20 pb-2 text-[11px] font-bold tracking-[0.3em] uppercase">
                <Gift className="h-3.5 w-3.5" /> Digital Envelope
              </p>
              <div className="mt-3 space-y-2">
                {content.accounts.map((a, i) => (
                  <div
                    key={`${a.bank}-${a.number}-${i}`}
                    className="flex items-center justify-between gap-3 border border-current/20 px-4 py-3"
                  >
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.25em] text-current/50 uppercase">
                        {a.bank || "Bank"}
                      </p>
                      <p className="font-bold tabular-nums">{a.number || "-"}</p>
                      {a.holder && <p className="text-xs text-current/60">a.n. {a.holder}</p>}
                    </div>
                    {a.number && (
                      <CopyRekeningButton
                        text={a.number}
                        buttonClass="bg-[#111111] text-white dark:bg-[#fafafa] dark:text-[#111111]"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-10 border-t-2 border-current pt-4">
            <p className="text-[11px] font-bold tracking-[0.3em] uppercase">Wishes & RSVP</p>
            <div className="mt-3">{rsvpSlot}</div>
          </div>
        </Reveal>

        <p className="mt-10 text-[10px] tracking-[0.3em] text-current/50 uppercase">
          Élan © 2026 — {names}
        </p>
      </div>
    </div>
  );
}

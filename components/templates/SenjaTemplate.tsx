"use client";

import { Gift, Images, MapPin, Mountain } from "lucide-react";
import { coupleNames, formatDateLong, resolveGreeting } from "@/lib/invitation";
import {
  CoverOverlay,
  CopyRekeningButton,
  MusicToggle,
  Reveal,
  SafeImg,
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
 * SENJA — Nature & Rustic. Olive, beige hangat, cokelat earthy;
 * hero foto alam full-bleed; editorial lapang. Tetap anggun
 * walau pengguna tidak punya foto landscape profesional.
 */
export function SenjaTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const greeting = resolveGreeting(content.greeting, "Assalamu'alaikum Wr. Wb.");

  return (
    <div className="relative min-h-full bg-[#efe7d3] font-serif text-[#3f3a2c] antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#2c3324]/95 text-[#efe7d3]"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="Undangan Pernikahan"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#e8dcc3] text-[#2c3324]"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      {/* Hero alam full-bleed */}
      <div className="relative">
        <SafeImg
          key={content.heroImage}
          src={content.heroImage}
          alt={title}
          fallbackLabel={title}
          className="aspect-[4/5] w-full bg-gradient-to-b from-[#4a5d3a] to-[#2c3324] object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-[#efe7d3]"
        />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-6 text-center">
          <Reveal>
            <p className="text-[11px] tracking-[0.4em] text-[#efe7d3]/90 uppercase drop-shadow">
              The Wedding Of
            </p>
            <h2 className="mt-2 text-4xl leading-tight font-semibold text-white drop-shadow-lg">
              {names}
            </h2>
          </Reveal>
        </div>
      </div>

      <div className="px-6 py-10">
        <Reveal>
          <div className="relative mx-auto max-w-sm text-center">
            <BotanicalSprig className="absolute -left-1 -top-2 h-24 w-7 text-[#4a5d3a]/40" />
            <BotanicalSprig className="absolute -right-1 -top-2 h-24 w-7 -scale-x-100 text-[#4a5d3a]/40" />
            {greeting && (
              <p className="text-[11px] tracking-[0.35em] text-[#6b5b3e] uppercase">
                {greeting}
              </p>
            )}
            {content.quote && (
              <p className="mx-auto mt-4 text-[15px] leading-8 text-[#3f3a2c]/85 italic">
                &ldquo;{content.quote}&rdquo;
              </p>
            )}
            <div aria-hidden className="mx-auto mt-5 flex max-w-44 items-center gap-2 text-[#6b5b3e]">
              <Mountain className="h-4 w-4 shrink-0" />
              <span className="h-px flex-1 bg-[#6b5b3e]/50" />
              <Mountain className="h-4 w-4 shrink-0" />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-8 grid max-w-sm gap-4 sm:grid-cols-2">
            {coupleEntries(content)
              .filter((p) => p.nick || p.parents)
              .map((p) => (
                <div
                  key={p.key}
                  className="rounded-2xl border border-[#6b5b3e]/25 bg-[#f7f1e1] px-5 py-6 text-center shadow-md shadow-[#6b4f35]/10"
                >
                  <p className="text-2xl font-semibold text-[#2c3324]">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && (
                    <p className="mt-1 font-sans text-sm text-[#3f3a2c]/70">{p.full}</p>
                  )}
                  {p.parents && (
                    <p className="mt-2 font-sans text-xs text-[#3f3a2c]/60">
                      {p.label} {p.parents}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </Reveal>

        <StoryTimeline
          stories={content.stories}
          heading="Jejak Cerita"
          sectionClass="mx-auto mt-10 max-w-sm rounded-2xl bg-[#e8dcc3]/60 px-5 py-6 text-center"
          headingClass="font-sans text-[11px] tracking-[0.35em] text-[#6b5b3e] uppercase"
          itemClass="mx-auto max-w-xs"
          marker={<span aria-hidden className="text-[#6b5b3e]">❦</span>}
          titleClass="mt-1 font-serif text-xl text-[#3f3a2c]"
          textClass="mt-1 font-sans text-xs leading-6 text-[#3f3a2c]/75"
        />

        <Reveal>
          <div className="mx-auto mt-10 max-w-sm rounded-2xl bg-[#2c3324] px-5 py-6 text-center text-[#efe7d3]">
            <p className="font-sans text-[11px] tracking-[0.35em] uppercase opacity-70">
              Menuju Hari Bahagia
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="rounded-xl border border-[#e8dcc3]/25 px-2 py-3"
                valueClass="text-2xl"
                labelClass="mt-0.5 font-sans text-[10px] tracking-widest uppercase opacity-60"
                fallback={
                  <p className="col-span-4 rounded-xl border border-[#e8dcc3]/25 px-2 py-3 font-sans text-sm">
                    {target ? "Acara telah berlangsung. Terima kasih!" : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mx-auto mt-6 max-w-sm overflow-hidden rounded-2xl border border-[#6b5b3e]/25 bg-[#f7f1e1] shadow-md shadow-[#6b4f35]/10">
              <div className="bg-[#4a5d3a] px-6 py-3 text-center">
                <p className="font-sans text-[11px] font-bold tracking-[0.35em] text-[#efe7d3] uppercase">
                  {e.name}
                </p>
              </div>
              <div className="px-6 py-6 text-center">
                <p className="text-lg text-[#2c3324]">{formatDateLong(e.date)}</p>
                {e.time && <p className="mt-1 font-sans text-sm">Pukul {e.time} {e.timezone}</p>}
                {e.venue && (
                  <p className="mt-2 flex items-start justify-center gap-1.5 font-sans text-sm text-[#3f3a2c]/80">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#4a5d3a]" />
                    {e.venue}
                  </p>
                )}
                {e.maps && (
                  <a
                    href={e.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex h-11 items-center rounded-full bg-[#4a5d3a] px-6 font-sans text-sm font-semibold text-white transition-transform hover:scale-105"
                  >
                    Lihat Rute
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mx-auto mt-10 max-w-sm">
              <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#4a5d3a] uppercase">
                <Images className="h-3.5 w-3.5" /> Jejak Langkah
              </p>
              {/* Susunan editorial: satu lebar + dua sejajar */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {content.galleryImages.map((url, i) => (
                  <SafeImg
                    key={url}
                    src={url}
                    alt={`Galeri ${i + 1}`}
                    className={`w-full rounded-xl object-cover shadow ${
                      i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"
                    }`}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mx-auto mt-10 max-w-sm">
              <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#4a5d3a] uppercase">
                <Gift className="h-3.5 w-3.5" /> Tanda Kasih
              </p>
              <div className="mt-4 space-y-3">
                {content.accounts.map((a, i) => (
                  <div
                    key={`${a.bank}-${a.number}-${i}`}
                    className="rounded-2xl border border-[#6b5b3e]/25 bg-[#f7f1e1] px-5 py-4 text-center"
                  >
                    <p className="font-sans text-xs tracking-[0.25em] text-[#6b5b3e] uppercase">
                      {a.bank || "Bank"}
                    </p>
                    <p className="mt-1 font-sans text-lg font-bold tabular-nums">{a.number || "-"}</p>
                    {a.holder && <p className="mt-0.5 font-sans text-xs opacity-60">a.n. {a.holder}</p>}
                    {a.number && (
                      <div className="mt-3">
                        <CopyRekeningButton text={a.number} buttonClass="bg-[#4a5d3a] text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mx-auto mt-10 max-w-sm font-sans">{rsvpSlot}</div>
        </Reveal>

        <div aria-hidden className="mx-auto mt-10 flex max-w-44 items-center gap-2 text-[#6b5b3e]">
          <span className="h-px flex-1 bg-[#6b5b3e]/50" />
          <BotanicalSprig className="h-10 w-4" />
          <span className="h-px flex-1 bg-[#6b5b3e]/50" />
        </div>
        <p className="mt-3 text-center font-sans text-xs text-[#3f3a2c]/70">
          {content.closingNote !== undefined
            ? content.closingNote || names
            : `${names} · Sampai jumpa di hari bahagia`}
        </p>
      </div>
    </div>
  );
}

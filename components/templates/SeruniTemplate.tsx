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
  BotanicalSprig,
  CountdownUnits,
  coupleEntries,
  eventEntries,
  StoryTimeline,
  useInvitationState,
} from "./parts";
import type { TemplateProps } from "./types";

/**
 * SERUNI — Romantic Floral. Blush, dusty rose, sage; bunga
 * watercolor ringan di tepi; bingkai organik; fokus pada nama.
 */
export function SeruniTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const greeting = resolveGreeting(content.greeting, "Assalamu'alaikum Wr. Wb.");

  return (
    <div className="relative min-h-full overflow-hidden bg-[#fdf6f7] font-serif text-[#6b4a52] antialiased">
      {/* Semburat watercolor */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#f5d3d8]/60 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-[#dfe7d5]/70 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#f7e3c8]/60 blur-3xl" />
      </div>

      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#5c3f47]/95 text-[#fdf6f7]"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="🌸 Undangan Pernikahan 🌸"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#e8b4bc] text-[#5c3f47]"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      <div className="relative px-6 py-12">
        <Reveal>
          <div className="relative text-center">
            <BotanicalSprig className="absolute top-0 left-0 h-32 w-9 text-[#8a9b85]/60" />
            <BotanicalSprig className="absolute top-0 right-0 h-32 w-9 -scale-x-100 text-[#c98a94]/60" />
            {greeting && (
              <p className="text-[11px] tracking-[0.4em] text-[#c98a94] uppercase">
                {greeting}
              </p>
            )}
            {content.quote && (
              <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-[#6b4a52]/80 italic">
                &ldquo;{content.quote}&rdquo;
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mt-6 text-center">
            <h2 className="text-[2.6rem] leading-tight font-semibold text-[#5c3f47] italic">
              {names}
            </h2>
            <p className="mt-2 text-xs tracking-[0.25em] text-[#a08a90] uppercase">
              — dua hati, satu cerita —
            </p>
          </div>
        </Reveal>

        <Reveal>
          {/* Bingkai organik: lengkung atas, sudut membulat bawah */}
          <div className="relative mx-auto mt-8 max-w-[19rem]">
            <div aria-hidden className="absolute -inset-2 rounded-t-[9rem] rounded-b-[2.5rem] bg-gradient-to-b from-[#e8b4bc]/50 to-[#8a9b85]/30 blur-[2px]" />
            <SafeImg
              key={content.heroImage}
              src={content.heroImage}
              alt={title}
              fallbackLabel={title}
              className="relative aspect-[3/4] w-full rounded-t-[8rem] rounded-b-[2rem] border-4 border-white object-cover shadow-xl shadow-[#e8b4bc]/40"
            />
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-10 max-w-xs space-y-4">
            {coupleEntries(content)
              .filter((p) => p.nick || p.parents)
              .map((p) => (
                <div
                  key={p.key}
                  className="rounded-[2rem] border border-white bg-white/70 px-6 py-6 text-center shadow-lg shadow-[#e8b4bc]/30 backdrop-blur"
                >
                  <p className="text-2xl font-semibold text-[#5c3f47] italic">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && (
                    <p className="mt-1 font-sans text-sm text-[#6b4a52]/70">{p.full}</p>
                  )}
                  {p.parents && (
                    <p className="mt-2 font-sans text-xs text-[#a08a90]">
                      {p.label} {p.parents}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </Reveal>

        <StoryTimeline
          stories={content.stories}
          heading="Cerita Cinta Kami"
          sectionClass="mx-auto mt-10 max-w-xs text-center"
          headingClass="font-serif text-2xl text-[#c98a94] italic"
          itemClass="rounded-[2rem] bg-white px-6 py-5 shadow-sm"
          marker={<span aria-hidden className="text-[#c98a94]">❀</span>}
          titleClass="mt-1 font-serif text-lg text-[#6b4a52] italic"
          textClass="mt-1 font-sans text-xs leading-6 text-[#6b4a52]/75"
        />

        <Reveal>
          <div className="mx-auto mt-10 max-w-xs text-center">
            <p className="font-sans text-[11px] tracking-[0.35em] text-[#c98a94] uppercase">
              Counting down to forever
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="rounded-full border border-white bg-white/70 px-2 py-4 shadow-md shadow-[#e8b4bc]/30 backdrop-blur"
                valueClass="text-2xl text-[#5c3f47]"
                labelClass="font-sans text-[10px] tracking-wider text-[#a08a90] uppercase"
                fallback={
                  <p className="col-span-4 rounded-2xl bg-white/70 px-2 py-3 font-sans text-sm">
                    {target ? "Acara telah berlangsung. Terima kasih! 💐" : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mx-auto mt-6 max-w-xs rounded-[2rem] border border-white bg-white/70 px-6 py-7 text-center shadow-lg shadow-[#e8b4bc]/30 backdrop-blur">
              <p className="font-sans text-[11px] tracking-[0.35em] text-[#c98a94] uppercase">
                {e.name}
              </p>
              <p className="mt-3 text-lg text-[#5c3f47]">{formatDateLong(e.date)}</p>
              {e.time && <p className="mt-1 font-sans text-sm opacity-70">Pukul {e.time} {e.timezone}</p>}
              {e.venue && (
                <p className="mt-2 flex items-start justify-center gap-1.5 font-sans text-sm opacity-80">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c98a94]" />
                  {e.venue}
                </p>
              )}
              {e.maps && (
                <a
                  href={e.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-11 items-center rounded-full bg-[#c98a94] px-6 font-sans text-sm font-medium text-white shadow-md transition-transform hover:scale-105"
                >
                  Lihat Lokasi
                </a>
              )}
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mx-auto mt-10 max-w-xs">
              <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#c98a94] uppercase">
                <Images className="h-3.5 w-3.5" /> Momen Bahagia
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {content.galleryImages.map((url, i) => (
                  <SafeImg
                    key={url}
                    src={url}
                    alt="Galeri"
                    className={`aspect-[3/4] w-full border-2 border-white object-cover shadow-md ${
                      i % 2 === 0
                        ? "rounded-tl-[1.5rem] rounded-tr-[1.5rem] rounded-br-[1.5rem] rounded-bl-[0.5rem]"
                        : "rounded-tl-[1.5rem] rounded-tr-[1.5rem] rounded-br-[0.5rem] rounded-bl-[1.5rem]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mx-auto mt-10 max-w-xs">
              <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#c98a94] uppercase">
                <Gift className="h-3.5 w-3.5" /> Wedding Gift
              </p>
              <div className="mt-4 space-y-3">
                {content.accounts.map((a, i) => (
                  <div
                    key={`${a.bank}-${a.number}-${i}`}
                    className="rounded-[2rem] border border-white bg-white/70 px-5 py-5 text-center shadow-md backdrop-blur"
                  >
                    <p className="font-sans text-xs tracking-[0.25em] text-[#c98a94] uppercase">
                      {a.bank || "Bank"}
                    </p>
                    <p className="mt-1 font-sans text-lg font-semibold tabular-nums">{a.number || "-"}</p>
                    {a.holder && <p className="mt-0.5 font-sans text-xs opacity-60">a.n. {a.holder}</p>}
                    {a.number && (
                      <div className="mt-3">
                        <CopyRekeningButton text={a.number} buttonClass="bg-[#c98a94] text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mx-auto mt-10 max-w-xs font-sans">{rsvpSlot}</div>
        </Reveal>

        <p className="mt-10 text-center text-xs text-[#a08a90]">
          {content.closingNote !== undefined
            ? content.closingNote || names
            : `${names} · with love 🌸`}
        </p>
      </div>
    </div>
  );
}

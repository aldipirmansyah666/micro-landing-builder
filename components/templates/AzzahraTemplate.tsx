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
  EightPointStar,
  coupleEntries,
  eventEntries,
  StoryTimeline,
  useInvitationState,
} from "./parts";
import type { TemplateProps } from "./types";

/**
 * AZZAHRA — Islamic Elegant. Teal pekat + ivory + emas redup,
 * pola geometris arabesque, bingkai lengkung ala mihrab.
 * Salam/doa memakai data quote pengguna apa adanya.
 */
export function AzzahraTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);

  return (
    <div className="relative min-h-full bg-[#0f3a3d] font-serif text-[#f4efe3] antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#0f3a3d]/95 text-[#f4efe3]"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="✦ Undangan Pernikahan ✦"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#c2a164] text-[#0f3a3d]"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      {/* Pita pola geometris */}
      <div
        aria-hidden
        className="h-10 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #c2a164 0 1px, transparent 1px 12px), repeating-linear-gradient(-45deg, #c2a164 0 1px, transparent 1px 12px)",
          backgroundSize: "12px 12px",
        }}
      />

      <div className="px-6 py-10">
        <Reveal>
          <div className="text-center">
            <EightPointStar className="mx-auto h-10 w-10 text-[#c2a164]" />
            <p className="mt-3 text-[11px] tracking-[0.4em] text-[#c2a164] uppercase">
              Bismillahirrahmanirrahim
            </p>
            {content.quote && (
              <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#f4efe3]/80 italic">
                &ldquo;{content.quote}&rdquo;
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mt-8 text-center">
            <h2 className="text-4xl leading-tight font-semibold">{names}</h2>
            <div aria-hidden className="mt-5 flex items-center justify-center gap-3 text-[#c2a164]">
              <span className="h-px w-16 bg-[#c2a164]/60" />
              <EightPointStar className="h-4 w-4" />
              <span className="h-px w-16 bg-[#c2a164]/60" />
            </div>
          </div>
        </Reveal>

        <Reveal>
          {/* Bingkai lengkung mihrab */}
          <div className="relative mx-auto mt-8 max-w-xs">
            <div aria-hidden className="absolute -inset-2 rounded-t-[9rem] rounded-b-2xl border-2 border-[#c2a164]/60" />
            <SafeImg
              key={content.heroImage}
              src={content.heroImage}
              alt={title}
              fallbackLabel={title}
              className="relative aspect-[3/4] w-full rounded-t-[8rem] rounded-b-xl border border-[#c2a164]/40 object-cover"
            />
          </div>
        </Reveal>

        {content.greeting ? (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm text-center font-serif text-xl leading-9 text-[#e8dcc3]/90 italic">
              {content.greeting}
            </p>
          </Reveal>
        ) : null}

        <Reveal>
          <div className="mx-auto mt-10 max-w-sm space-y-6">
            {coupleEntries(content)
              .filter((p) => p.nick || p.parents)
              .map((p) => (
                <div
                  key={p.key}
                  className="rounded-t-[4rem] rounded-b-2xl border border-[#c2a164]/40 bg-white/[0.05] px-6 py-6 text-center backdrop-blur-sm"
                >
                  <p className="text-2xl font-semibold">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && (
                    <p className="mt-1 font-sans text-sm text-[#f4efe3]/65">{p.full}</p>
                  )}
                  {p.parents && (
                    <p className="mt-2 font-sans text-xs text-[#f4efe3]/55">
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
          sectionClass="mx-auto mt-10 max-w-sm border border-[#c2a164]/40 bg-white/[0.04] px-6 py-8 text-center"
          headingClass="text-[11px] tracking-[0.4em] text-[#c2a164] uppercase"
          itemClass="mx-auto max-w-xs"
          marker={<span aria-hidden className="text-[#c2a164]">✦</span>}
          titleClass="mt-2 font-serif text-2xl text-[#f4efe3]"
          textClass="mt-2 font-sans text-sm leading-7 text-[#e8dcc3]/75"
        />

        <Reveal>
          <div className="mx-auto mt-10 max-w-sm text-center">
            <p className="text-[11px] tracking-[0.4em] text-[#c2a164] uppercase">
              Menuju Hari Penuh Berkah
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="rounded-t-full rounded-b-xl border border-[#c2a164]/40 bg-white/[0.05] px-2 pt-5 pb-3"
                valueClass="text-2xl"
                labelClass="mt-0.5 font-sans text-[10px] tracking-widest uppercase opacity-60"
                fallback={
                  <p className="col-span-4 rounded-xl border border-[#c2a164]/40 px-2 py-3 font-sans text-sm">
                    {target ? "Acara telah berlangsung. Barakallahu laka." : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mx-auto mt-6 max-w-sm rounded-t-[3rem] rounded-b-2xl border border-[#c2a164]/40 bg-white/[0.05] px-6 py-7 text-center backdrop-blur-sm">
              <EightPointStar className="mx-auto h-5 w-5 text-[#c2a164]" />
              <p className="mt-2 text-[11px] tracking-[0.4em] text-[#c2a164] uppercase">
                {e.name}
              </p>
              <p className="mt-3 text-lg">{formatDateLong(e.date)}</p>
              {e.time && <p className="mt-1 font-sans text-sm opacity-75">Pukul {e.time} {e.timezone}</p>}
              {e.venue && (
                <p className="mt-2 flex items-start justify-center gap-1.5 font-sans text-sm opacity-85">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c2a164]" />
                  {e.venue}
                </p>
              )}
              {e.maps && (
                <a
                  href={e.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-11 items-center rounded-full bg-[#c2a164] px-6 font-sans text-sm font-semibold text-[#0f3a3d] transition-transform hover:scale-105"
                >
                  Lihat Lokasi
                </a>
              )}
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mx-auto mt-10 max-w-sm">
              <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.4em] text-[#c2a164] uppercase">
                <Images className="h-3.5 w-3.5" /> Galeri
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {content.galleryImages.map((url) => (
                  <SafeImg
                    key={url}
                    src={url}
                    alt="Galeri"
                    className="aspect-square w-full rounded-t-full rounded-b-xl border border-[#c2a164]/40 object-cover"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mx-auto mt-10 max-w-sm">
              <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.4em] text-[#c2a164] uppercase">
                <Gift className="h-3.5 w-3.5" /> Hadiah
              </p>
              <div className="mt-4 space-y-3">
                {content.accounts.map((a, i) => (
                  <div
                    key={`${a.bank}-${a.number}-${i}`}
                    className="rounded-2xl border border-[#c2a164]/40 bg-white/[0.05] px-5 py-4 text-center"
                  >
                    <p className="font-sans text-xs tracking-[0.3em] text-[#c2a164] uppercase">
                      {a.bank || "Bank"}
                    </p>
                    <p className="mt-1 font-sans text-lg font-semibold tabular-nums">{a.number || "-"}</p>
                    {a.holder && <p className="mt-0.5 font-sans text-xs opacity-60">a.n. {a.holder}</p>}
                    {a.number && (
                      <div className="mt-3">
                        <CopyRekeningButton text={a.number} buttonClass="bg-[#c2a164] text-[#0f3a3d]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mx-auto mt-10 max-w-sm font-sans [&_input]:bg-white/5 [&_textarea]:bg-white/5">
            {rsvpSlot}
          </div>
        </Reveal>

        <div aria-hidden className="mt-10 flex items-center justify-center gap-3 text-[#c2a164]">
          <span className="h-px w-16 bg-[#c2a164]/60" />
          <EightPointStar className="h-4 w-4" />
          <span className="h-px w-16 bg-[#c2a164]/60" />
        </div>
        {content.closingNote !== undefined ? (
          content.closingNote ? (
            <p className="mt-4 text-center font-sans text-xs opacity-70">
              {content.closingNote}
            </p>
          ) : null
        ) : (
          <p className="mt-4 text-center font-sans text-xs opacity-70">
            Jazakumullah khairan atas doa Anda
          </p>
        )}
      </div>

      <div
        aria-hidden
        className="h-10 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #c2a164 0 1px, transparent 1px 12px), repeating-linear-gradient(-45deg, #c2a164 0 1px, transparent 1px 12px)",
          backgroundSize: "12px 12px",
        }}
      />
    </div>
  );
}

"use client";

import { CalendarDays, Gift, Images, MapPin } from "lucide-react";
import { coupleNames, formatDateLong } from "@/lib/invitation";
import {
  CoverOverlay,
  CopyRekeningButton,
  MusicToggle,
  OrnateDivider,
  Reveal,
  SafeImg,
  SectionHeading,
} from "./shared";
import {
  BotanicalSprig,
  CountdownUnits,
  coupleEntries,
  eventEntries,
  useInvitationState,
} from "./parts";
import type { TemplateProps } from "./types";

/**
 * RUSTIC TERRA — Boho & Warm Earthy. Terracotta hangat, krem linen,
 * foto arch ganda, pita botanical, dan divider anyaman boho.
 */
export function RusticTerraTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const eventDate = content.akadDate || content.receptionDate;

  return (
    <div className="relative min-h-full bg-[#f5ede0] font-serif text-[#4a3a2c] antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#f5ede0] text-[#4a3a2c]"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="The Wedding Of"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#b4552d] text-[#fdf8ef] shadow-lg"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      {/* Tekstur linen via garis halus */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(180,85,45,0.05) 6px)" }}
      />

      <div className="relative mx-auto max-w-md px-8 py-14">
        <Reveal>
          <div className="relative text-center">
            <BotanicalSprig className="absolute -left-1 top-0 h-32 w-9 text-[#b4552d]/40" />
            <BotanicalSprig className="absolute -right-1 top-0 h-32 w-9 -scale-x-100 text-[#b4552d]/40" />
            <p className="text-[11px] tracking-[0.35em] text-[#b4552d] uppercase">The Wedding Of</p>
            <h2 className="mt-4 text-4xl leading-snug font-medium text-[#3a2d20]">{names}</h2>
            {eventDate && (
              <p className="mt-3 text-sm tracking-[0.18em] text-[#8a6a4a] uppercase">{formatDateLong(eventDate)}</p>
            )}
            <OrnateDivider ornament="❧" className="mx-auto mt-6 max-w-56 text-[#b4552d]" lineClass="bg-[#b4552d]/50" />
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <SafeImg
            key={content.heroImage}
            src={content.heroImage}
            alt={title}
            fallbackLabel={title}
            className="mx-auto mt-8 aspect-[3/4] w-full max-w-xs rounded-t-[12rem] rounded-b-[2rem] border-4 border-[#e0cda8] object-cover shadow-xl shadow-[#b4552d]/20"
          />
        </Reveal>

        {content.quote && (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm rounded-3xl bg-[#efe2cb] px-6 py-5 text-center text-[15px] leading-8 text-[#5c4a36] italic">
              &ldquo;{content.quote}&rdquo;
            </p>
          </Reveal>
        )}

        <Reveal>
          <p className="mt-12 text-center text-[11px] tracking-[0.35em] text-[#b4552d] uppercase">Mempelai Berbahagia</p>
          <div className="mt-6 space-y-6">
            {coupleEntries(content)
              .filter((p) => p.nick || p.parents)
              .map((p) => (
                <div key={p.key} className="rounded-[2rem] border border-dashed border-[#b4552d]/40 bg-[#fdf8ef] px-6 py-7 text-center shadow-sm">
                  <p className="text-3xl font-medium text-[#3a2d20]">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && <p className="mt-1 font-sans text-sm text-[#6a563e]">{p.full}</p>}
                  {p.parents && <p className="mt-2 font-sans text-xs text-[#8a6a4a]">{p.label} {p.parents}</p>}
                </div>
              ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12 text-center">
            <SectionHeading kicker="Menghitung Hari" icon={<CalendarDays className="h-3.5 w-3.5" />} className="text-[#b4552d]" />
            <div className="mt-5 grid grid-cols-4 gap-2">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="rounded-2xl bg-[#3a2d20] px-2 py-4 text-[#f5ede0]"
                valueClass="text-2xl"
                labelClass="mt-0.5 font-sans text-[10px] tracking-widest uppercase opacity-70"
                fallback={
                  <p className="col-span-4 font-sans text-sm text-[#8a6a4a]">
                    {target ? "Acara telah berlangsung. Terima kasih!" : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mt-8 rounded-[2rem] bg-[#3a2d20] px-6 py-7 text-center text-[#f5ede0] shadow-lg">
              <p className="font-sans text-[11px] tracking-[0.35em] text-[#e0a878] uppercase">{e.name}</p>
              <p className="mt-3 text-xl">{formatDateLong(e.date)}</p>
              {e.time && <p className="mt-1 font-sans text-sm opacity-80">Pukul {e.time} WIB</p>}
              {e.venue && (
                <p className="mt-3 flex items-start justify-center gap-1.5 font-sans text-sm opacity-85">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e0a878]" />
                  {e.venue}
                </p>
              )}
              {e.maps && (
                <a href={e.maps} target="_blank" rel="noopener noreferrer"
                  className="mt-5 inline-flex h-11 items-center rounded-full bg-[#b4552d] px-6 font-sans text-sm font-medium text-white transition-transform hover:scale-105">
                  Lihat Lokasi
                </a>
              )}
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mt-12">
              <SectionHeading kicker="Galeri Momen" icon={<Images className="h-3.5 w-3.5" />} className="text-[#b4552d]" />
              <div className="mt-5 grid grid-cols-2 gap-3">
                {content.galleryImages.map((url, i) => (
                  <SafeImg key={url} src={url} alt="Galeri"
                    className={`w-full object-cover ${i % 2 === 0 ? "aspect-[3/4] rounded-t-full rounded-b-2xl" : "aspect-square rounded-2xl"}`} />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mt-12">
              <SectionHeading kicker="Tanda Kasih" icon={<Gift className="h-3.5 w-3.5" />} className="text-[#b4552d]" />
              <div className="mt-5 space-y-3">
                {content.accounts.map((a, i) => (
                  <div key={`${a.bank}-${a.number}-${i}`} className="rounded-[2rem] border border-[#e0cda8] bg-[#fdf8ef] px-5 py-5 text-center">
                    <p className="font-sans text-xs tracking-[0.25em] text-[#b4552d] uppercase">{a.bank || "Bank"}</p>
                    <p className="mt-1 font-sans text-lg font-semibold tracking-wide tabular-nums">{a.number || "-"}</p>
                    {a.holder && <p className="mt-0.5 font-sans text-xs text-[#8a6a4a]">a.n. {a.holder}</p>}
                    {a.number && <div className="mt-3"><CopyRekeningButton text={a.number} buttonClass="bg-[#b4552d] text-white" /></div>}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-12 rounded-[2rem] border border-dashed border-[#b4552d]/40 bg-[#fdf8ef] p-4">
            <div className="font-sans [&_input]:bg-white [&_textarea]:bg-white">{rsvpSlot}</div>
          </div>
        </Reveal>

        <p className="mt-12 text-center text-sm text-[#6a563e]">Terima kasih atas doa & kehadiran Anda</p>
        <p className="mt-2 text-center text-xs tracking-[0.3em] text-[#b4552d] uppercase">{names}</p>
      </div>
    </div>
  );
}

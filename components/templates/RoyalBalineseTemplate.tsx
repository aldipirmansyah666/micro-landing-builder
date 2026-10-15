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
  CountdownUnits,
  coupleEntries,
  eventEntries,
  KawungBand,
  useInvitationState,
} from "./parts";
import type { TemplateProps } from "./types";

/**
 * ROYAL BALINESE — Traditional Ethnic Bali. Marun pekat & perunggu
 * dengan pita ukiran emas, bingkai ganda, dan simetri agung.
 */
export function RoyalBalineseTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const eventDate = content.akadDate || content.receptionDate;

  return (
    <div className="relative min-h-full bg-[#2b0f0f] font-serif text-[#f0dfb8] antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#2b0f0f] text-[#f0dfb8]"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="Om Swastiastu"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#c9973f] text-[#2b0f0f] shadow-[0_0_30px_rgba(201,151,63,0.4)]"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      <div aria-hidden className="h-8 text-[#c9973f] opacity-80"><KawungBand className="h-full w-full" /></div>

      <div className="mx-auto max-w-md px-8 py-10">
        <Reveal>
          <div className="text-center">
            <p className="text-[11px] tracking-[0.45em] text-[#c9973f] uppercase">Om Swastiastu</p>
            <OrnateDivider ornament="❖" className="mx-auto mt-4 max-w-48 text-[#c9973f]" lineClass="bg-[#c9973f]/60" />
            <h2 className="mt-5 text-4xl leading-snug font-medium">{names}</h2>
            {eventDate && (
              <p className="mt-3 text-sm tracking-[0.22em] text-[#c9973f] uppercase">{formatDateLong(eventDate)}</p>
            )}
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mx-auto mt-8 max-w-xs border-2 border-[#c9973f] p-2">
            <div className="border border-[#c9973f]/60 p-2">
              <SafeImg
                key={content.heroImage}
                src={content.heroImage}
                alt={title}
                fallbackLabel={title}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
          </div>
        </Reveal>

        {content.quote && (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm text-center text-[15px] leading-8 text-[#d9c493] italic">
              &ldquo;{content.quote}&rdquo;
            </p>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-12 space-y-6 text-center">
            {coupleEntries(content)
              .filter((p) => p.nick || p.parents)
              .map((p) => (
                <div key={p.key} className="border-y border-[#c9973f]/50 py-7">
                  <p className="text-xs tracking-[0.35em] text-[#c9973f] uppercase">{p.label}</p>
                  <p className="mt-2 text-4xl font-medium text-[#f7ecc8]">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && <p className="mt-1 font-sans text-sm text-[#d9c493]">{p.full}</p>}
                  {p.parents && <p className="mt-2 font-sans text-xs text-[#a8937a]">{p.parents}</p>}
                </div>
              ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-10 border border-[#c9973f]/60 bg-[#3d1616] px-6 py-8 text-center">
            <SectionHeading kicker="Menghitung Hari" icon={<CalendarDays className="h-3.5 w-3.5" />} className="text-[#c9973f]" />
            <div className="mt-5 grid grid-cols-4 gap-2">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="border border-[#c9973f]/50 bg-[#2b0f0f] px-2 py-4"
                valueClass="text-2xl text-[#f7ecc8]"
                labelClass="mt-0.5 font-sans text-[10px] tracking-widest text-[#a8937a] uppercase"
                fallback={
                  <p className="col-span-4 font-sans text-sm text-[#a8937a]">
                    {target ? "Acara telah berlangsung. Terima kasih!" : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mt-8 border-2 border-[#c9973f] bg-[#3d1616] p-1.5">
              <div className="px-6 py-7 text-center">
                <p className="font-sans text-[11px] tracking-[0.35em] text-[#c9973f] uppercase">{e.name}</p>
                <p className="mt-3 text-xl text-[#f7ecc8]">{formatDateLong(e.date)}</p>
                {e.time && <p className="mt-1 font-sans text-sm text-[#d9c493]">Pukul {e.time} WIB</p>}
                {e.venue && (
                  <p className="mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-[#d9c493]">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c9973f]" />
                    {e.venue}
                  </p>
                )}
                {e.maps && (
                  <a href={e.maps} target="_blank" rel="noopener noreferrer"
                    className="mt-5 inline-flex h-11 items-center rounded-full bg-[#c9973f] px-6 font-sans text-sm font-semibold text-[#2b0f0f] transition-transform hover:scale-105">
                    Lihat Lokasi
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mt-12">
              <SectionHeading kicker="Galeri" icon={<Images className="h-3.5 w-3.5" />} className="text-[#c9973f]" />
              <div className="mt-5 grid grid-cols-2 gap-2">
                {content.galleryImages.map((url) => (
                  <SafeImg key={url} src={url} alt="Galeri" className="aspect-[3/4] w-full border border-[#c9973f]/50 object-cover" />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mt-12">
              <SectionHeading kicker="Tanda Kasih" icon={<Gift className="h-3.5 w-3.5" />} className="text-[#c9973f]" />
              <div className="mt-5 space-y-3">
                {content.accounts.map((a, i) => (
                  <div key={`${a.bank}-${a.number}-${i}`} className="border border-[#c9973f]/50 bg-[#3d1616] px-5 py-5 text-center">
                    <p className="font-sans text-xs tracking-[0.25em] text-[#c9973f] uppercase">{a.bank || "Bank"}</p>
                    <p className="mt-1 font-sans text-lg font-semibold tracking-wide text-[#f7ecc8] tabular-nums">{a.number || "-"}</p>
                    {a.holder && <p className="mt-0.5 font-sans text-xs text-[#a8937a]">a.n. {a.holder}</p>}
                    {a.number && <div className="mt-3"><CopyRekeningButton text={a.number} buttonClass="bg-[#c9973f] text-[#2b0f0f]" /></div>}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-12 border border-[#c9973f]/50 bg-[#3d1616] p-4">
            <div className="font-sans text-[#f0dfb8] [&_input]:bg-[#2b0f0f] [&_input]:text-white [&_textarea]:bg-[#2b0f0f] [&_textarea]:text-white">{rsvpSlot}</div>
          </div>
        </Reveal>

        <OrnateDivider ornament="❖" className="mx-auto mt-12 max-w-48 text-[#c9973f]" lineClass="bg-[#c9973f]/60" />
        <p className="mt-6 text-center text-sm text-[#a8937a]">Om Shanti Shanti Shanti Om</p>
        <p className="mt-2 text-center text-xs tracking-[0.3em] text-[#c9973f] uppercase">{names}</p>
      </div>

      <div aria-hidden className="h-8 text-[#c9973f] opacity-80"><KawungBand className="h-full w-full" /></div>
    </div>
  );
}

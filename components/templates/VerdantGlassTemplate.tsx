"use client";

import { CalendarDays, Gift, Images, MapPin } from "lucide-react";
import { coupleNames, formatDateLong } from "@/lib/invitation";
import {
  CoverOverlay,
  CopyRekeningButton,
  MusicToggle,
  Reveal,
  SafeImg,
  SectionHeading,
} from "./shared";
import {
  CountdownUnits,
  coupleEntries,
  eventEntries,
  useInvitationState,
} from "./parts";
import type { TemplateProps } from "./types";

/**
 * VERDANT GLASS — Glassmorphism & Nature. Deep emerald dengan
 * kartu frosted-glass (backdrop-blur), blob blur lembut, dan
 * tipografi serif ringan di atas warna gelap.
 */
export function VerdantGlassTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const eventDate = content.akadDate || content.receptionDate;

  return (
    <div className="relative min-h-full overflow-hidden bg-gradient-to-b from-[#0b2e25] via-[#0e3d30] to-[#071f1a] font-serif text-emerald-50 antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#0b2e25]/95 text-emerald-50"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="The Wedding Of"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-emerald-100/90 text-[#0b2e25] shadow-xl backdrop-blur"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      {/* Blob blur dekoratif */}
      <div aria-hidden className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-teal-300/10 blur-3xl" />

      <div className="relative mx-auto max-w-md px-6 py-14">
        <Reveal>
          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
            <p className="text-[11px] tracking-[0.4em] text-emerald-200/80 uppercase">
              The Wedding Of
            </p>
            <h2 className="mt-4 text-4xl leading-snug font-medium">{names}</h2>
            {eventDate && (
              <p className="mt-3 text-sm tracking-[0.2em] text-emerald-200/80 uppercase">
                {formatDateLong(eventDate)}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mt-6 rounded-3xl border border-white/20 bg-white/10 p-3 backdrop-blur-xl">
            <SafeImg
              key={content.heroImage}
              src={content.heroImage}
              alt={title}
              fallbackLabel={title}
              className="aspect-[3/4] w-full rounded-2xl object-cover"
            />
          </div>
        </Reveal>

        {content.quote && (
          <Reveal>
            <div className="mt-6 rounded-3xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur-lg">
              <p className="text-[15px] leading-8 text-emerald-50/90 italic">
                &ldquo;{content.quote}&rdquo;
              </p>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-6 space-y-4">
            <SectionHeading kicker="Mempelai" className="text-emerald-200/80" />
            {coupleEntries(content)
              .filter((p) => p.nick || p.parents)
              .map((p) => (
                <div key={p.key} className="rounded-3xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-xl">
                  <p className="text-3xl font-medium">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && (
                    <p className="mt-1 font-sans text-sm text-emerald-100/80">{p.full}</p>
                  )}
                  {p.parents && (
                    <p className="mt-2 font-sans text-xs text-emerald-200/70">
                      {p.label} {p.parents}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-6 rounded-3xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur-lg">
            <SectionHeading kicker="Menghitung Hari" icon={<CalendarDays className="h-3.5 w-3.5" />} className="text-emerald-200/80" />
            <div className="mt-5 grid grid-cols-4 gap-2">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="rounded-2xl border border-white/20 bg-white/10 px-2 py-4 backdrop-blur"
                valueClass="text-2xl text-white"
                labelClass="mt-0.5 font-sans text-[10px] tracking-widest text-emerald-200/70 uppercase"
                fallback={
                  <p className="col-span-4 font-sans text-sm text-emerald-200/70">
                    {target ? "Acara telah berlangsung. Terima kasih!" : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mt-4 rounded-3xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-xl">
              <p className="font-sans text-[11px] tracking-[0.35em] text-emerald-200/80 uppercase">
                {e.name}
              </p>
              <p className="mt-3 text-xl">{formatDateLong(e.date)}</p>
              {e.time && <p className="mt-1 font-sans text-sm text-emerald-100/80">Pukul {e.time} WIB</p>}
              {e.venue && (
                <p className="mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-emerald-100/80">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {e.venue}
                </p>
              )}
              {e.maps && (
                <a
                  href={e.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex h-11 items-center rounded-full bg-emerald-100/90 px-6 font-sans text-sm font-medium text-[#0b2e25] transition-transform hover:scale-105"
                >
                  Lihat Lokasi
                </a>
              )}
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mt-6 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-lg">
              <SectionHeading kicker="Galeri" icon={<Images className="h-3.5 w-3.5" />} className="text-emerald-200/80" />
              <div className="mt-5 grid grid-cols-2 gap-2">
                {content.galleryImages.map((url) => (
                  <SafeImg key={url} src={url} alt="Galeri" className="aspect-[3/4] w-full rounded-2xl object-cover" />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mt-6 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-lg">
              <SectionHeading kicker="Tanda Kasih" icon={<Gift className="h-3.5 w-3.5" />} className="text-emerald-200/80" />
              <div className="mt-5 space-y-3">
                {content.accounts.map((a, i) => (
                  <div key={`${a.bank}-${a.number}-${i}`} className="rounded-2xl border border-white/20 bg-white/10 p-5 text-center backdrop-blur-xl">
                    <p className="font-sans text-xs tracking-[0.25em] text-emerald-200/80 uppercase">{a.bank || "Bank"}</p>
                    <p className="mt-1 font-sans text-lg font-semibold tracking-wide tabular-nums">{a.number || "-"}</p>
                    {a.holder && <p className="mt-0.5 font-sans text-xs text-emerald-100/70">a.n. {a.holder}</p>}
                    {a.number && (
                      <div className="mt-3">
                        <CopyRekeningButton text={a.number} buttonClass="bg-emerald-100/90 text-[#0b2e25]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-6 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-lg">
            <div className="font-sans [&_input]:bg-white/90 [&_textarea]:bg-white/90">{rsvpSlot}</div>
          </div>
        </Reveal>

        <p className="mt-10 text-center text-sm text-emerald-100/80">Terima kasih atas doa & kehadiran Anda</p>
        <p className="mt-2 text-center text-xs tracking-[0.3em] text-emerald-200/70 uppercase">{names}</p>
      </div>
    </div>
  );
}

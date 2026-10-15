"use client";

import { CalendarDays, Gift, Images, MapPin } from "lucide-react";
import { coupleNames, formatDateLong } from "@/lib/invitation";
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
  useInvitationState,
} from "./parts";
import type { TemplateProps } from "./types";

/**
 * ARUNA — Minimalist Elegant. Ivory lapang, champagne gold lembut,
 * serif elegan, foto arch, aksen botanical tipis. Template default.
 */
export function ArunaTemplate({ title, content, guestName, rsvpSlot, defaultOpened }: TemplateProps) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);
  const eventDate = content.akadDate || content.receptionDate;

  return (
    <div className="relative min-h-full bg-[#faf7f0] font-serif text-[#3d3a34] antialiased">
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass="bg-[#faf7f0] text-[#3d3a34]"
          titleFont="font-serif"
          image={content.heroImage}
          kicker="The Wedding Of"
          names={names}
          guest={guest}
          note="Mohon maaf apabila ada kesalahan penulisan nama & gelar"
          buttonClass="bg-[#3d3a34] text-[#faf7f0] shadow-lg"
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      <div className="mx-auto max-w-md px-8 py-14">
        <Reveal>
          <div className="relative text-center">
            <BotanicalSprig className="absolute -left-2 top-0 h-28 w-8 text-[#c9a96a]/50" />
            <BotanicalSprig className="absolute -right-2 top-0 h-28 w-8 -scale-x-100 text-[#c9a96a]/50" />
            <p className="text-[11px] tracking-[0.4em] text-[#9a8a5f] uppercase">
              The Wedding Of
            </p>
            <h2 className="mt-4 text-4xl leading-snug font-medium text-[#2e2b26]">
              {names}
            </h2>
            {eventDate && (
              <p className="mt-3 text-sm tracking-[0.2em] text-[#9a8a5f] uppercase">
                {formatDateLong(eventDate)}
              </p>
            )}
            <div aria-hidden className="mx-auto mt-6 flex max-w-56 items-center gap-3">
              <span className="h-px flex-1 bg-[#c9a96a]/60" />
              <span className="text-[#c9a96a]">✦</span>
              <span className="h-px flex-1 bg-[#c9a96a]/60" />
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <SafeImg
            key={content.heroImage}
            src={content.heroImage}
            alt={title}
            fallbackLabel={title}
            className="mx-auto mt-8 aspect-[3/4] w-full max-w-xs rounded-t-[10rem] rounded-b-2xl border border-[#c9a96a]/40 object-cover shadow-xl shadow-[#c9a96a]/20"
          />
        </Reveal>

        {content.quote && (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm text-center text-[15px] leading-8 text-[#5c574c] italic">
              &ldquo;{content.quote}&rdquo;
            </p>
          </Reveal>
        )}

        <Reveal>
          <p className="mt-12 text-center text-[11px] tracking-[0.4em] text-[#9a8a5f] uppercase">
            Assalamu&apos;alaikum Wr. Wb.
          </p>
          <div className="mt-6 space-y-8">
            {coupleEntries(content)
              .filter((p) => p.nick || p.parents)
              .map((p) => (
                <div key={p.key} className="text-center">
                  <p className="text-3xl font-medium text-[#2e2b26]">{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && (
                    <p className="mt-1 font-sans text-sm text-[#5c574c]">{p.full}</p>
                  )}
                  {p.parents && (
                    <p className="mt-2 font-sans text-xs text-[#8a8474]">
                      {p.label} {p.parents}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12 border-t border-[#c9a96a]/40 pt-8 text-center">
            <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#9a8a5f] uppercase">
              <CalendarDays className="h-3.5 w-3.5" /> Menghitung Hari
            </p>
            <div className="mt-5 grid grid-cols-4 gap-2">
              <CountdownUnits
                target={target}
                opened={opened}
                boxClass="rounded-xl border border-[#c9a96a]/40 bg-white/70 px-2 py-4"
                valueClass="text-2xl text-[#2e2b26]"
                labelClass="mt-0.5 font-sans text-[10px] tracking-widest text-[#8a8474] uppercase"
                fallback={
                  <p className="col-span-4 font-sans text-sm text-[#8a8474]">
                    {target ? "Acara telah berlangsung. Terima kasih!" : "Tanggal acara menyusul"}
                  </p>
                }
              />
            </div>
          </div>
        </Reveal>

        {eventEntries(content).map((e) => (
          <Reveal key={e.key}>
            <div className="mt-8 rounded-2xl border border-[#e4d9c2] bg-white/80 px-6 py-7 text-center shadow-sm">
              <p className="font-sans text-[11px] tracking-[0.35em] text-[#9a8a5f] uppercase">
                {e.name}
              </p>
              <p className="mt-3 text-xl">{formatDateLong(e.date)}</p>
              {e.time && <p className="mt-1 font-sans text-sm text-[#5c574c]">Pukul {e.time} WIB</p>}
              {e.venue && (
                <p className="mt-3 flex items-start justify-center gap-1.5 font-sans text-sm text-[#5c574c]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9a8a5f]" />
                  {e.venue}
                </p>
              )}
              {e.maps && (
                <a
                  href={e.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex h-11 items-center rounded-full border border-[#3d3a34] px-6 font-sans text-sm font-medium transition-colors hover:bg-[#3d3a34] hover:text-white"
                >
                  Lihat Lokasi
                </a>
              )}
            </div>
          </Reveal>
        ))}

        {content.galleryImages.length > 0 && (
          <Reveal>
            <div className="mt-12 border-t border-[#c9a96a]/40 pt-8">
              <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#9a8a5f] uppercase">
                <Images className="h-3.5 w-3.5" /> Galeri
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {content.galleryImages.map((url) => (
                  <SafeImg
                    key={url}
                    src={url}
                    alt="Galeri"
                    className="aspect-[3/4] w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {content.accounts.length > 0 && (
          <Reveal>
            <div className="mt-12 border-t border-[#c9a96a]/40 pt-8">
              <p className="flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.35em] text-[#9a8a5f] uppercase">
                <Gift className="h-3.5 w-3.5" /> Tanda Kasih
              </p>
              <div className="mt-5 space-y-3">
                {content.accounts.map((a, i) => (
                  <div
                    key={`${a.bank}-${a.number}-${i}`}
                    className="rounded-2xl border border-[#e4d9c2] bg-white/80 px-5 py-5 text-center"
                  >
                    <p className="font-sans text-xs tracking-[0.25em] text-[#9a8a5f] uppercase">
                      {a.bank || "Bank"}
                    </p>
                    <p className="mt-1 font-sans text-lg font-semibold tracking-wide tabular-nums">
                      {a.number || "-"}
                    </p>
                    {a.holder && (
                      <p className="mt-0.5 font-sans text-xs text-[#8a8474]">a.n. {a.holder}</p>
                    )}
                    {a.number && (
                      <div className="mt-3">
                        <CopyRekeningButton text={a.number} buttonClass="bg-[#3d3a34] text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="mt-12 border-t border-[#c9a96a]/40 pt-8">
            <div className="font-sans [&_input]:bg-white [&_textarea]:bg-white">{rsvpSlot}</div>
          </div>
        </Reveal>

        <p className="mt-12 text-center text-sm text-[#8a8474]">
          Terima kasih atas doa & kehadiran Anda
        </p>
        <p className="mt-2 text-center text-xs tracking-[0.3em] text-[#9a8a5f] uppercase">
          {names}
        </p>
      </div>
    </div>
  );
}

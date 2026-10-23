"use client";

import { coupleNames, formatDateLong, resolveGreeting } from "@/lib/invitation";
import { Reveal, SafeImg } from "./shared";
import { BotanicalSprig } from "./parts";
import { InvitationLayout } from "./layout/InvitationLayout";
import { ARUNA_LAYOUT } from "./layout/presets";
import type { TemplateProps } from "./types";

/**
 * ARUNA — Minimalist Elegant. Ivory lapang, champagne gold lembut,
 * serif elegan, foto arch, aksen botanical tipis. Template default.
 *
 * Template ini adalah Proof-of-Concept Fase F4: strukturnya kini
 * dipakai bersama dengan `InvitationLayout` universal — urutan section, logika data
 * pasangan/acara/galeri/rekening, cover overlay, dan countdown hanya
 * ditulis satu kali di `components/templates/layout/`.
 *
 * Yang tersisa di file ini hanyalah hal yang memang khas Aruna:
 * blok header berornamen, foto arch, quote, dan gaya visualnya
 * (lihat `layout/presets.tsx`).
 */
export function ArunaTemplate({
  title,
  content,
  guestName,
  rsvpSlot,
  defaultOpened,
}: TemplateProps) {
  const names = coupleNames(content);
  const eventDate = content.akadDate || content.receptionDate;
  // Sapaan kustom menang atas bawaan; "" = sembunyikan; undefined (data
  // lama) = salam bawaan template.
  const greeting = resolveGreeting(content.greeting, "Assalamu'alaikum Wr. Wb.");

  return (
    <InvitationLayout
      title={title}
      content={content}
      guestName={guestName}
      rsvpSlot={rsvpSlot}
      defaultOpened={defaultOpened}
      config={ARUNA_LAYOUT}
      slots={{
        hero: (
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
        ),

        heroImage: (
          <Reveal delayMs={80}>
            <SafeImg
              key={content.heroImage}
              src={content.heroImage}
              alt={title}
              fallbackLabel={title}
              className="mx-auto mt-8 aspect-[3/4] w-full max-w-xs rounded-t-[10rem] rounded-b-2xl border border-[#c9a96a]/40 object-cover shadow-xl shadow-[#c9a96a]/20"
            />
          </Reveal>
        ),

        quote: content.quote ? (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm text-center text-[15px] leading-8 text-[#5c574c] italic">
              &ldquo;{content.quote}&rdquo;
            </p>
          </Reveal>
        ) : null,

        coupleLeading: greeting ? (
          <p className="mt-12 text-center text-[11px] tracking-[0.4em] text-[#9a8a5f] uppercase">
            {greeting}
          </p>
        ) : null,
      }}
    />
  );
}

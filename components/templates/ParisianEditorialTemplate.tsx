"use client";

import { formatDateLong } from "@/lib/invitation";
import { Reveal, SafeImg } from "./shared";
import { InvitationLayout } from "./layout/InvitationLayout";
import { PARISIAN_LAYOUT } from "./layout/presets/parisian";
import type { TemplateProps } from "./types";

/**
 * PARISIAN EDITORIAL — Luxury Fashion Magazine. Monokrom bold,
 * grid asimetris, tipografi raksasa, dan penomoran editorial.
 */
export function ParisianEditorialTemplate({
  title,
  content,
  guestName,
  rsvpSlot,
  defaultOpened,
}: TemplateProps) {
  const eventDate = content.akadDate || content.receptionDate;
  return (
    <InvitationLayout
      title={title}
      content={content}
      guestName={guestName}
      rsvpSlot={rsvpSlot}
      defaultOpened={defaultOpened}
      config={PARISIAN_LAYOUT}
      slots={{
        hero: (
          <>
            <div className="flex items-center justify-between border-b-2 border-black px-6 py-3 text-[10px] font-bold tracking-[0.25em] uppercase">
              <span>Parisian</span>
              <span>Édition Mariage</span>
            </div>
            <div className="px-6 pt-10">
              <Reveal>
                <p className="text-[11px] font-bold tracking-[0.3em] uppercase">
                  N° 01 — The Wedding Of
                </p>
                <h2 className="mt-3 text-6xl leading-[0.95] font-black tracking-tight uppercase">
                  {content.groomNickname ||
                    content.groomFullName ||
                    "Groom"}
                  <span className="block text-white [-webkit-text-stroke:2px_black]">
                    &
                  </span>
                  {content.brideNickname || content.brideFullName || "Bride"}
                </h2>
                {eventDate && (
                  <p className="mt-4 inline-block bg-black px-3 py-1.5 text-[11px] font-bold tracking-[0.2em] text-white uppercase">
                    {formatDateLong(eventDate)}
                  </p>
                )}
              </Reveal>
            </div>
          </>
        ),
        heroImage: (
          <Reveal delayMs={80}>
            <div className="mt-8 grid grid-cols-12 gap-0 border-y-2 border-black">
              <div className="col-span-7">
                <SafeImg
                  key={content.heroImage}
                  src={content.heroImage}
                  alt={title}
                  fallbackLabel={title}
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
              <div className="col-span-5 flex flex-col justify-between border-l-2 border-black bg-black p-4 text-white">
                <p className="text-4xl leading-none font-black">“LOVE”</p>
                <p className="mt-4 text-[11px] leading-relaxed uppercase opacity-80">
                  {content.quote ||
                    "Dua hati, satu cerita — diabadikan dalam satu edisi spesial."}
                </p>
                <p className="mt-4 text-[10px] tracking-[0.3em] uppercase opacity-60">
                  Cover Story ↓
                </p>
              </div>
            </div>
          </Reveal>
        ),
        beforeCouple: content.greeting ? (
          <p className="border-l-4 border-black pl-4 text-sm font-bold uppercase italic">
            {content.greeting}
          </p>
        ) : null,
      }}
    />
  );
}

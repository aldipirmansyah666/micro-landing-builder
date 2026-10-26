"use client";

import { coupleNames, formatDateLong } from "@/lib/invitation";
import { KawungBand } from "./parts";
import { Reveal, SafeImg } from "./shared";
import { InvitationLayout } from "./layout/InvitationLayout";
import { HERITAGE_LAYOUT } from "./layout/presets/heritage";
import type { TemplateProps } from "./types";

/**
 * SURABAYA HERITAGE — Traditional Peranakan/Jawa Minimalis.
 * Navy pekat & krem gading dengan garis kawung emas tipis,
 * bingkai ganda simetris yang tenang dan berkelas.
 */
export function SurabayaHeritageTemplate({
  title,
  content,
  guestName,
  rsvpSlot,
  defaultOpened,
}: TemplateProps) {
  const names = coupleNames(content);
  const eventDate = content.akadDate || content.receptionDate;
  return (
    <InvitationLayout
      title={title}
      content={content}
      guestName={guestName}
      rsvpSlot={rsvpSlot}
      defaultOpened={defaultOpened}
      config={HERITAGE_LAYOUT}
      slots={{
        beforeContainer: (
          <div aria-hidden className="h-10 text-[#c9a227] opacity-70">
            <KawungBand className="h-full w-full" />
          </div>
        ),
        afterContainer: (
          <div aria-hidden className="h-10 text-[#c9a227] opacity-70">
            <KawungBand className="h-full w-full" />
          </div>
        ),
        hero: (
          <Reveal>
            <div className="border-2 border-[#1b2a4a] p-1.5">
              <div className="border border-[#c9a227] px-6 py-10 text-center">
                <p className="text-[11px] tracking-[0.45em] text-[#8a7a2e] uppercase">
                  The Wedding Of
                </p>
                <h2 className="mt-4 text-4xl leading-snug font-medium">
                  {names}
                </h2>
                {eventDate && (
                  <p className="mt-3 text-sm tracking-[0.2em] text-[#8a7a2e] uppercase">
                    {formatDateLong(eventDate)}
                  </p>
                )}
                <div
                  aria-hidden
                  className="mx-auto mt-6 flex max-w-48 items-center gap-2"
                >
                  <span className="h-px flex-1 bg-[#c9a227]" />
                  <span className="text-xs text-[#c9a227]">◆ ◆ ◆</span>
                  <span className="h-px flex-1 bg-[#c9a227]" />
                </div>
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
              className="mx-auto mt-8 aspect-[4/5] w-full max-w-xs border-2 border-[#1b2a4a] object-cover p-1.5 shadow-lg"
            />
          </Reveal>
        ),
        quote: content.quote ? (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm border-y border-[#c9a227] py-6 text-center text-[15px] leading-8 text-[#3d4a6a] italic">
              &ldquo;{content.quote}&rdquo;
            </p>
          </Reveal>
        ) : null,
        beforeCouple: content.greeting ? (
          <Reveal>
            <p className="mx-auto mt-8 max-w-sm border-y border-[#c9a227] py-4 text-center font-serif text-lg leading-8 text-[#3d4a6a] italic">
              {content.greeting}
            </p>
          </Reveal>
        ) : null,
      }}
    />
  );
}

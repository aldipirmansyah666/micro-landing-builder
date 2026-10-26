"use client";

import { coupleNames, formatDateLong, resolveGreeting } from "@/lib/invitation";
import { KawungBand } from "./parts";
import { OrnateDivider, Reveal, SafeImg } from "./shared";
import { InvitationLayout } from "./layout/InvitationLayout";
import { BALINESE_LAYOUT } from "./layout/presets/balinese";
import type { TemplateProps } from "./types";

/**
 * ROYAL BALINESE — Traditional Ethnic Bali. Marun pekat & perunggu
 * dengan pita ukiran emas, bingkai ganda, dan simetri agung.
 */
export function RoyalBalineseTemplate({
  title,
  content,
  guestName,
  rsvpSlot,
  defaultOpened,
}: TemplateProps) {
  const names = coupleNames(content);
  const greeting = resolveGreeting(content.greeting, "Om Swastiastu");
  const eventDate = content.akadDate || content.receptionDate;
  return (
    <InvitationLayout
      title={title}
      content={content}
      guestName={guestName}
      rsvpSlot={rsvpSlot}
      defaultOpened={defaultOpened}
      config={BALINESE_LAYOUT}
      slots={{
        beforeContainer: (
          <div aria-hidden className="h-8 text-[#c9973f] opacity-80">
            <KawungBand className="h-full w-full" />
          </div>
        ),
        afterContainer: (
          <div aria-hidden className="h-8 text-[#c9973f] opacity-80">
            <KawungBand className="h-full w-full" />
          </div>
        ),
        hero: (
          <Reveal>
            <div className="text-center">
              {greeting && (
                <p className="text-[11px] tracking-[0.45em] text-[#c9973f] uppercase">
                  {greeting}
                </p>
              )}
              <OrnateDivider
                ornament="❖"
                className="mx-auto mt-4 max-w-48 text-[#c9973f]"
                lineClass="bg-[#c9973f]/60"
              />
              <h2 className="mt-5 text-4xl leading-snug font-medium">
                {names}
              </h2>
              {eventDate && (
                <p className="mt-3 text-sm tracking-[0.22em] text-[#c9973f] uppercase">
                  {formatDateLong(eventDate)}
                </p>
              )}
            </div>
          </Reveal>
        ),
        heroImage: (
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
        ),
        quote: content.quote ? (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm text-center text-[15px] leading-8 text-[#d9c493] italic">
              &ldquo;{content.quote}&rdquo;
            </p>
          </Reveal>
        ) : null,
      }}
    />
  );
}

"use client";

import { coupleNames, formatDateLong, resolveGreeting } from "@/lib/invitation";
import { EightPointStar } from "./parts";
import { Reveal, SafeImg } from "./shared";
import { InvitationLayout } from "./layout/InvitationLayout";
import { ARABESQUE_LAYOUT } from "./layout/presets/arabesque";
import type { TemplateProps } from "./types";

/**
 * ARABESQUE SAKRAL — Islamic Architecture & Gold Foil. Mihrab
 * melengkung, mozaik geometris emas, emerald & gold yang sakral.
 */
export function ArabesqueSakralTemplate({
  title,
  content,
  guestName,
  rsvpSlot,
  defaultOpened,
}: TemplateProps) {
  const names = coupleNames(content);
  const greeting = resolveGreeting(
    content.greeting,
    "Bismillahirrahmanirrahim"
  );
  const eventDate = content.akadDate || content.receptionDate;
  return (
    <InvitationLayout
      title={title}
      content={content}
      guestName={guestName}
      rsvpSlot={rsvpSlot}
      defaultOpened={defaultOpened}
      config={ARABESQUE_LAYOUT}
      slots={{
        beforeContainer: (
          <div
            aria-hidden
            className="h-6 opacity-70"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #c9a227 0 2px, transparent 2px 10px, #c9a227 10px 12px, transparent 12px 20px)",
            }}
          />
        ),
        afterContainer: (
          <div
            aria-hidden
            className="h-6 opacity-70"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #c9a227 0 2px, transparent 2px 10px, #c9a227 10px 12px, transparent 12px 20px)",
            }}
          />
        ),
        hero: (
          <Reveal>
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 text-[#c9a227]">
                <EightPointStar className="h-8 w-8" />
                {greeting && (
                  <p className="text-[11px] tracking-[0.4em] uppercase">
                    {greeting}
                  </p>
                )}
                <EightPointStar className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-4xl leading-snug font-medium text-[#f7f0da]">
                {names}
              </h2>
              {eventDate && (
                <p className="mt-3 text-sm tracking-[0.22em] text-[#c9a227] uppercase">
                  {formatDateLong(eventDate)}
                </p>
              )}
            </div>
          </Reveal>
        ),
        heroImage: (
          <Reveal delayMs={80}>
            <div className="mx-auto mt-8 max-w-xs rounded-t-full border-2 border-[#c9a227] p-2 pt-2">
              <SafeImg
                key={content.heroImage}
                src={content.heroImage}
                alt={title}
                fallbackLabel={title}
                className="aspect-[3/4] w-full rounded-t-full object-cover"
              />
            </div>
          </Reveal>
        ),
        quote: content.quote ? (
          <Reveal>
            <div className="mx-auto mt-10 max-w-sm border border-[#c9a227]/50 bg-white/[0.04] px-6 py-6 text-center">
              <EightPointStar className="mx-auto h-6 w-6 text-[#c9a227]" />
              <p className="mt-3 text-[15px] leading-8 text-[#e2d5b3] italic">
                &ldquo;{content.quote}&rdquo;
              </p>
            </div>
          </Reveal>
        ) : null,
      }}
    />
  );
}

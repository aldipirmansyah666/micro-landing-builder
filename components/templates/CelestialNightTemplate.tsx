"use client";

import { Sparkles } from "lucide-react";
import { coupleNames, formatDateLong } from "@/lib/invitation";
import { Reveal, SafeImg } from "./shared";
import { InvitationLayout } from "./layout/InvitationLayout";
import { CELESTIAL_LAYOUT } from "./layout/presets/celestial";
import type { TemplateProps } from "./types";

/**
 * CELESTIAL NIGHT — Dark Mode Luxury. Midnight blue/black dengan
 * taburan bintang emas dan shimmer lembut yang misterius-elegan.
 */
export function CelestialNightTemplate({
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
      config={CELESTIAL_LAYOUT}
      slots={{
        beforeContainer: (
          <>
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <span className="absolute top-10 left-8 h-1 w-1 rounded-full bg-[#d4af37] opacity-80" />
              <span className="absolute top-24 right-10 h-0.5 w-0.5 rounded-full bg-white opacity-70" />
              <span className="absolute top-40 left-1/4 h-1 w-1 rounded-full bg-white opacity-50" />
              <span className="absolute top-64 right-1/4 h-0.5 w-0.5 rounded-full bg-[#d4af37] opacity-90" />
              <span className="absolute top-96 left-10 h-0.5 w-0.5 rounded-full bg-white opacity-60" />
              <span className="absolute top-[32rem] right-8 h-1 w-1 rounded-full bg-[#d4af37] opacity-70" />
              <span className="absolute top-[44rem] left-1/3 h-0.5 w-0.5 rounded-full bg-white opacity-60" />
              <span className="absolute top-[56rem] right-12 h-1 w-1 rounded-full bg-white opacity-50" />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#1b2a5e]/60 blur-3xl"
            />
          </>
        ),
        hero: (
          <Reveal>
            <div className="text-center">
              <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.45em] text-[#d4af37] uppercase">
                <Sparkles className="h-3.5 w-3.5" /> The Wedding Of
              </p>
              <h2 className="mt-5 bg-gradient-to-b from-[#f7ecc8] via-[#e8cf8a] to-[#9a7b24] bg-clip-text text-5xl leading-tight font-medium text-transparent">
                {names}
              </h2>
              {eventDate && (
                <p className="mt-4 text-sm tracking-[0.25em] text-[#b9b09a] uppercase">
                  {formatDateLong(eventDate)}
                </p>
              )}
              <div
                aria-hidden
                className="mx-auto mt-7 flex max-w-52 items-center gap-3"
              >
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d4af37]" />
                <span className="text-[#d4af37]">✦</span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d4af37]" />
              </div>
            </div>
          </Reveal>
        ),
        heroImage: (
          <Reveal delayMs={80}>
            <div className="relative mx-auto mt-10 max-w-xs">
              <div
                aria-hidden
                className="absolute -inset-3 rounded-[2.5rem] bg-[#d4af37]/15 blur-xl"
              />
              <SafeImg
                key={content.heroImage}
                src={content.heroImage}
                alt={title}
                fallbackLabel={title}
                className="relative aspect-[3/4] w-full rounded-[2rem] border border-[#d4af37]/50 object-cover shadow-[0_0_40px_rgba(212,175,55,0.15)]"
              />
            </div>
          </Reveal>
        ),
        quote: content.quote ? (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm text-center text-[15px] leading-8 text-[#c9c2ab] italic">
              &ldquo;{content.quote}&rdquo;
            </p>
          </Reveal>
        ) : null,
        beforeCouple: content.greeting ? (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm text-center font-serif text-xl leading-9 text-[#e8d9a8] italic">
              {content.greeting}
            </p>
          </Reveal>
        ) : null,
      }}
    />
  );
}

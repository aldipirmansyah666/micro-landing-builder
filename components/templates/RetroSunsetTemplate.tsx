"use client";

import { Sun } from "lucide-react";
import { coupleNames, formatDateLong } from "@/lib/invitation";
import { Reveal, SafeImg } from "./shared";
import { InvitationLayout } from "./layout/InvitationLayout";
import { RETRO_LAYOUT } from "./layout/presets/retro";
import type { TemplateProps } from "./types";

/**
 * RETRO SUNSET — Warm Terracotta 90s. Sunburst arch mustard &
 * peach, kartu membulat berani, dan aksen playful yang hangat.
 */
export function RetroSunsetTemplate({
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
      config={RETRO_LAYOUT}
      slots={{
        hero: (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
            >
              <div className="flex h-72 w-72 items-center justify-center rounded-b-full bg-[#e8a94e]/40">
                <div className="flex h-56 w-56 items-center justify-center rounded-b-full bg-[#e8a94e]/50">
                  <div className="h-40 w-40 rounded-b-full bg-[#c96f4a]/50" />
                </div>
              </div>
            </div>
            <Reveal>
              <div className="relative pt-16 text-center">
                <p className="inline-flex items-center gap-2 rounded-full bg-[#2f3e33] px-4 py-1.5 text-[11px] font-bold tracking-[0.3em] text-[#fbe3c8] uppercase">
                  <Sun className="h-3.5 w-3.5" /> The Wedding Of
                </p>
                <h2 className="mt-4 text-5xl leading-[1.02] font-black tracking-tight">
                  {names}
                </h2>
                {eventDate && (
                  <p className="mx-auto mt-4 w-fit -rotate-2 rounded-2xl bg-[#c96f4a] px-5 py-2 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-lg">
                    {formatDateLong(eventDate)}
                  </p>
                )}
              </div>
            </Reveal>
          </>
        ),
        heroImage: (
          <Reveal delayMs={80}>
            <div className="relative mx-auto mt-10 max-w-xs -rotate-2 rounded-[2.5rem] border-4 border-[#2f3e33] bg-white p-2 shadow-[8px_8px_0_#2f3e33]">
              <SafeImg
                key={content.heroImage}
                src={content.heroImage}
                alt={title}
                fallbackLabel={title}
                className="aspect-[3/4] w-full rounded-[2rem] object-cover"
              />
            </div>
          </Reveal>
        ),
        quote: content.quote ? (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm rotate-1 rounded-[2rem] bg-[#2f3e33] px-6 py-5 text-center text-[15px] leading-8 text-[#fbe3c8] italic shadow-[6px_6px_0_rgba(201,111,74,0.6)]">
              &ldquo;{content.quote}&rdquo;
            </p>
          </Reveal>
        ) : null,
        beforeCouple: content.greeting ? (
          <Reveal>
            <p className="mx-auto mt-8 w-fit -rotate-1 rounded-2xl bg-[#e8a94e]/50 px-5 py-2 text-center text-sm font-bold text-[#4a2c17]">
              {content.greeting}
            </p>
          </Reveal>
        ) : null,
      }}
    />
  );
}

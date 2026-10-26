"use client";

import { coupleNames, resolveGreeting } from "@/lib/invitation";
import { BotanicalSprig } from "./parts";
import { Reveal, SafeImg } from "./shared";
import { InvitationLayout } from "./layout/InvitationLayout";
import { SERUNI_LAYOUT } from "./layout/presets/seruni";
import type { TemplateProps } from "./types";

/**
 * SERUNI — Romantic Floral. Blush, dusty rose, sage; bunga
 * watercolor ringan di tepi; bingkai organik; fokus pada nama.
 */
export function SeruniTemplate({
  title,
  content,
  guestName,
  rsvpSlot,
  defaultOpened,
}: TemplateProps) {
  const names = coupleNames(content);
  const greeting = resolveGreeting(content.greeting, "Assalamu'alaikum Wr. Wb.");
  return (
    <InvitationLayout
      title={title}
      content={content}
      guestName={guestName}
      rsvpSlot={rsvpSlot}
      defaultOpened={defaultOpened}
      config={SERUNI_LAYOUT}
      slots={{
        background: (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#f5d3d8]/60 blur-3xl" />
            <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-[#dfe7d5]/70 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#f7e3c8]/60 blur-3xl" />
          </div>
        ),
        hero: (
          <>
            <Reveal>
              <div className="relative text-center">
                <BotanicalSprig className="absolute top-0 left-0 h-32 w-9 text-[#8a9b85]/60" />
                <BotanicalSprig className="absolute top-0 right-0 h-32 w-9 -scale-x-100 text-[#c98a94]/60" />
                {greeting && (
                  <p className="text-[11px] tracking-[0.4em] text-[#c98a94] uppercase">
                    {greeting}
                  </p>
                )}
                {content.quote && (
                  <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-[#6b4a52]/80 italic">
                    &ldquo;{content.quote}&rdquo;
                  </p>
                )}
              </div>
            </Reveal>
            <Reveal delayMs={80}>
              <div className="mt-6 text-center">
                <h2 className="text-[2.6rem] leading-tight font-semibold text-[#5c3f47] italic">
                  {names}
                </h2>
                <p className="mt-2 text-xs tracking-[0.25em] text-[#a08a90] uppercase">
                  — dua hati, satu cerita —
                </p>
              </div>
            </Reveal>
          </>
        ),
        heroImage: (
          <Reveal>
            <div className="relative mx-auto mt-8 max-w-[19rem]">
              <div
                aria-hidden
                className="absolute -inset-2 rounded-t-[9rem] rounded-b-[2.5rem] bg-gradient-to-b from-[#e8b4bc]/50 to-[#8a9b85]/30 blur-[2px]"
              />
              <SafeImg
                key={content.heroImage}
                src={content.heroImage}
                alt={title}
                fallbackLabel={title}
                className="relative aspect-[3/4] w-full rounded-t-[8rem] rounded-b-[2rem] border-4 border-white object-cover shadow-xl shadow-[#e8b4bc]/40"
              />
            </div>
          </Reveal>
        ),
      }}
    />
  );
}

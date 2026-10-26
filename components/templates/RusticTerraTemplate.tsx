"use client";

import { coupleNames, formatDateLong } from "@/lib/invitation";
import { BotanicalSprig } from "./parts";
import { OrnateDivider, Reveal, SafeImg } from "./shared";
import { InvitationLayout } from "./layout/InvitationLayout";
import { TERRA_LAYOUT } from "./layout/presets/terra";
import type { TemplateProps } from "./types";

/**
 * RUSTIC TERRA — Boho & Warm Earthy. Terracotta hangat, krem linen,
 * foto arch ganda, pita botanical, dan divider anyaman boho.
 */
export function RusticTerraTemplate({
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
      config={TERRA_LAYOUT}
      slots={{
        beforeContainer: (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(180,85,45,0.05) 6px)",
            }}
          />
        ),
        hero: (
          <Reveal>
            <div className="relative text-center">
              <BotanicalSprig className="absolute -left-1 top-0 h-32 w-9 text-[#b4552d]/40" />
              <BotanicalSprig className="absolute -right-1 top-0 h-32 w-9 -scale-x-100 text-[#b4552d]/40" />
              <p className="text-[11px] tracking-[0.35em] text-[#b4552d] uppercase">
                The Wedding Of
              </p>
              <h2 className="mt-4 text-4xl leading-snug font-medium text-[#3a2d20]">
                {names}
              </h2>
              {eventDate && (
                <p className="mt-3 text-sm tracking-[0.18em] text-[#8a6a4a] uppercase">
                  {formatDateLong(eventDate)}
                </p>
              )}
              <OrnateDivider
                ornament="❧"
                className="mx-auto mt-6 max-w-56 text-[#b4552d]"
                lineClass="bg-[#b4552d]/50"
              />
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
              className="mx-auto mt-8 aspect-[3/4] w-full max-w-xs rounded-t-[12rem] rounded-b-[2rem] border-4 border-[#e0cda8] object-cover shadow-xl shadow-[#b4552d]/20"
            />
          </Reveal>
        ),
        quote: content.quote ? (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm rounded-3xl bg-[#efe2cb] px-6 py-5 text-center text-[15px] leading-8 text-[#5c4a36] italic">
              &ldquo;{content.quote}&rdquo;
            </p>
          </Reveal>
        ) : null,
        beforeCouple: content.greeting ? (
          <Reveal>
            <p className="mx-auto mt-8 max-w-sm text-center font-serif text-xl leading-9 text-[#6a563e] italic">
              {content.greeting}
            </p>
          </Reveal>
        ) : null,
      }}
    />
  );
}

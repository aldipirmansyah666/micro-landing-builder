"use client";

import { coupleNames, formatDateLong } from "@/lib/invitation";
import { BotanicalSprig } from "./parts";
import { Reveal, SafeImg } from "./shared";
import { InvitationLayout } from "./layout/InvitationLayout";
import { BLOSSOM_LAYOUT } from "./layout/presets/blossom";
import type { TemplateProps } from "./types";

/**
 * BLOSSOM SAGE — Pastel Watercolor & Botanical. Sage green lembut,
 * pink pastel, kaligrafi italic, dan kartu membulat yang manis.
 */
export function BlossomSageTemplate({
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
      config={BLOSSOM_LAYOUT}
      slots={{
        beforeContainer: (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#e8b4b8]/30 blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute top-64 -left-20 h-64 w-64 rounded-full bg-[#a8b8a0]/30 blur-2xl"
            />
          </>
        ),
        hero: (
          <Reveal>
            <div className="text-center">
              <div className="flex items-center justify-center gap-3">
                <BotanicalSprig className="h-16 w-5 text-[#7d8b7a]/60" />
                <p className="text-[11px] tracking-[0.4em] text-[#9aa793] uppercase">
                  The Wedding Of
                </p>
                <BotanicalSprig className="h-16 w-5 -scale-x-100 text-[#c98a94]/60" />
              </div>
              <h2 className="mt-4 text-5xl leading-tight font-medium text-[#3f4a41] italic">
                {names}
              </h2>
              {eventDate && (
                <p className="mx-auto mt-4 w-fit rounded-full bg-[#e8b4b8]/30 px-5 py-1.5 text-xs tracking-[0.2em] text-[#8a6a6e] uppercase">
                  {formatDateLong(eventDate)}
                </p>
              )}
            </div>
          </Reveal>
        ),
        heroImage: (
          <Reveal delayMs={80}>
            <div className="relative mx-auto mt-8 max-w-xs">
              <div
                aria-hidden
                className="absolute -inset-2 rounded-full bg-gradient-to-br from-[#a8b8a0]/40 to-[#e8b4b8]/40 blur-md"
              />
              <SafeImg
                key={content.heroImage}
                src={content.heroImage}
                alt={title}
                fallbackLabel={title}
                className="relative aspect-[3/4] w-full rounded-full border-4 border-white object-cover shadow-xl"
              />
            </div>
          </Reveal>
        ),
        quote: content.quote ? (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm text-center font-serif text-xl leading-9 text-[#6a7a6c] italic">
              ❝ {content.quote} ❞
            </p>
          </Reveal>
        ) : null,
        beforeCouple: content.greeting ? (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm text-center font-serif text-xl leading-9 text-[#6a7a6c] italic">
              {content.greeting}
            </p>
          </Reveal>
        ) : null,
      }}
    />
  );
}

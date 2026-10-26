"use client";

import { coupleNames, formatDateLong } from "@/lib/invitation";
import { Reveal, SafeImg } from "./shared";
import { InvitationLayout } from "./layout/InvitationLayout";
import { VERDANT_LAYOUT } from "./layout/presets/verdant";
import type { TemplateProps } from "./types";

/**
 * VERDANT GLASS — Glassmorphism & Nature. Deep emerald dengan
 * kartu frosted-glass (backdrop-blur), blob blur lembut, dan
 * tipografi serif ringan di atas warna gelap.
 */
export function VerdantGlassTemplate({
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
      config={VERDANT_LAYOUT}
      slots={{
        beforeContainer: (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-teal-300/10 blur-3xl"
            />
          </>
        ),
        hero: (
          <Reveal>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
              <p className="text-[11px] tracking-[0.4em] text-emerald-200/80 uppercase">
                The Wedding Of
              </p>
              <h2 className="mt-4 text-4xl leading-snug font-medium">{names}</h2>
              {eventDate && (
                <p className="mt-3 text-sm tracking-[0.2em] text-emerald-200/80 uppercase">
                  {formatDateLong(eventDate)}
                </p>
              )}
            </div>
          </Reveal>
        ),
        heroImage: (
          <Reveal delayMs={80}>
            <div className="mt-6 rounded-3xl border border-white/20 bg-white/10 p-3 backdrop-blur-xl">
              <SafeImg
                key={content.heroImage}
                src={content.heroImage}
                alt={title}
                fallbackLabel={title}
                className="aspect-[3/4] w-full rounded-2xl object-cover"
              />
            </div>
          </Reveal>
        ),
        quote: content.quote ? (
          <Reveal>
            <div className="mt-6 rounded-3xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur-lg">
              <p className="text-[15px] leading-8 text-emerald-50/90 italic">
                &ldquo;{content.quote}&rdquo;
              </p>
            </div>
          </Reveal>
        ) : null,
        beforeCouple: content.greeting ? (
          <Reveal>
            <p className="mx-auto mt-6 max-w-sm rounded-3xl border border-white/15 bg-white/5 px-6 py-4 text-center font-serif text-lg leading-8 text-emerald-50/90 italic backdrop-blur-lg">
              {content.greeting}
            </p>
          </Reveal>
        ) : null,
      }}
    />
  );
}

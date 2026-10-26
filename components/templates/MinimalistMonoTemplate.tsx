"use client";

import { coupleNames, formatDateLong } from "@/lib/invitation";
import { Reveal, SafeImg } from "./shared";
import { InvitationLayout } from "./layout/InvitationLayout";
import { MONO_LAYOUT } from "./layout/presets/mono";
import type { TemplateProps } from "./types";

/**
 * MINIMALIST MONO — Ultra Clean Typography. Charcoal & white,
 * hairline rules, daftar terstruktur — tanpa ornamen berlebih.
 */
export function MinimalistMonoTemplate({
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
      config={MONO_LAYOUT}
      slots={{
        hero: (
          <Reveal>
            <div>
              <p className="text-[11px] tracking-[0.3em] text-[#6a6a6a] uppercase">
                The Wedding Of
              </p>
              <h2 className="mt-3 text-4xl leading-tight font-medium tracking-tight">
                {names}
              </h2>
              {eventDate && (
                <p className="mt-3 text-sm text-[#6a6a6a]">
                  {formatDateLong(eventDate)}
                </p>
              )}
              <hr className="mt-6 border-[#e2e2e2]" />
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
              className="mt-8 aspect-[4/3] w-full object-cover"
            />
          </Reveal>
        ),
        quote: content.quote ? (
          <Reveal>
            <blockquote className="mt-8 border-l-2 border-[#1a1a1a] pl-4 text-[15px] leading-8 text-[#4a4a4a]">
              {content.quote}
            </blockquote>
          </Reveal>
        ) : null,
        beforeCouple: content.greeting ? (
          <p className="mt-8 border-l-2 border-[#1a1a1a] pl-4 text-sm leading-7 text-[#4a4a4a]">
            {content.greeting}
          </p>
        ) : null,
      }}
    />
  );
}

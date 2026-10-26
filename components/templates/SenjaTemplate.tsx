"use client";

import { Mountain } from "lucide-react";
import { coupleNames, resolveGreeting } from "@/lib/invitation";
import { BotanicalSprig } from "./parts";
import { Reveal, SafeImg } from "./shared";
import { InvitationLayout } from "./layout/InvitationLayout";
import { SENJA_LAYOUT } from "./layout/presets/senja";
import type { TemplateProps } from "./types";

/**
 * SENJA — Nature & Rustic. Olive, beige hangat, cokelat earthy;
 * hero foto alam full-bleed; editorial lapang. Tetap anggun
 * walau pengguna tidak punya foto landscape profesional.
 */
export function SenjaTemplate({
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
      config={SENJA_LAYOUT}
      slots={{
        beforeContainer: (
          <div className="relative">
            <SafeImg
              key={content.heroImage}
              src={content.heroImage}
              alt={title}
              fallbackLabel={title}
              className="aspect-[4/5] w-full bg-gradient-to-b from-[#4a5d3a] to-[#2c3324] object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-[#efe7d3]"
            />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-6 text-center">
              <Reveal>
                <p className="text-[11px] tracking-[0.4em] text-[#efe7d3]/90 uppercase drop-shadow">
                  The Wedding Of
                </p>
                <h2 className="mt-2 text-4xl leading-tight font-semibold text-white drop-shadow-lg">
                  {names}
                </h2>
              </Reveal>
            </div>
          </div>
        ),
        hero: (
          <Reveal>
            <div className="relative mx-auto max-w-sm text-center">
              <BotanicalSprig className="absolute -left-1 -top-2 h-24 w-7 text-[#4a5d3a]/40" />
              <BotanicalSprig className="absolute -right-1 -top-2 h-24 w-7 -scale-x-100 text-[#4a5d3a]/40" />
              {greeting && (
                <p className="text-[11px] tracking-[0.35em] text-[#6b5b3e] uppercase">
                  {greeting}
                </p>
              )}
              {content.quote && (
                <p className="mx-auto mt-4 text-[15px] leading-8 text-[#3f3a2c]/85 italic">
                  &ldquo;{content.quote}&rdquo;
                </p>
              )}
              <div
                aria-hidden
                className="mx-auto mt-5 flex max-w-44 items-center gap-2 text-[#6b5b3e]"
              >
                <Mountain className="h-4 w-4 shrink-0" />
                <span className="h-px flex-1 bg-[#6b5b3e]/50" />
                <Mountain className="h-4 w-4 shrink-0" />
              </div>
            </div>
          </Reveal>
        ),
      }}
    />
  );
}

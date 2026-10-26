"use client";

import { Sparkles } from "lucide-react";
import { coupleNames } from "@/lib/invitation";
import { Reveal, SafeImg } from "./shared";
import { InvitationLayout } from "./layout/InvitationLayout";
import { KALA_LAYOUT } from "./layout/presets/kala";
import type { TemplateProps } from "./types";

/**
 * KALA — Modern Playful. Terracotta, krem, peach, teal redup;
 * bentuk geometris ceria, sudut membulat besar, tetap profesional.
 */
export function KalaTemplate({
  title,
  content,
  guestName,
  rsvpSlot,
  defaultOpened,
}: TemplateProps) {
  const names = coupleNames(content);
  return (
    <InvitationLayout
      title={title}
      content={content}
      guestName={guestName}
      rsvpSlot={rsvpSlot}
      defaultOpened={defaultOpened}
      config={KALA_LAYOUT}
      slots={{
        background: (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="animate-float-slow absolute -top-10 -right-10 h-44 w-44 rounded-full bg-[#f2c9a8]/60" />
            <div className="absolute top-64 -left-14 h-40 w-40 rounded-[2.5rem] rotate-12 bg-[#9dbfb4]/40" />
            <div className="absolute right-6 bottom-96 h-16 w-16 rounded-full bg-[#c96f4a]/25" />
          </div>
        ),
        hero: (
          <Reveal>
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c96f4a]/15 px-4 py-1.5 text-xs font-bold text-[#c96f4a]">
                <Sparkles className="h-3.5 w-3.5" /> Kami Menikah!
              </span>
              <h2 className="mx-auto mt-4 max-w-xs text-4xl leading-tight font-extrabold tracking-tight text-[#3d2a1e]">
                {names}
              </h2>
              {content.quote && (
                <p className="mx-auto mt-4 max-w-xs rounded-3xl rounded-bl-lg bg-white px-5 py-4 text-sm leading-7 shadow-md shadow-[#c96f4a]/10">
                  &ldquo;{content.quote}&rdquo;
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
                className="absolute -inset-2 rotate-2 rounded-[2.5rem] bg-[#c96f4a]"
              />
              <div
                aria-hidden
                className="absolute -inset-2 -rotate-1 rounded-[2.5rem] bg-[#3f6b63]"
              />
              <SafeImg
                key={content.heroImage}
                src={content.heroImage}
                alt={title}
                fallbackLabel={title}
                className="relative aspect-[4/5] w-full rounded-[2rem] border-4 border-white object-cover shadow-xl"
              />
              <span className="absolute -top-3 -right-2 rotate-12 rounded-full bg-[#3f6b63] px-3 py-1.5 text-[11px] font-bold text-white shadow-lg">
                Save the Date ✓
              </span>
            </div>
          </Reveal>
        ),
        beforeCouple: content.greeting ? (
          <Reveal>
            <p className="mx-auto mt-6 w-fit -rotate-2 rounded-full bg-[#3f6b63] px-5 py-2 text-center text-xs font-bold text-white shadow-md">
              {content.greeting}
            </p>
          </Reveal>
        ) : null,
      }}
    />
  );
}

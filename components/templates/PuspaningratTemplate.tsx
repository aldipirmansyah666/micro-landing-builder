"use client";

import { coupleNames, resolveGreeting } from "@/lib/invitation";
import { Reveal, SafeImg } from "./shared";
import { KawungBand } from "./parts";
import { InvitationLayout } from "./layout/InvitationLayout";
import { PUSPANINGRAT_LAYOUT } from "./layout/presets/puspaningrat";
import type { TemplateProps } from "./types";

/**
 * PUSPANINGRAT — Traditional Modern Jawa. Krem hangat, cokelat sogan,
 * emas redup, pita motif kawung orisinal yang diterapkan secukupnya.
 */
export function PuspaningratTemplate({
  title,
  content,
  guestName,
  rsvpSlot,
  defaultOpened,
}: TemplateProps) {
  const names = coupleNames(content);
  const greeting = resolveGreeting(
    content.greeting,
    "Sugeng Rawuh · Assalamu'alaikum Wr. Wb."
  );
  return (
    <InvitationLayout
      title={title}
      content={content}
      guestName={guestName}
      rsvpSlot={rsvpSlot}
      defaultOpened={defaultOpened}
      config={PUSPANINGRAT_LAYOUT}
      slots={{
        beforeContainer: (
          <div aria-hidden className="h-16 overflow-hidden text-[#8a5a2b]/30">
            <KawungBand className="h-full w-full" />
          </div>
        ),
        afterContainer: (
          <div aria-hidden className="h-16 overflow-hidden text-[#8a5a2b]/30">
            <KawungBand className="h-full w-full" />
          </div>
        ),
        hero: (
          <>
            <Reveal>
              <div className="text-center">
                {greeting && (
                  <p className="text-[11px] tracking-[0.4em] text-[#8a5a2b] uppercase">
                    {greeting}
                  </p>
                )}
                {content.quote && (
                  <p className="mx-auto mt-4 max-w-sm rounded-xl border border-[#8a5a2b]/30 bg-[#fffdf6] px-5 py-4 text-sm leading-7 text-[#5c4a33] italic">
                    &ldquo;{content.quote}&rdquo;
                  </p>
                )}
              </div>
            </Reveal>
            <Reveal delayMs={80}>
              <div className="mt-8 text-center">
                <h2 className="text-4xl leading-tight font-semibold text-[#3a2c1c]">
                  {names}
                </h2>
                <div
                  aria-hidden
                  className="mx-auto mt-5 flex max-w-52 items-center gap-2 text-[#b08d3e]"
                >
                  <span className="h-px flex-1 bg-[#b08d3e]/60" />
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="10" cy="10" r="6" />
                    <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                  </svg>
                  <span className="h-px flex-1 bg-[#b08d3e]/60" />
                </div>
              </div>
            </Reveal>
          </>
        ),
        heroImage: (
          <Reveal>
            <div className="relative mx-auto mt-8 max-w-xs">
              <div
                aria-hidden
                className="absolute -inset-2 rounded-2xl border-2 border-[#8a5a2b]/50"
              />
              <div
                aria-hidden
                className="absolute -inset-3.5 rounded-2xl border border-[#b08d3e]/40"
              />
              <SafeImg
                key={content.heroImage}
                src={content.heroImage}
                alt={title}
                fallbackLabel={title}
                className="relative aspect-[3/4] w-full rounded-xl object-cover"
              />
            </div>
          </Reveal>
        ),
      }}
    />
  );
}

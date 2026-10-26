"use client";

import { coupleNames, resolveGreeting } from "@/lib/invitation";
import { coupleInitials } from "./parts";
import { Reveal, SafeImg } from "./shared";
import { InvitationLayout } from "./layout/InvitationLayout";
import { MAHARDIKA_LAYOUT } from "./layout/presets/mahardika";
import type { TemplateProps } from "./types";

/**
 * MAHARDIKA — Luxury Classic. Deep emerald + champagne gold yang
 * tenang, bingkai klasik ganda, monogram inisial, simetris formal.
 */
export function MahardikaTemplate({
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
      config={MAHARDIKA_LAYOUT}
      slots={{
        beforeContainer: (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 rounded-sm border border-[#c9a96a]/50"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-4 rounded-sm border border-[#c9a96a]/25"
            />
          </>
        ),
        hero: (
          <>
            <Reveal>
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#c9a96a]/70">
                  <span className="text-xl tracking-widest text-[#e8d5a3]">
                    {coupleInitials(content)}
                  </span>
                </div>
                {greeting && (
                  <p className="mt-5 text-[11px] tracking-[0.45em] text-[#c9a96a] uppercase">
                    {greeting}
                  </p>
                )}
                {content.quote && (
                  <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#f5efe0]/75 italic">
                    &ldquo;{content.quote}&rdquo;
                  </p>
                )}
              </div>
            </Reveal>
            <Reveal delayMs={80}>
              <div className="mt-8 text-center">
                <h2 className="text-4xl leading-tight font-semibold text-[#f2e7c9]">
                  {names}
                </h2>
                <div aria-hidden className="mx-auto mt-6 max-w-64">
                  <div className="h-px bg-[#c9a96a]/60" />
                  <p className="py-2 text-[10px] tracking-[0.5em] text-[#c9a96a]">
                    ◆ ◆ ◆
                  </p>
                  <div className="h-px bg-[#c9a96a]/60" />
                </div>
              </div>
            </Reveal>
          </>
        ),
        heroImage: (
          <Reveal>
            <SafeImg
              key={content.heroImage}
              src={content.heroImage}
              alt={title}
              fallbackLabel={title}
              className="mx-auto mt-8 aspect-[4/5] w-full border-2 border-[#c9a96a]/60 bg-[#123b31] object-cover p-1.5"
            />
          </Reveal>
        ),
      }}
    />
  );
}

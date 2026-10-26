"use client";

import { coupleNames, formatDateLong } from "@/lib/invitation";
import { Reveal, SafeImg } from "./shared";
import { InvitationLayout } from "./layout/InvitationLayout";
import { ELAN_LAYOUT } from "./layout/presets/elan";
import type { TemplateProps } from "./types";

/**
 * ÉLAN — Modern Editorial. Monokrom tegas, tipografi raksasa,
 * penomoran editorial, grid asimetris. Foto pengguna ditampilkan
 * apa adanya tanpa filter yang mengubah karakternya.
 */
export function ElanTemplate({
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
      config={ELAN_LAYOUT}
      slots={{
        hero: (
          <Reveal>
            <div className="flex items-baseline justify-between border-b-2 border-current pb-3">
              <p className="text-[11px] font-bold tracking-[0.3em] uppercase">
                Élan
              </p>
              <p className="text-[11px] tracking-[0.3em] text-current/60 uppercase">
                Wedding Edition
              </p>
            </div>
            <h2 className="mt-5 text-[2.9rem] leading-[0.95] font-black tracking-tight uppercase">
              {names}
            </h2>
            <p className="mt-3 text-xs tracking-[0.25em] text-current/60 uppercase">
              {content.akadDate
                ? formatDateLong(content.akadDate)
                : "Save the date"}
            </p>
          </Reveal>
        ),
        heroImage: (
          <Reveal delayMs={80}>
            <div className="mt-8 grid grid-cols-12 gap-3">
              <div className="col-span-8">
                <SafeImg
                  key={content.heroImage}
                  src={content.heroImage}
                  alt={title}
                  fallbackLabel={title}
                  className="aspect-[3/4] w-full bg-[#e4e4e4] object-cover dark:bg-[#222222]"
                />
              </div>
              <div className="col-span-4 flex flex-col justify-between border-l border-current/20 pl-3">
                <p className="text-[10px] leading-5 font-bold tracking-[0.2em] uppercase">
                  The
                  <br />
                  Wedding
                  <br />
                  Of
                </p>
                {content.quote && (
                  <p className="line-clamp-6 text-[11px] leading-5 text-current/70 italic">
                    &ldquo;{content.quote}&rdquo;
                  </p>
                )}
                <p className="text-[10px] tracking-[0.2em] text-current/50 uppercase">
                  Fig. 01
                </p>
              </div>
            </div>
          </Reveal>
        ),
        beforeCouple: content.greeting ? (
          <p className="mt-6 border-l-2 border-current pl-4 text-sm italic opacity-80">
            {content.greeting}
          </p>
        ) : null,
      }}
    />
  );
}

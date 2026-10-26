"use client";

import { coupleNames } from "@/lib/invitation";
import { Reveal, SafeImg } from "./shared";
import { EightPointStar } from "./parts";
import { InvitationLayout } from "./layout/InvitationLayout";
import { AZZAHRA_LAYOUT } from "./layout/presets/azzahra";
import type { TemplateProps } from "./types";

/**
 * AZZAHRA — Islamic Elegant. Teal pekat + ivory + emas redup,
 * pola geometris arabesque, bingkai lengkung ala mihrab.
 * Salam/doa memakai data quote pengguna apa adanya.
 */
export function AzzahraTemplate({
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
      config={AZZAHRA_LAYOUT}
      slots={{
        background: null,
        beforeContainer: (
          <div
            aria-hidden
            className="h-10 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #c2a164 0 1px, transparent 1px 12px), repeating-linear-gradient(-45deg, #c2a164 0 1px, transparent 1px 12px)",
              backgroundSize: "12px 12px",
            }}
          />
        ),
        afterContainer: (
          <div
            aria-hidden
            className="h-10 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #c2a164 0 1px, transparent 1px 12px), repeating-linear-gradient(-45deg, #c2a164 0 1px, transparent 1px 12px)",
              backgroundSize: "12px 12px",
            }}
          />
        ),
        hero: (
          <>
            <Reveal>
              <div className="text-center">
                <EightPointStar className="mx-auto h-10 w-10 text-[#c2a164]" />
              <p className="mt-3 text-[11px] tracking-[0.4em] text-[#c2a164] uppercase">
                Bismillahirrahmanirrahim
              </p>
                {content.quote && (
                  <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#f4efe3]/80 italic">
                    &ldquo;{content.quote}&rdquo;
                  </p>
                )}
              </div>
            </Reveal>
            <Reveal delayMs={80}>
              <div className="mt-8 text-center">
                <h2 className="text-4xl leading-tight font-semibold">{names}</h2>
                <div
                  aria-hidden
                  className="mt-5 flex items-center justify-center gap-3 text-[#c2a164]"
                >
                  <span className="h-px w-16 bg-[#c2a164]/60" />
                  <EightPointStar className="h-4 w-4" />
                  <span className="h-px w-16 bg-[#c2a164]/60" />
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
                className="absolute -inset-2 rounded-t-[9rem] rounded-b-2xl border-2 border-[#c2a164]/60"
              />
              <SafeImg
                key={content.heroImage}
                src={content.heroImage}
                alt={title}
                fallbackLabel={title}
                className="relative aspect-[3/4] w-full rounded-t-[8rem] rounded-b-xl border border-[#c2a164]/40 object-cover"
              />
            </div>
          </Reveal>
        ),
        beforeCouple: content.greeting ? (
          <Reveal>
            <p className="mx-auto mt-10 max-w-sm text-center font-serif text-xl leading-9 text-[#e8dcc3]/90 italic">
              {content.greeting}
            </p>
          </Reveal>
        ) : null,
      }}
    />
  );
}

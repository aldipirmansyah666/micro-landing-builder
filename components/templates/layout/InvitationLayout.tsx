"use client";

import { coupleNames } from "@/lib/invitation";
import { CoverOverlay, MusicToggle } from "../shared";
import { useInvitationState } from "../parts";
import type { TemplateProps } from "../types";
import {
  AccountsSection,
  CountdownSection,
  CoupleSection,
  EventSection,
  ExtraLinksSection,
  GallerySection,
  RsvpSection,
  StorySection,
} from "./sections";
import type {
  InvitationLayoutConfig,
  InvitationLayoutSlots,
} from "./types";

/**
 * `InvitationLayout` — kerangka UNIVERSAL untuk seluruh template katalog.
 *
 * SEBELUMNYA setiap template menulis ulang sendiri urutan section yang
 * sama: header → foto → quote → pasangan → cerita → countdown → acara →
 * galeri → rekening → RSVP → penutup. Yang berbeda antar template hanya
 * *class styling* dan beberapa blok yang memang khas (header, quote).
 *
 * Sekarang:
 *   - URUTAN section + logika data ditulis SATU KALI di sini dan di
 *     `sections.tsx`;
 *   - tiap template cukup supplying `config` (gaya) + `slots` (blok khas).
 *
 * Hasil render tetap identik dengan versi per-template sebelumnya karena
 * semua class datang dari `config` apa adanya (lihat `presets.ts`).
 */
export function InvitationLayout({
  content,
  guestName,
  rsvpSlot,
  defaultOpened,
  config,
  slots = {},
}: TemplateProps & {
  config: InvitationLayoutConfig;
  slots?: InvitationLayoutSlots;
}) {
  const { opened, open, muted, toggleMuted, audioRef, target } =
    useInvitationState(content, defaultOpened);
  const guest = guestName?.trim() || "Tamu Undangan";
  const names = coupleNames(content);

  return (
    <div className={config.root}>
      {content.backsoundUrl && (
        <audio ref={audioRef} src={content.backsoundUrl} loop preload="none" />
      )}
      {!opened && (
        <CoverOverlay
          key={content.heroImage}
          overlayClass={config.cover.overlayClass}
          titleFont={config.cover.titleFont}
          image={content.heroImage}
          kicker={config.cover.kicker}
          names={names}
          guest={guest}
          note={config.cover.note}
          buttonClass={config.cover.buttonClass}
          onOpen={open}
        />
      )}
      {opened && content.backsoundUrl && (
        <MusicToggle muted={muted} onToggle={toggleMuted} />
      )}

      <div className={config.container}>
        {slots.hero}
        {slots.heroImage}
        {slots.quote}

        <CoupleSection
          content={content}
          style={config.couple}
          leading={slots.coupleLeading}
        />

        <StorySection content={content} style={config.story} />

        <CountdownSection
          style={config.countdown}
          opened={opened}
          target={target}
        />

        <EventSection content={content} style={config.event} />

        <GallerySection content={content} style={config.gallery} />

        <AccountsSection content={content} style={config.accounts} />

        <ExtraLinksSection content={content} />

        <RsvpSection style={config.rsvp}>{rsvpSlot}</RsvpSection>

        {content.closingNote !== undefined ? (
          content.closingNote ? (
            <p className={config.closing.wrapper}>{content.closingNote}</p>
          ) : null
        ) : (
          <p className={config.closing.wrapper}>
            {config.closing.defaultText}
          </p>
        )}
        <p className={config.closing.names}>{names}</p>
      </div>
    </div>
  );
}

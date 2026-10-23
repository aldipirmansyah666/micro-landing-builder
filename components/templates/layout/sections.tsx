"use client";

import { CalendarDays, Gift, Images, MapPin } from "lucide-react";
import { formatDateLong, type InvitationContent } from "@/lib/invitation";
import { CopyRekeningButton, Reveal, SafeImg } from "../shared";
import {
  CountdownUnits,
  StoryTimeline,
  coupleEntries,
  eventEntries,
} from "../parts";
import type {
  AccountsSectionStyle,
  CountdownSectionStyle,
  CoupleSectionStyle,
  EventSectionStyle,
  GallerySectionStyle,
  RsvpSectionStyle,
  StorySectionStyle,
} from "./types";

/**
 * Section-section yang dipakai bersama seluruh template katalog.
 *
 * SEBELUMNYA logika data di blok-blok ini ditulis ulang di 18 file
 * template: `coupleEntries(content).filter(...).map(...)`,
 * `eventEntries(content).map(...)`, `content.galleryImages.map(...)`,
 * `content.accounts.map(...)`. Sekarang setiap iterasi itu hidup di satu
 * tempat; template hanya menentukan class styling-nya.
 *
 * SEMUA class yang dirender berasal dari prop `style` — komponen ini
 * tidak membawa warna bawaan, sehingga hasil render tetap identik
 * dengan versi per-template sebelum diekstrak.
 */

/** Blok pasangan (mempelai). */
export function CoupleSection({
  content,
  style,
  leading,
}: {
  content: InvitationContent;
  style: CoupleSectionStyle;
  leading?: React.ReactNode;
}) {
  return (
    <Reveal>
      {leading}
      <div className={style.list}>
        {coupleEntries(content)
          .filter((p) => p.nick || p.parents)
          .map((p) =>
            style.layout === "row" ? (
              <div key={p.key} className={style.item}>
                <div>
                  <p className={style.name}>{p.nick || "-"}</p>
                  {p.full && p.full !== p.nick && (
                    <p className={style.fullInRow ?? style.full}>{p.full}</p>
                  )}
                </div>
                {p.parents && (
                  <p className={style.parents}>
                    {p.label} {p.parents}
                  </p>
                )}
              </div>
            ) : (
              <div key={p.key} className={style.item}>
                <p className={style.name}>{p.nick || "-"}</p>
                {p.full && p.full !== p.nick && (
                  <p className={style.full}>{p.full}</p>
                )}
                {p.parents && (
                  <p className={style.parents}>
                    {p.label} {p.parents}
                  </p>
                )}
              </div>
            )
          )}
      </div>
    </Reveal>
  );
}

/** Timeline "Cerita Pasangan". */
export function StorySection({
  content,
  style,
}: {
  content: InvitationContent;
  style: StorySectionStyle;
}) {
  return (
    <StoryTimeline
      stories={content.stories}
      heading={style.heading}
      sectionClass={style.sectionClass}
      headingClass={style.headingClass}
      itemClass={style.itemClass}
      marker={style.marker}
      titleClass={style.titleClass}
      textClass={style.textClass}
    />
  );
}

/** Hitung mundur menuju hari acara. */
export function CountdownSection({
  style,
  opened,
  target,
}: {
  style: CountdownSectionStyle;
  opened: boolean;
  target: number | null;
}) {
  return (
    <Reveal>
      <div className={style.wrapper}>
        <p className={style.headingClass}>
          <CalendarDays className={style.headingIcon} />
          {` ${style.title}`}
        </p>
        <div className={style.grid}>
          <CountdownUnits
            target={target}
            opened={opened}
            boxClass={style.box}
            valueClass={style.value}
            labelClass={style.label}
            fallback={
              <p className={style.fallback}>
                {target ? style.passedText : style.pendingText}
              </p>
            }
          />
        </div>
      </div>
    </Reveal>
  );
}

/** Kartu acara (akad & resepsi). */
export function EventSection({
  content,
  style,
}: {
  content: InvitationContent;
  style: EventSectionStyle;
}) {
  return (
    <>
      {eventEntries(content).map((e) => (
        <Reveal key={e.key}>
          {style.layout === "rule" ? (
            <div className={style.item}>
              <div className={style.ruleHeader}>
                <p className={style.name}>{e.name}</p>
                {e.time && (
                  <p className={style.time}>
                    {style.timePrefix ?? ""}
                    {e.time}
                    {style.timeSuffix ?? ""}
                  </p>
                )}
              </div>
              <div className={style.ruleBody}>
                <p className={style.date}>{formatDateLong(e.date)}</p>
                {e.venue && (
                  <p className={style.venue}>
                    {style.venueIcon ? (
                      <MapPin className={style.venueIcon} />
                    ) : null}
                    {e.venue}
                  </p>
                )}
                {e.maps && (
                  <a
                    href={e.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={style.maps}
                  >
                    {style.mapsLabel}
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className={style.item}>
              {style.icon}
              <p className={style.name}>{e.name}</p>
              <p className={style.date}>{formatDateLong(e.date)}</p>
              {e.time && (
                <p className={style.time}>
                  {style.timePrefix ?? ""}
                  {e.time}
                  {style.timeSuffix ?? ""}
                </p>
              )}
              {e.venue && (
                <p className={style.venue}>
                  {style.venueIcon ? (
                    <MapPin className={style.venueIcon} />
                  ) : null}
                  {e.venue}
                </p>
              )}
              {e.maps && (
                <a
                  href={e.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={style.maps}
                >
                  {style.mapsLabel}
                </a>
              )}
            </div>
          )}
        </Reveal>
      ))}
    </>
  );
}

/** Galeri foto. */
export function GallerySection({
  content,
  style,
}: {
  content: InvitationContent;
  style: GallerySectionStyle;
}) {
  if (content.galleryImages.length === 0) return null;
  return (
    <Reveal>
      <div className={style.wrapper}>
        <p className={style.headingClass}>
          <Images className={style.headingIcon} />
          {` ${style.title}`}
        </p>
        <div className={style.grid}>
          {content.galleryImages.map((url) => (
            <SafeImg
              key={url}
              src={url}
              alt="Galeri"
              className={style.image}
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/** Amplop digital / rekening. */
export function AccountsSection({
  content,
  style,
}: {
  content: InvitationContent;
  style: AccountsSectionStyle;
}) {
  if (content.accounts.length === 0) return null;
  return (
    <Reveal>
      <div className={style.wrapper}>
        <p className={style.headingClass}>
          <Gift className={style.headingIcon} />
          {` ${style.title}`}
        </p>
        <div className={style.list}>
          {content.accounts.map((a, i) => (
            <div key={`${a.bank}-${a.number}-${i}`} className={style.item}>
              <p className={style.bank}>{a.bank || "Bank"}</p>
              <p className={style.number}>{a.number || "-"}</p>
              {a.holder && <p className={style.holder}>a.n. {a.holder}</p>}
              {a.number && (
                <div className={style.copyWrapper}>
                  <CopyRekeningButton
                    text={a.number}
                    buttonClass={style.copy}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/** Slot formulir RSVP. */
export function RsvpSection({
  style,
  children,
}: {
  style: RsvpSectionStyle;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <div className={style.wrapper}>
        <div className={style.inner}>{children}</div>
      </div>
    </Reveal>
  );
}

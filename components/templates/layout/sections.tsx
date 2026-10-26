"use client";

import { CalendarDays, ExternalLink, Gift, Images, MapPin, Music2, Radio, Sparkles } from "lucide-react";
import { formatDateLong, instagramHref, type InvitationContent } from "@/lib/invitation";
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
          .filter((p) => p.nick || p.parents || p.photo)
          .map((p) => {
            const instagram = instagramHref(p.instagram);
            const detail = (
              <>
                {p.childOrder && (
                  <p className={style.parents}>Anak ke-{p.childOrder}</p>
                )}
                {p.parents && (
                  <p className={style.parents}>
                    {p.label} {p.parents}
                  </p>
                )}
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${style.parents} inline-flex items-center gap-1 underline underline-offset-2`}
                  >
                    Instagram
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </>
            );
            return style.layout === "row" ? (
              <div key={p.key} className={style.item}>
                <div className="flex items-center gap-3">
                  {p.photo && (
                    <SafeImg
                      key={p.photo}
                      src={p.photo}
                      alt={p.nick || "Mempelai"}
                      fallbackLabel="Foto"
                      className="h-16 w-16 shrink-0 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className={style.name}>{p.nick || "-"}</p>
                    {p.full && p.full !== p.nick && (
                      <p className={style.fullInRow ?? style.full}>{p.full}</p>
                    )}
                  </div>
                </div>
                {detail}
              </div>
            ) : (
              <div key={p.key} className={style.item}>
                {p.photo && (
                  <SafeImg
                    key={p.photo}
                    src={p.photo}
                    alt={p.nick || "Mempelai"}
                    fallbackLabel="Foto"
                    className="mx-auto mb-4 h-28 w-28 rounded-full border border-[#c9a96a]/40 object-cover"
                  />
                )}
                <p className={style.name}>{p.nick || "-"}</p>
                {p.full && p.full !== p.nick && (
                  <p className={style.full}>{p.full}</p>
                )}
                {detail}
              </div>
            );
          })}
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
                    {e.timezone ? ` ${e.timezone}` : (style.timeSuffix ?? "")}
                  </p>
                )}
              </div>
              <div className={style.ruleBody}>
                <p className={style.date}>{formatDateLong(e.date)}</p>
                {e.dresscode && (
                  <p className={style.time}>Dresscode: {e.dresscode}</p>
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
                  {e.timezone ? ` ${e.timezone}` : (style.timeSuffix ?? "")}
                </p>
              )}
              {e.dresscode && (
                <p className={style.time}>Dresscode: {e.dresscode}</p>
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

/** Galeri foto & video. */
export function GallerySection({
  content,
  style,
}: {
  content: InvitationContent;
  style: GallerySectionStyle;
}) {
  if (content.galleryImages.length === 0 && content.galleryVideos.length === 0) {
    return null;
  }
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
          {content.galleryVideos.map((url) => (
            <video
              key={url}
              src={url}
              controls
              playsInline
              preload="metadata"
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
  if (content.accounts.length === 0 && !content.giftAddress) return null;
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
              <p className={style.bank}>
                {a.bank || "Bank"}
                {a.kind === "ewallet" ? " • E-Wallet" : ""}
              </p>
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
          {content.giftAddress && (
            <div className={style.item}>
              <p className={style.bank}>Kirim Kado Fisik</p>
              <p className={style.holder}>{content.giftAddress}</p>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

/** Link live streaming, filter Instagram, dan request musik. */
export function ExtraLinksSection({
  content,
}: {
  content: InvitationContent;
}) {
  const links = [
    { href: content.liveStreamUrl, label: "Live Streaming", icon: <Radio className="h-4 w-4" /> },
    { href: content.igFilterUrl, label: "IG Filter", icon: <Sparkles className="h-4 w-4" /> },
    { href: content.musicRequestUrl, label: "Request Musik", icon: <Music2 className="h-4 w-4" /> },
  ].filter((l) => l.href !== "");
  if (links.length === 0) return null;
  return (
    <Reveal>
      <div className="mt-12 border-t border-[#c9a96a]/40 pt-8 text-center">
        <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.25em] text-[#9a8a5f] uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          Tautan Acara
        </p>
        <div className="mt-5 grid gap-2">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#3d3a34] px-6 font-sans text-sm font-medium transition-colors hover:bg-[#3d3a34] hover:text-white"
            >
              {l.icon}
              {l.label}
            </a>
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

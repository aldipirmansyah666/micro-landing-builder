"use client";

import {
  CalendarDays,
  ExternalLink,
  Gift,
  Images,
  MapPin,
  Music2,
  Radio,
  Sparkles,
} from "lucide-react";
import {
  formatDateLong,
  instagramHandle,
  instagramHref,
  type InvitationContent,
} from "@/lib/invitation";
import { CopyRekeningButton, Reveal, SafeImg } from "../shared";
import {
  CountdownUnits,
  StoryTimeline,
  coupleEntries,
  coupleFamilyLine,
  eventEntries,
} from "../parts";
import type { CoupleEntry } from "../parts";
import type {
  AccountsSectionStyle,
  CountdownSectionStyle,
  CoupleSectionStyle,
  EventSectionStyle,
  ExtraLinksSectionStyle,
  GallerySectionStyle,
  RsvpSectionStyle,
  StorySectionStyle,
  StyleClass,
} from "./types";

function resolveClass<T>(
  value: StyleClass<T>,
  entry: T,
  index: number,
  total: number
): string {
  return typeof value === "function" ? value(entry, index, total) : value;
}

function coupleDetail(
  entry: CoupleEntry,
  style: CoupleSectionStyle,
  includeParents: boolean,
  index: number,
  total: number
): React.ReactNode {
  const instagram = instagramHref(entry.instagram);
  const instagramLabel = instagramHandle(entry.instagram);
  const parentsClass = resolveClass(style.parents, entry, index, total);
  const instagramClass = style.instagramClass ?? parentsClass;
  const family = coupleFamilyLine(entry, {
    includeParents,
    includeLabel: style.parentsIncludeLabel !== false,
  });
  return (
    <>
      {family && <p className={parentsClass}>{family}</p>}
      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={`${instagramClass} inline-flex items-center gap-1 underline underline-offset-2`}
        >
          {instagramLabel || "Instagram"}
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </>
  );
}

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
  const entries = coupleEntries(content).filter(
    (p) =>
      p.nick ||
      p.parents ||
      p.childOrder ||
      p.photo ||
      instagramHref(p.instagram)
  );
  const total = entries.length;

  const items = entries.map((p, index) => {
          const itemClass = resolveClass(style.item, p, index, total);
          const nameClass = resolveClass(style.name, p, index, total);
          const parentsClass = resolveClass(style.parents, p, index, total);
          // Judul kartu = NAMA LENGKAP mempelai; nama panggilan hanya
          // dipakai bila nama lengkap belum diisi.
          const displayName = p.full || p.nick || "-";
          const photo = p.photo ? (
            <SafeImg
              key={p.photo}
              src={p.photo}
              alt={p.nick || "Mempelai"}
              fallbackLabel="Foto"
              className={style.photoClass ?? "mx-auto mb-4 h-28 w-28 rounded-full object-cover"}
            />
          ) : null;

          if (style.layout === "row") {
            const instagram = instagramHref(p.instagram);
            const instagramLabel = instagramHandle(p.instagram);
            const instagramClass = style.instagramClass ?? parentsClass;
            const family = coupleFamilyLine(p, {
              includeLabel: style.parentsIncludeLabel !== false,
            });
            return (
              <div key={p.key} className={itemClass || undefined}>
                <div className="flex items-center gap-3">
                  {p.photo && (
                    <SafeImg
                      key={p.photo}
                      src={p.photo}
                      alt={p.nick || "Mempelai"}
                      fallbackLabel="Foto"
                      className={style.rowPhotoClass ?? "h-16 w-16 shrink-0 rounded-full object-cover"}
                    />
                  )}
                  <div>
                    <p className={nameClass}>{displayName}</p>
                  </div>
                </div>
                {family && <p className={parentsClass}>{family}</p>}
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${instagramClass} inline-flex items-center gap-1 underline underline-offset-2`}
                  >
                    {instagramLabel || "Instagram"}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            );
          }

          if (style.layout === "between") {
            const between = style.between;
            const family = coupleFamilyLine(p, {
              includeLabel: style.parentsIncludeLabel !== false,
            });
            return (
              <div key={p.key} className={itemClass || undefined}>
                <div className={between?.nameWrap || undefined}>
                  {photo}
                  <p className={nameClass}>{displayName}</p>
                  {instagramHref(p.instagram) && (
                    <a
                      href={instagramHref(p.instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${style.instagramClass ?? parentsClass} inline-flex items-center gap-1 underline underline-offset-2`}
                    >
                      {instagramHandle(p.instagram) || "Instagram"}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                {family && <p className={between?.parents}>{family}</p>}
              </div>
            );
          }

          if (style.layout === "editorial") {
            const editorial = style.editorial;
            return (
              <div key={p.key} className={itemClass || undefined}>
                {photo}
                <div className={editorial?.wrapper}>
                  <p className={editorial?.indexClass}>
                    {editorial?.indexFormat
                      ? editorial.indexFormat(index)
                      : `0${index + 1}`}
                  </p>
                  <div className={editorial?.nameWrap}>
                    <p className={nameClass}>{displayName}</p>
                    {coupleDetail(p, style, true, index, total)}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={p.key} className={itemClass || undefined}>
              {photo}
              <p className={nameClass}>{displayName}</p>
              {coupleDetail(p, style, true, index, total)}
            </div>
          );
  });

  if (style.revealItems) {
    return (
      <>
        {leading}
        {style.heading}
        {items.map((item, i) => (
          <Reveal key={entries[i].key}>{item}</Reveal>
        ))}
      </>
    );
  }

  const body = (
    <>
      {!style.headingInsideList && style.heading}
      {style.list ? (
        <div className={style.list}>
          {style.headingInsideList && style.heading}
          {items}
        </div>
      ) : (
        items
      )}
    </>
  );

  return (
    <Reveal>
      {leading}
      {style.wrapper ? <div className={style.wrapper}>{body}</div> : body}
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
        {style.heading ?? (
          <p className={style.headingClass}>
            <CalendarDays className={style.headingIcon} />
            {` ${style.title}`}
          </p>
        )}
        <div className={style.grid}>
          <CountdownUnits
            target={target}
            opened={opened}
            boxClass={style.box}
            valueClass={style.value}
            labelClass={style.label}
            labels={style.labels}
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
  const events = eventEntries(content);

  return (
    <>
      {events.map((e, index) => {
        const itemClass = resolveClass(style.item, e, index, events.length);
        const time = e.time ? (
          <p className={style.time}>
            {style.timePrefix ?? ""}
            {e.time}
            {e.timezone ? ` ${e.timezone}` : (style.timeSuffix ?? "")}
          </p>
        ) : null;
        const dresscode = e.dresscode ? (
          <p className={style.time}>Dresscode: {e.dresscode}</p>
        ) : null;
        const date = <p className={style.date}>{formatDateLong(e.date)}</p>;
        const venue = e.venue ? (
          <p className={style.venue}>
            {style.venueIcon ? <MapPin className={style.venueIcon} /> : null}
            {e.venue}
          </p>
        ) : null;
        const maps = e.maps ? (
          <a
            href={e.maps}
            target="_blank"
            rel="noopener noreferrer"
            className={style.maps}
          >
            {style.mapsIcon ? (
              style.mapsIconPosition === "after" ? (
                <>
                  {style.mapsLabel} {style.mapsIcon}
                </>
              ) : (
                <>
                  {style.mapsIcon} {style.mapsLabel}
                </>
              )
            ) : (
              style.mapsLabel
            )}
          </a>
        ) : null;
        const name = (
          <p className={style.name}>
            {style.nameFormat ? style.nameFormat(e, index) : e.name}
          </p>
        );
        const cardBody = (
          <>
            {style.icon}
            {name}
            {style.nameDivider}
            {date}
            {time}
            {dresscode}
            {venue}
            {maps}
          </>
        );

        if (style.layout === "rule") {
          return (
            <Reveal key={e.key}>
              <div className={itemClass}>
                <div className={style.header}>
                  {name}
                  {time}
                </div>
                <div className={style.body}>
                  {date}
                  {dresscode}
                  {venue}
                  {maps}
                </div>
              </div>
            </Reveal>
          );
        }

        if (style.layout === "split") {
          return (
            <Reveal key={e.key}>
              <div className={itemClass}>
                <div className={style.header}>{name}</div>
                <div className={style.body}>
                  {date}
                  {time}
                  {dresscode}
                  {venue}
                  {maps}
                </div>
              </div>
            </Reveal>
          );
        }

        if (style.layout === "numbered") {
          return (
            <Reveal key={e.key}>
              <div className={itemClass}>
                <p className={style.header}>
                  {style.headerIndexFormat
                    ? style.headerIndexFormat(index)
                    : `0${index + 1}`}{" "}
                  / {e.name} {style.headerIcon}
                </p>
                <div className={style.body}>
                  {date}
                  {time}
                  {dresscode}
                  {venue}
                  {maps}
                </div>
              </div>
            </Reveal>
          );
        }

        if (style.layout === "mono") {
          return (
            <Reveal key={e.key}>
              <div className={itemClass}>
                <div className={style.header}>
                  {name}
                  {time}
                </div>
                <div className={style.body}>
                  {date}
                  {dresscode}
                  {venue}
                  {maps}
                </div>
              </div>
            </Reveal>
          );
        }

        return (
          <Reveal key={e.key}>
            <div className={itemClass}>
              {style.inner ? <div className={style.inner}>{cardBody}</div> : cardBody}
            </div>
          </Reveal>
        );
      })}
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
  const total = content.galleryImages.length + content.galleryVideos.length;
  if (total === 0) return null;
  const heading =
    typeof style.heading === "function" ? style.heading(total) : style.heading;
  return (
    <Reveal>
      <div className={style.wrapper}>
        {heading ?? (
          <p className={style.headingClass}>
            <Images className={style.headingIcon} />
            {` ${style.title}`}
          </p>
        )}
        <div className={style.grid}>
          {content.galleryImages.map((url, index) => (
            <SafeImg
              key={url}
              src={url}
              alt={style.altFormat ? style.altFormat(index) : "Galeri"}
              className={resolveClass(style.image, url, index, total)}
            />
          ))}
          {content.galleryVideos.map((url, index) => (
            <video
              key={url}
              src={url}
              controls
              playsInline
              preload="metadata"
              className={resolveClass(
                style.image,
                url,
                content.galleryImages.length + index,
                total
              )}
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
        {style.heading ?? (
          <p className={style.headingClass}>
            <Gift className={style.headingIcon} />
            {` ${style.title}`}
          </p>
        )}
        <div className={style.list}>
          {content.accounts.map((a, i) => {
            const detail = (
              <>
                <p className={style.bank}>
                  {a.bank || "Bank"}
                  {a.kind === "ewallet" ? " • E-Wallet" : ""}
                </p>
                <p className={style.number}>{a.number || "-"}</p>
                {a.holder && <p className={style.holder}>a.n. {a.holder}</p>}
              </>
            );
            return (
              <div key={`${a.bank}-${a.number}-${i}`} className={style.item}>
                {style.layout === "row" ? (
                  <div className={style.contentClass}>{detail}</div>
                ) : (
                  detail
                )}
                {a.number &&
                  (style.copyWrapper ? (
                    <div className={style.copyWrapper}>
                      <CopyRekeningButton
                        text={a.number}
                        buttonClass={style.copy}
                      />
                    </div>
                  ) : (
                    <CopyRekeningButton
                      text={a.number}
                      buttonClass={style.copy}
                    />
                  ))}
              </div>
            );
          })}
          {content.giftAddress && (
            <div className={style.item}>
              <p className={style.bank}>
                {style.giftLabel ?? "Kirim Kado Fisik"}
              </p>
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
  style,
}: {
  content: InvitationContent;
  style: ExtraLinksSectionStyle;
}) {
  const iconClass = style.iconClass ?? "h-4 w-4";
  const links = [
    {
      href: content.liveStreamUrl,
      label: "Live Streaming",
      icon: <Radio className={iconClass} />,
    },
    {
      href: content.igFilterUrl,
      label: "IG Filter",
      icon: <Sparkles className={iconClass} />,
    },
    {
      href: content.musicRequestUrl,
      label: "Request Musik",
      icon: <Music2 className={iconClass} />,
    },
  ].filter((l) => l.href !== "");
  if (links.length === 0) return null;
  return (
    <Reveal>
      <div className={style.wrapper}>
        {style.heading ?? (
          <p className="flex items-center justify-center gap-2 text-[11px] tracking-[0.25em] text-[#9a8a5f] uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Tautan Acara
          </p>
        )}
        <div className={style.grid}>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={style.link}
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
        {style.heading}
        {style.inner ? <div className={style.inner}>{children}</div> : children}
      </div>
    </Reveal>
  );
}

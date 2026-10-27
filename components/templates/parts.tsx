"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { composeParents, dayNameFromDate, eventTimestamp, type InvitationContent, type StoryEntry } from "@/lib/invitation";
import { Reveal, useCountdown, useCoverOpened } from "./shared";
/**
 * State bersama seluruh template katalog baru: cover, audio backsound
 * (tidak autoplay — hanya setelah "Buka Undangan" diklik), dan target
 * countdown. Business logic cukup ditulis sekali di sini.
 */
export function useInvitationState(
  content: InvitationContent,
  defaultOpened?: boolean
) {
  const [opened, setOpened] = useCoverOpened(defaultOpened);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const target = useMemo(() => eventTimestamp(content), [content]);
  const open = useCallback(() => {
    setOpened(true);
    audioRef.current?.play().catch(() => {});
  }, [setOpened]);
  const toggleMuted = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  }, []);
  return { opened, open, muted, toggleMuted, audioRef, target };
}

export interface CoupleEntry {
  key: string;
  nick: string;
  full: string;
  parents: string;
  childOrder: string;
  instagram: string;
  photo: string;
  label: string;
}

/** Baris mempelai yang terisi saja (kosong → disaring pemanggil). */
export function coupleEntries(content: InvitationContent): CoupleEntry[] {
  const groom: CoupleEntry = {
    key: "groom",
    nick: content.groomNickname || content.groomFullName,
    full: content.groomFullName,
    parents: composeParents(content.groomFatherName, content.groomMotherName),
    childOrder: content.groomChildOrder,
    instagram: content.groomInstagram,
    photo: content.groomPhoto,
    label: "Putra dari",
  };
  const bride: CoupleEntry = {
    key: "bride",
    nick: content.brideNickname || content.brideFullName,
    full: content.brideFullName,
    parents: composeParents(content.brideFatherName, content.brideMotherName),
    childOrder: content.brideChildOrder,
    instagram: content.brideInstagram,
    photo: content.bridePhoto,
    label: "Putri dari",
  };
  return content.coupleOrder === "groomFirst" ? [groom, bride] : [bride, groom];
}

export interface CoupleFamilyOptions {
  /** Sertakan baris orang tua (bila false, hanya urutan anak yang tampil). */
  includeParents?: boolean;
  /**
   * Sertakan label gender ("Putra"/"Putri") dalam frasa keterangan
   * keluarga. Default true; false → frasa netral ("Anak ke-8 dari ...").
   */
  includeLabel?: boolean;
}

/**
 * Satu baris informasi keluarga yang digabung menjadi kalimat natural
 * (bukan lagi dua baris kaku "Anak ke-X" dan "Putra dari ..."):
 *
 * - anak + orang tua → `Putra ke-8 dari Bpk. Haryono & Ibu Sulastri`
 * - hanya anak       → `Putra ke-8`
 * - hanya orang tua  → `Putra dari Bpk. Haryono & Ibu Sulastri`
 *                      (tanpa label gender bila `includeLabel` false)
 * - keduanya kosong  → `""` (pemanggil melewati render)
 *
 * Label gender ("Putra"/"Putri") menjadi bagian dari frasa sehingga satu
 * baris keterangan berdiri sendiri di bawah nama mempelai — tanpa label
 * terpisah yang dulu dirender di atas nama.
 */
export function coupleFamilyLine(
  entry: Pick<CoupleEntry, "childOrder" | "parents" | "label">,
  options: CoupleFamilyOptions = {}
): string {
  const { includeParents = true, includeLabel = true } = options;
  const child = entry.childOrder.trim();
  const parents = includeParents ? entry.parents.trim() : "";
  // "Putra dari" / "Putri dari" → "Putra" / "Putri" (kata kerja frasanya "ke-"/"dari").
  const who = entry.label.replace(/\s+dari$/, "");
  if (child && parents) {
    return includeLabel ? `${who} ke-${child} dari ${parents}` : `Anak ke-${child} dari ${parents}`;
  }
  if (child) return includeLabel ? `${who} ke-${child}` : `Anak ke-${child}`;
  if (parents) return includeLabel ? `${entry.label} ${parents}` : parents;
  return "";
}

export interface EventEntry {
  key: string;
  name: string;
  date: string;
  time: string;
  timezone: string;
  day: string;
  venue: string;
  maps: string;
  dresscode: string;
}

/**
 * Daftar acara untuk ditampilkan (Akad, Resepsi, dan acara tambahan).
 *
 * Prioritas: `content.events` (array dinamis hasil `migrateLegacyEvents`,
 * yang juga mengisi otomatis dari field legacy `akad*`/`reception*`).
 * Baru fallback eksplisit ke `content.akad*`/`content.reception*` bila
 * `events` tidak tersedia (mis. konten yang belum melewati
 * `toInvitationContent`).
 *
 * `akadName`/`receptionName` memungkinkan tiap template memakai label
 * khas mereka (mis. "Akad Nikah 💍") tanpa mengubah data tersimpan.
 * Acara non-akad/reception memakai `title` dari entri (fallback "Acara").
 */
export function eventEntries(
  content: InvitationContent,
  akadName = "Akad Nikah",
  receptionName = "Resepsi"
): EventEntry[] {
  const fromLegacy = (
    prefix: "akad" | "reception",
    name: string
  ): EventEntry => ({
    key: prefix,
    name,
    date: prefix === "akad" ? content.akadDate : content.receptionDate,
    time: prefix === "akad" ? content.akadTime : content.receptionTime,
    timezone:
      prefix === "akad" ? content.akadTimezone : content.receptionTimezone,
    day: dayNameFromDate(
      prefix === "akad" ? content.akadDate : content.receptionDate
    ),
    venue: prefix === "akad" ? content.akadVenue : content.receptionVenue,
    maps: prefix === "akad" ? content.akadMapsUrl : content.receptionMapsUrl,
    dresscode:
      prefix === "akad" ? content.akadDresscode : content.receptionDresscode,
  });

  // Jalur 1: array dinamis (mencakup migrasi otomatis dari legacy).
  if (content.events && content.events.length > 0) {
    return content.events
      .filter((e) => e.date || e.time || e.venue)
      .map((e) => ({
        key: e.id,
        // Akad/Resepsi tetap memakai label template agar tampilan tidak
        // berubah untuk data lama; acara lain memakai judul entri.
        name:
          e.kind === "akad"
            ? akadName
            : e.kind === "reception"
              ? receptionName
              : e.title || "Acara",
        date: e.date,
        time: e.time,
        timezone: e.timezone,
        day: e.dayLabel || dayNameFromDate(e.date),
        venue: e.venue,
        maps: e.mapsUrl,
        dresscode: e.dresscode,
      }));
  }

  // Jalur 2: fallback legacy (tanpa array events).
  return [
    fromLegacy("akad", akadName),
    fromLegacy("reception", receptionName),
  ].filter((e) => e.date || e.time || e.venue);
}

/** Inisial monogram, mis. "Y & A". Aman bila nama kosong. */
export function coupleInitials(content: InvitationContent): string {
  const g = (content.groomNickname || content.groomFullName).trim().charAt(0);
  const b = (content.brideNickname || content.brideFullName).trim().charAt(0);
  if (g && b) return `${g.toUpperCase()} & ${b.toUpperCase()}`;
  return g ? g.toUpperCase() : b ? b.toUpperCase() : "&";
}

export interface CountdownLabels {
  days: string;
  hours: string;
  mins: string;
  secs: string;
}

/**
 * Konteks pajangan statis: bungkus pohon thumbnail katalog/landing dengan
 * <StaticPreview> agar countdown di dalamnya tidak menjalankan timer
 * setInterval 1 detik — menghemat puluhan timer per halaman.
 * Render fallback (teks tanggal) tanpa mismatch hidrasi.
 */
const StaticPreviewContext = createContext(false);

export function StaticPreview({ children }: { children: React.ReactNode }) {
  return (
    <StaticPreviewContext.Provider value={true}>
      {children}
    </StaticPreviewContext.Provider>
  );
}

/**
 * Kotak countdown generik — tiap template mengatur tampilannya
 * lewat className. Null (tanggal kosong) → fallback, bukan error.
 */
export function CountdownUnits({
  target,
  opened,
  boxClass,
  valueClass,
  labelClass,
  labels = { days: "Hari", hours: "Jam", mins: "Menit", secs: "Detik" },
  fallback,
  staticPreview = false,
}: {
  target: number | null;
  opened: boolean;
  boxClass: string;
  valueClass: string;
  labelClass: string;
  labels?: CountdownLabels;
  fallback: React.ReactNode;
  /**
   * Bila true (atau di dalam <StaticPreview>), timer tidak berjalan —
   * untuk thumbnail katalog/landing yang hanya pajangan.
   */
  staticPreview?: boolean;
}) {
  const forcedStatic = useContext(StaticPreviewContext);
  // `useCountdown` mengembalikan null sebelum mount (aman prerender &
  // tanpa hydration mismatch), sehingga render awal selalu fallback —
  // konsisten antara server dan client.
  const countdown = useCountdown(target, opened && !staticPreview && !forcedStatic);
  if (!countdown || countdown.passed) return <>{fallback}</>;
  const units = [
    { v: countdown.days, l: labels.days },
    { v: countdown.hours, l: labels.hours },
    { v: countdown.mins, l: labels.mins },
    { v: countdown.secs, l: labels.secs },
  ];
  return (
    <>
      {units.map((u) => (
        <div key={u.l} className={boxClass}>
          <p className={`tabular-nums ${valueClass}`}>{u.v}</p>
          <p className={labelClass}>{u.l}</p>
        </div>
      ))}
    </>
  );
}

/** Pita motif kawung (Jawa) sebagai SVG orisinal — tanpa aset eksternal. */
export function KawungBand({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="kawung" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="24" cy="24" r="15" fill="none" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="9" fill="none" strokeWidth="1" />
          <circle cx="24" cy="24" r="2.5" />
          <circle cx="0" cy="0" r="10" fill="none" strokeWidth="1" />
          <circle cx="48" cy="0" r="10" fill="none" strokeWidth="1" />
          <circle cx="0" cy="48" r="10" fill="none" strokeWidth="1" />
          <circle cx="48" cy="48" r="10" fill="none" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kawung)" />
    </svg>
  );
}

/** Bintang delapan (khatam) untuk ornamen Islamic — SVG orisinal. */
export function EightPointStar({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={className} fill="none">
      <rect
        x="9"
        y="9"
        width="22"
        height="22"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="9"
        y="9"
        width="22"
        height="22"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(45 20 20)"
      />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
    </svg>
  );
}

/** Ranting botanical tipis — SVG orisinal untuk aksen floral/nature. */
export function BotanicalSprig({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 60 120"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M30 115 C30 80 30 45 30 8" />
      <path d="M30 90 C20 85 12 78 8 66 C20 68 28 76 30 90" />
      <path d="M30 90 C40 85 48 78 52 66 C40 68 32 76 30 90" />
      <path d="M30 62 C22 58 16 52 13 42 C22 44 28 50 30 62" />
      <path d="M30 62 C38 58 44 52 47 42 C38 44 32 50 30 62" />
      <path d="M30 36 C24 32 20 27 18 20 C24 21 28 26 30 36" />
      <path d="M30 36 C36 32 40 27 42 20 C36 21 32 26 30 36" />
      <circle cx="30" cy="8" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Timeline "Cerita Pasangan" — dipakai HANYA template flagship
 * (Aruna, Blossom Sage, Mahardika). Gaya visual diwariskan lewat
 * className agar tiap template tetap khas. Daftar kosong → null
 * (section tidak tampil). Teks user dirender sebagai teks polos
 * (React escape otomatis — tanpa HTML mentah).
 */
export function StoryTimeline({
  stories,
  heading,
  sectionClass,
  headingClass,
  itemClass,
  marker,
  titleClass,
  textClass,
}: {
  stories: StoryEntry[] | undefined;
  heading: string;
  sectionClass: string;
  headingClass: string;
  itemClass: string;
  marker: React.ReactNode;
  titleClass: string;
  textClass: string;
}) {
  const visible = (stories ?? []).filter((s) => s.title || s.text);
  if (visible.length === 0) return null;
  return (
    <Reveal>
      <div className={sectionClass}>
        <p className={headingClass}>{heading}</p>
        <div className="mt-6 space-y-5">
          {visible.map((s, i) => (
            <div key={i} className={itemClass}>
              {marker}
              <p className={titleClass}>{s.title || `Cerita ${i + 1}`}</p>
              {s.text && <p className={textClass}>{s.text}</p>}
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

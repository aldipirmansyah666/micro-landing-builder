"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  ImageIcon,
  MailOpen,
  Music,
  VolumeX,
} from "lucide-react";

/**
 * Bungkus seksi agar fade-in + naik halus saat masuk viewport.
 * Berbasis IntersectionObserver sekali jalan (hemat render),
 * aman untuk SSR (render awal tersembunyi via opacity-0).
 */
export function Reveal({
  children,
  className,
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fallback sinkron sekali jalan bila browser tanpa IntersectionObserver
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/** Pembatas artistik: garis — ornamen — garis. Warna via className. */
export function OrnateDivider({
  lineClass = "bg-current",
  ornament = "◆",
  className,
}: {
  lineClass?: string;
  ornament?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`flex items-center gap-3 opacity-60 ${className ?? ""}`}
    >
      <span className={`h-px flex-1 ${lineClass}`} />
      <span className="text-[10px] leading-none">{ornament}</span>
      <span className={`h-px flex-1 ${lineClass}`} />
    </div>
  );
}

/** Judul seksi terstandar: kicker kecil + ikon opsional, hirarki jelas. */
export function SectionHeading({
  kicker,
  icon,
  className,
}: {
  kicker: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center justify-center gap-2 text-[11px] font-medium tracking-[0.25em] uppercase ${className ?? ""}`}
    >
      {icon}
      {kicker}
    </p>
  );
}

export interface Countdown {
  passed: boolean;
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

/**
 * State "cover sudah dibuka" yang mengikuti prop `defaultOpened`.
 *
 * Memakai pola "adjust state when a prop changes" yang direkomendasikan
 * React: ketika `defaultOpened` berubah, `opened` langsung disinkronkan
 * SAAT RENDER — bukan lewat `useEffect`. React membuang render yang
 * basi dan mengulang render sebelum commit, jadi tidak ada frame
 * kedipan dengan nilai lama.
 *
 * Kenapa bukan `useEffect`? `useEffect` memunculkan satu render dengan
 * nilai lama terlebih dulu (kedipan) dan menambah satu lint rule yang
 * harus di-disable.
 *
 * Tujuannya: builder dapat membuka/menutup cover tanpa me-remount
 * seluruh pohon template. Sebelumnya cover toggle dilakukan lewat
 * `key` pada `<InvitationTemplate>`, yang destroying & membuat ulang
 * seluruh DOM — termasuk `<img>` (decode ulang) dan seluruh
 * IntersectionObserver milik `Reveal`.
 */
export function useCoverOpened(
  defaultOpened?: boolean
): [boolean, (value: boolean) => void] {
  const [opened, setOpened] = useState(defaultOpened ?? false);
  const [lastDefault, setLastDefault] = useState(defaultOpened);
  if (defaultOpened !== lastDefault) {
    setLastDefault(defaultOpened);
    setOpened(defaultOpened ?? false);
  }
  return [opened, setOpened];
}

/** Countdown yang hanya berjalan setelah undangan dibuka (hemat render). */
export function useCountdown(
  target: number | null,
  active: boolean
): Countdown | null {
  // `now` diisi di dalam effect (bukan initializer) agar aman untuk
  // prerender statis (Next menolak Date.now() saat prerender) sekaligus
  // menghindari hydration mismatch: SSR & render awal = null (fallback).
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- inisialisasi waktu sekali setelah mount: wajib di effect agar aman prerender & tanpa hydration mismatch
    setNow(Date.now());
    if (!target || !active) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [target, active]);
  return useMemo(() => {
    if (!target || now === null) return null;
    const diff = target - now;
    if (diff <= 0) return { passed: true, days: 0, hours: 0, mins: 0, secs: 0 };
    return {
      passed: false,
      days: Math.floor(diff / 86400000),
      hours: Math.floor(diff / 3600000) % 24,
      mins: Math.floor(diff / 60000) % 60,
      secs: Math.floor(diff / 1000) % 60,
    };
  }, [target, now]);
}

/**
 * Tag <img> biasa (tanpa optimasi Next) dengan fallback otomatis:
 * bila URL kosong atau gambar gagal dimuat, tampilkan placeholder.
 */
export function SafeImg({
  src,
  alt,
  className,
  fallbackLabel,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}) {
  const [failed, setFailed] = useState(false);
  // Reset status gagal setiap src berganti (pola "adjusting state during
  // render" resmi React): kegagalan transient (jaringan tersendat, throttle)
  // pada URL lama tidak boleh menahan URL baru yang valid. Key={src} di
  // pemanggil sudah me-remount, ini pertahanan lapis kedua bila key lupa.
  const [prevSrc, setPrevSrc] = useState(src);
  if (prevSrc !== src) {
    setPrevSrc(src);
    setFailed(false);
  }
  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center gap-2 bg-gradient-to-br from-zinc-200 to-zinc-100 text-sm text-zinc-400 dark:from-zinc-800 dark:to-zinc-900 ${className ?? ""}`}
      >
        <ImageIcon className="h-5 w-5" />
        {fallbackLabel ?? "Foto"}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function CoverOverlay({
  overlayClass,
  titleFont,
  image,
  kicker,
  names,
  guest,
  note,
  buttonClass,
  onOpen,
}: {
  overlayClass: string;
  titleFont: string;
  image: string;
  kicker: string;
  names: string;
  guest: string;
  note: string;
  buttonClass: string;
  onOpen: () => void;
}) {
  const [bgFailed, setBgFailed] = useState(false);
  // Sama seperti SafeImg: ganti image me-reset status gagal agar URL
  // Supabase baru yang valid langsung dirender, bukan tertahan.
  const [prevImage, setPrevImage] = useState(image);
  if (prevImage !== image) {
    setPrevImage(image);
    setBgFailed(false);
  }
  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-8 text-center ${overlayClass}`}
    >
      {image && !bgFailed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          aria-hidden
          onError={() => setBgFailed(true)}
          className="animate-kenburns absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}
      {/* Scrim gradien agar teks cover selalu terbaca di atas foto */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"
      />
      <div className="relative">
        <p className="text-xs tracking-[0.25em] uppercase opacity-70">{kicker}</p>
        <h2 className={`mt-3 text-3xl font-semibold ${titleFont}`}>{names}</h2>
        <p className="mt-6 text-xs tracking-widest uppercase opacity-70">
          Kepada Yth
        </p>
        <p className="mt-1 text-lg font-medium">{guest}</p>
        <p className="mt-1 text-xs opacity-60">{note}</p>
        <button
          type="button"
          onClick={onOpen}
          className={`mt-8 inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-medium transition-transform hover:scale-105 ${buttonClass}`}
        >
          <MailOpen className="h-4 w-4" />
          Buka Undangan
        </button>
      </div>
    </div>
  );
}

export function MusicToggle({
  muted,
  onToggle,
}: {
  muted: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? "Nyalakan musik" : "Matikan musik"}
      className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur"
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Music className="h-4 w-4" />}
    </button>
  );
}

export function CopyRekeningButton({
  text,
  buttonClass,
}: {
  text: string;
  buttonClass: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-medium transition-colors ${buttonClass}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" /> Disalin!
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" /> Copy Rekening
        </>
      )}
    </button>
  );
}

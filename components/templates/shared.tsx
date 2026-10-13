"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  ImageIcon,
  MailOpen,
  Music,
  VolumeX,
} from "lucide-react";

export interface Countdown {
  passed: boolean;
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

/** Countdown yang hanya berjalan setelah undangan dibuka (hemat render). */
export function useCountdown(
  target: number | null,
  active: boolean
): Countdown | null {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!target || !active) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [target, active]);
  return useMemo(() => {
    if (!target) return null;
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
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}
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

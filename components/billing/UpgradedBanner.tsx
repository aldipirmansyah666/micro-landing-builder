"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Crown, Loader2, X } from "lucide-react";
import { useProStatus } from "./useProStatus";

type Phase = "checking" | "active" | "delayed";

/**
 * Konfirmasi pasca-pembayaran di dashboard.
 *
 * Muncul setelah user kembali dari halaman bayar Midtrans/Xendit dengan
 * `?upgraded=<slug>` (lihat `callbacks.finish` / `success_redirect_url` di
 * checkout). Webhook biasanya tiba beberapa detik SETELAH redirect, jadi
 * komponen polling `/api/user?slug=` singkat sebelum menyatakan PRO aktif —
 * callback `onPending` Snap (VA/QRIS) juga berakhir di sini dengan pesan
 * "masih diproses" yang jelas, bukan halaman kosong tanpa penjelasan.
 */
export function UpgradedBanner({ slug }: { slug: string }) {
  const [phase, setPhase] = useState<Phase>("checking");
  const [dismissed, setDismissed] = useState(false);
  const { syncProStatus } = useProStatus();

  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();

    async function check() {
      const ATTEMPTS = 6;
      for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
        if (controller.signal.aborted) return;
        try {
          const res = await fetch(
            `/api/user?slug=${encodeURIComponent(slug)}`,
            {
              cache: "no-store",
              headers: { Accept: "application/json" },
              signal: controller.signal,
            }
          );
          if (res.ok) {
            const data = (await res.json()) as { is_pro?: boolean };
            if (data.is_pro) {
              if (!disposed) {
                setPhase("active");
                // Segarkan resource Clerk + RSC agar badge PRO & panel fitur
                // di seluruh dashboard langsung ikut berubah.
                void syncProStatus();
              }
              return;
            }
          }
        } catch {
          // Jaringan goyang / abort — lanjut ke iterasi berikutnya.
        }
        if (attempt < ATTEMPTS - 1) {
          await new Promise((resolve) => window.setTimeout(resolve, 1500));
        }
      }
      if (!disposed) setPhase("delayed");
    }

    void check();
    return () => {
      disposed = true;
      controller.abort();
    };
  }, [slug, syncProStatus]);

  if (dismissed) return null;

  if (phase === "checking") {
    return (
      <div
        role="status"
        className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
      >
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
        Memverifikasi pembayaran untuk halaman{" "}
        <span className="font-mono font-medium">/p/{slug}</span>…
      </div>
    );
  }

  if (phase === "delayed") {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <Clock className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-medium">
            Pembayaran untuk <span className="font-mono">/p/{slug}</span>{" "}
            sedang diproses.
          </p>
          <p className="mt-0.5 text-xs opacity-80">
            Status PRO biasanya menyala dalam beberapa detik setelah konfirmasi
            dari penyedia pembayaran. Muat ulang halaman ini bila belum juga
            berubah, atau hubungi admin bila pembayaran sudah lama terpotong.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 rounded-full border border-amber-300 px-3 py-1 text-xs font-semibold transition-colors hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/40"
          >
            Muat Ulang Status
          </button>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Tutup notifikasi pembayaran"
          className="shrink-0 rounded-full p-1 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/40"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="mt-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900 dark:border-green-900 dark:bg-green-950/50 dark:text-green-200"
    >
      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
      <p className="min-w-0 flex-1">
        Pembayaran berhasil — halaman{" "}
        <span className="font-mono font-medium">/p/{slug}</span> kini sudah PRO.
      </p>
      <Link
        href={`/dashboard/builder/${slug}`}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700"
      >
        <Crown className="h-3.5 w-3.5" />
        Buka Editor
      </Link>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Tutup notifikasi pembayaran"
        className="shrink-0 rounded-full p-1 transition-colors hover:bg-green-100 dark:hover:bg-green-900/40"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

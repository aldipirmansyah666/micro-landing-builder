"use client";

import { useState } from "react";
import { Check, Crown, ExternalLink, Loader2, X } from "lucide-react";

const PRO_BENEFITS = [
  "Semua template undangan (Elegant, Rustic, Floral, Minimalist)",
  "Galeri hingga 12 foto",
  "Backsound musik",
  "Tanpa footer branding platform",
];

function formatIDR(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface CheckoutInfo {
  price_idr: number | null;
  currency: string;
  provider: "midtrans" | "xendit" | null;
  configured: boolean;
}

export function UpgradeProButton({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState<CheckoutInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleOpen() {
    setOpen(true);
    setError(null);
    setPaid(false);
    if (!info) {
      setLoadingInfo(true);
      try {
        const res = await fetch("/api/checkout/pro");
        setInfo((await res.json()) as CheckoutInfo);
      } catch {
        setError("Gagal memuat info pembayaran");
      } finally {
        setLoadingInfo(false);
      }
    }
  }

  async function handlePay() {
    setPaying(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        alreadyPro?: boolean;
        payment_url?: string;
        error?: string;
      };
      if (data.alreadyPro) {
        setPaid(true);
        return;
      }
      if (!res.ok || !data.payment_url) {
        throw new Error(data.error ?? "Gagal membuat transaksi");
      }
      window.open(data.payment_url, "_blank", "noopener");
      setPaid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat transaksi");
    } finally {
      setPaying(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void handleOpen()}
        className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-950 transition-colors hover:bg-amber-300"
      >
        <Crown className="h-3.5 w-3.5" />
        Upgrade ke PRO
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 text-zinc-900 shadow-2xl dark:bg-zinc-950 dark:text-zinc-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight">
                <Crown className="h-5 w-5 text-amber-500" />
                Upgrade ke PRO
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-sm opacity-70">
              Untuk halaman <span className="font-mono font-medium">/p/{slug}</span>
            </p>

            <ul className="mt-4 space-y-2">
              {PRO_BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-2xl bg-zinc-50 p-4 text-center dark:bg-zinc-900">
              {loadingInfo ? (
                <Loader2 className="mx-auto h-5 w-5 animate-spin" />
              ) : info?.configured && info.price_idr !== null ? (
                <>
                  <p className="text-2xl font-semibold">{formatIDR(info.price_idr)}</p>
                  <p className="text-xs opacity-60">
                    Sekali bayar via {info.provider === "midtrans" ? "Midtrans" : "Xendit"}
                  </p>
                </>
              ) : (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Pembayaran belum dikonfigurasi. Hubungi admin.
                </p>
              )}
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            {paid && (
              <p className="mt-3 rounded-2xl bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
                Halaman pembayaran dibuka di tab baru. Status PRO aktif otomatis
                setelah pembayaran terkonfirmasi — refresh halaman ini untuk melihatnya.
              </p>
            )}

            <button
              type="button"
              onClick={() => void handlePay()}
              disabled={paying || loadingInfo || !info?.configured}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-amber-400 text-sm font-semibold text-amber-950 transition-colors hover:bg-amber-300 disabled:opacity-50"
            >
              {paying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Bayar Sekarang
            </button>
          </div>
        </div>
      )}
    </>
  );
}

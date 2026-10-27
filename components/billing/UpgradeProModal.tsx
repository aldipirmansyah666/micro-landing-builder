"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Crown, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { Dialog } from "@/design-system/primitives";
import { useProStatus } from "./useProStatus";

const PRO_BENEFITS = [
  "Semua template undangan (Elegant, Rustic, Floral, Minimalist)",
  "Galeri hingga 12 foto",
  "Backsound musik",
  "Tanpa footer branding platform",
];

/**
 * Harga tampilan SEBELUM info checkout termuat dari server.
 * Sengaja disamakan dengan harga PRO default (Rp 49.000) agar label tombol
 * upgrade tidak pernah kosong; begitu `/api/checkout/pro` menjawab, label
 * memakai `price_idr` yang sebenarnya.
 */
export const PRO_PRICE_FALLBACK_IDR = 49_000;

export function formatIDR(n: number): string {
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
  client_key: string | null;
  snap_script_url: string;
}

interface SnapResult {
  order_id?: string;
  transaction_status?: string;
}

interface SnapCallbacks {
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
  onClose?: () => void;
}

interface SnapApi {
  pay(token: string, callbacks?: SnapCallbacks): void;
}

const DEFAULT_SNAP_SCRIPT_URL =
  "https://app.sandbox.midtrans.com/snap/snap.js";
const SNAP_SCRIPT_ID = "midtrans-snap-script";

function getSnap(): SnapApi | undefined {
  return (window as Window & { snap?: SnapApi }).snap;
}

/**
 * Muat Snap.js satu kali dengan `data-client-key` yang benar, lalu tunggu
 * sampai `window.snap` tersedia sebelum memanggil `snap.pay()`.
 */
function loadSnap(clientKey: string, scriptUrl: string): Promise<void> {
  if (getSnap()) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const waitUntilReady = () => {
      const started = Date.now();
      const tick = () => {
        if (getSnap()) return resolve();
        if (Date.now() - started > 10_000) {
          return reject(new Error("Midtrans Snap tidak merespons"));
        }
        window.setTimeout(tick, 100);
      };
      tick();
    };

    const existing = document.getElementById(
      SNAP_SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existing) {
      if (existing.dataset.loaded === "true") {
        waitUntilReady();
      } else {
        existing.addEventListener("load", waitUntilReady, { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error("Gagal memuat Midtrans Snap")),
          { once: true }
        );
      }
      return;
    }

    const script = document.createElement("script");
    script.id = SNAP_SCRIPT_ID;
    script.src = scriptUrl || DEFAULT_SNAP_SCRIPT_URL;
    script.async = true;
    script.setAttribute("data-client-key", clientKey);
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        waitUntilReady();
      },
      { once: true }
    );
    script.addEventListener(
      "error",
      () => reject(new Error("Gagal memuat Midtrans Snap")),
      { once: true }
    );
    document.body.appendChild(script);
  });
}

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException || error instanceof Error) &&
    error.name === "AbortError"
  );
}

/**
 * State + handler checkout PRO. Satu-satunya tempat logika pembayaran hidup
 * (modal info template, tombol upgrade, dsb. memakai hook yang sama sehingga
 * perilaku Snap popup, polling webhook, dan pesan error selalu konsisten).
 *
 * - `ensureInfo()`  : ambil harga/provider/key dari GET /api/checkout/pro
 *                     (sekali saja, lalu di-cache di state).
 * - `handlePay()`   : POST /api/checkout/pro → Snap popup (jalur utama) atau
 *                     redirect tab baru (fallback).
 * - `activated`     : true setelah polling `/api/user` mengonfirmasi webhook
 *                     sudah menaikkan `is_pro` — pemanggil bisa menutup
 *                     modal peringatannya sendiri.
 */
export function useProCheckout(slug: string) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState<CheckoutInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [activated, setActivated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { syncProStatus, waitForProActivation } = useProStatus();

  /**
   * Setiap percobaan bayar punya ID. Callback Snap dari popup lama
   * (mis. user menutup lalu membuka lagi) diabaikan agar tidak memicu
   * state update berulang yang membuat UI freeze.
   */
  const paySessionRef = useRef(0);
  const settledRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const infoRef = useRef<CheckoutInfo | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, []);

  function cancelPendingWork() {
    abortRef.current?.abort();
    abortRef.current = null;
  }

  function closeModalCleanly() {
    cancelPendingWork();
    if (!mountedRef.current) return;
    setOpen(false);
    setPaying(false);
    setVerifying(false);
  }

  function handleModalClose() {
    // Invalidasi callback Snap yang mungkin masih tertunda.
    paySessionRef.current += 1;
    cancelPendingWork();
    setOpen(false);
    setPaying(false);
    setVerifying(false);
  }

  /** Ambil info harga/provider (sekali per sesi). Aman dipanggil berkali-kali. */
  const ensureInfo = useCallback(async () => {
    if (infoRef.current) return;
    setLoadingInfo(true);
    try {
      const res = await fetch("/api/checkout/pro");
      const data = (await res.json()) as CheckoutInfo;
      infoRef.current = data;
      if (mountedRef.current) setInfo(data);
    } catch {
      if (mountedRef.current) setError("Gagal memuat info pembayaran");
    } finally {
      if (mountedRef.current) setLoadingInfo(false);
    }
  }, []);

  async function handleOpen() {
    // Invalidasi callback dari sesi pembayaran sebelumnya.
    paySessionRef.current += 1;
    settledRef.current = false;
    cancelPendingWork();

    setOpen(true);
    setError(null);
    setPaid(false);
    setVerifying(false);
    setPaying(false);
    setActivated(false);

    if (!infoRef.current) await ensureInfo();
  }

  /**
   * Snap `onSuccess`: webhook Midtrans sering tiba beberapa detik setelah
   * callback browser. Polling singkat + reload Clerk/router membuat status
   * PRO langsung terlihat tanpa user harus refresh manual.
   */
  async function finishSnapPayment(sessionId: number) {
    if (sessionId !== paySessionRef.current || settledRef.current) return;
    settledRef.current = true;
    setPaid(true);
    setVerifying(true);
    setPaying(false);
    setError(null);

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    try {
      const active = await waitForProActivation(slug, {
        attempts: 8,
        intervalMs: 1500,
        signal: controller.signal,
      });

      if (!mountedRef.current || sessionId !== paySessionRef.current) return;

      await syncProStatus();

      if (!mountedRef.current || sessionId !== paySessionRef.current) return;

      if (active) {
        setActivated(true);
        closeModalCleanly();
      } else {
        setVerifying(false);
        setError(
          'Pembayaran diterima, tetapi status PRO belum tercatat di server. Klik "Cek Status Pembayaran" beberapa saat lagi.'
        );
      }
    } catch (err) {
      if (isAbortError(err)) return;
      console.error("Gagal memverifikasi status PRO:", err);
      if (mountedRef.current && sessionId === paySessionRef.current) {
        setVerifying(false);
        setError(
          "Pembayaran diterima, tetapi verifikasi status PRO gagal. Klik Cek Status Pembayaran."
        );
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  }

  /**
   * Snap `onPending` (VA/QRIS): bukan pembayaran final. Tutup modal dan
   * bersihkan loader, lalu biarkan webhook + listener pageshow/visibility
   * yang menyegarkan status saat pembayaran benar-benar settle.
   */
  async function finishPendingPayment(sessionId: number) {
    if (sessionId !== paySessionRef.current || settledRef.current) return;
    settledRef.current = true;
    setPaid(true);
    setPaying(false);

    try {
      await syncProStatus();
    } finally {
      closeModalCleanly();
    }
  }

  /** Tombol "Cek Status Pembayaran" — polling singkat sebelum refresh. */
  async function handleCheckStatus() {
    const sessionId = paySessionRef.current;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    setVerifying(true);
    setPaying(false);
    setError(null);

    try {
      const active = await waitForProActivation(slug, {
        attempts: 4,
        intervalMs: 1500,
        signal: controller.signal,
      });

      if (!mountedRef.current || sessionId !== paySessionRef.current) return;

      await syncProStatus();

      if (!mountedRef.current || sessionId !== paySessionRef.current) return;

      if (active) {
        setActivated(true);
        closeModalCleanly();
      } else {
        setVerifying(false);
        setError(
          "Status PRO belum tercatat. Tunggu beberapa saat lalu klik Cek Status lagi."
        );
      }
    } catch (err) {
      if (isAbortError(err)) return;
      console.error("Gagal memeriksa status PRO:", err);
      if (mountedRef.current && sessionId === paySessionRef.current) {
        setVerifying(false);
        setError("Gagal memeriksa status pembayaran. Silakan coba lagi.");
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  }

  async function handlePay() {
    const sessionId = paySessionRef.current + 1;
    paySessionRef.current = sessionId;
    settledRef.current = false;
    cancelPendingWork();

    setPaying(true);
    setError(null);
    setPaid(false);
    setVerifying(false);
    setActivated(false);

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
        snap_token?: string;
        client_key?: string | null;
        snap_script_url?: string;
        error?: string;
      };

      if (sessionId !== paySessionRef.current) return;

      if (data.alreadyPro) {
        await syncProStatus();
        if (sessionId === paySessionRef.current) {
          setActivated(true);
          closeModalCleanly();
        }
        return;
      }
      if (!res.ok) {
        throw new Error(data.error ?? "Gagal membuat transaksi");
      }

      const clientKey =
        data.client_key ??
        info?.client_key ??
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

      // Jalur utama: popup Snap (butuh snap_token + Client Key).
      if (data.snap_token && clientKey) {
        try {
          await loadSnap(
            clientKey,
            data.snap_script_url ||
              info?.snap_script_url ||
              DEFAULT_SNAP_SCRIPT_URL
          );

          if (sessionId !== paySessionRef.current) return;

          const snap = getSnap();
          if (snap) {
            snap.pay(data.snap_token, {
              onSuccess: () => {
                void finishSnapPayment(sessionId);
              },
              onPending: () => {
                void finishPendingPayment(sessionId);
              },
              onError: () => {
                if (
                  sessionId !== paySessionRef.current ||
                  settledRef.current
                ) {
                  return;
                }
                settledRef.current = true;
                setPaying(false);
                setError("Pembayaran gagal diproses Midtrans.");
              },
              onClose: () => {
                if (
                  sessionId !== paySessionRef.current ||
                  settledRef.current
                ) {
                  return;
                }
                setPaying(false);
                setError("Jendela pembayaran ditutup sebelum selesai.");
              },
            });
            // Popup Snap sudah terbuka; jangan biarkan modal kita
            // meninggalkan state loading yang membuat tombol terasa freeze.
            setPaying(false);
            return;
          }
        } catch (snapError) {
          // Jangan blokir pembayaran: lanjut ke redirect_url sebagai fallback.
          console.error("Midtrans Snap Error:", snapError);
        }
      }

      // Fallback: halaman pembayaran Midtrans di tab baru.
      if (!data.payment_url) {
        throw new Error("Midtrans tidak mengembalikan URL pembayaran");
      }
      window.open(data.payment_url, "_blank", "noopener");
      settledRef.current = true;
      setPaid(true);
      setPaying(false);
    } catch (err) {
      if (sessionId !== paySessionRef.current) return;
      setError(err instanceof Error ? err.message : "Gagal membuat transaksi");
      setPaying(false);
    }
  }

  return {
    /** Modal trigger (hanya dipakai UpgradeProButton). */
    open,
    handleOpen,
    handleModalClose,
    /** Info harga & konfigurasi checkout. */
    info,
    loadingInfo,
    ensureInfo,
    /** Status pembayaran untuk dirender pemanggil. */
    paying,
    paid,
    verifying,
    activated,
    error,
    /** Aksi. */
    handlePay,
    handleCheckStatus,
    closeModalCleanly,
  };
}

/**
 * Tombol upgrade + modal info lengkap (dashboard, header builder, panel
 * fitur PRO). Perilaku tidak berubah — logika checkout kini tinggal di
 * `useProCheckout`.
 */
export function UpgradeProButton({ slug }: { slug: string }) {
  const {
    open,
    handleOpen,
    handleModalClose,
    info,
    loadingInfo,
    paying,
    paid,
    verifying,
    error,
    handlePay,
    handleCheckStatus,
  } = useProCheckout(slug);

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
        <Dialog
          open={open}
          onClose={handleModalClose}
          title={
            <>
              <Crown className="h-5 w-5 text-amber-500" />
              Upgrade ke PRO
            </>
          }
          titleClassName="inline-flex items-center gap-2"
        >
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

          {verifying && (
            <p className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              Memverifikasi pembayaran dan mengaktifkan PRO...
            </p>
          )}
          {error && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          {paid && !verifying && (
            <p className="mt-3 rounded-2xl bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
              Pembayaran diterima. Klik &quot;Cek Status Pembayaran&quot; untuk
              memastikan webhook Midtrans sudah memperbarui status PRO.
            </p>
          )}

          {paid && !verifying ? (
            <button
              type="button"
              onClick={() => void handleCheckStatus()}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-amber-400 text-sm font-semibold text-amber-950 transition-colors hover:bg-amber-300"
            >
              <RefreshCw className="h-4 w-4" />
              Cek Status Pembayaran
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void handlePay()}
              disabled={paying || verifying || loadingInfo || !info?.configured}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-amber-400 text-sm font-semibold text-amber-950 transition-colors hover:bg-amber-300 disabled:opacity-50"
            >
              {paying || verifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              {verifying ? "Memverifikasi..." : "Bayar Sekarang"}
            </button>
          )}
        </Dialog>
      )}
    </>
  );
}

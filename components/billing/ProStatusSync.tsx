"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useProStatus } from "./useProStatus";

const MIN_SYNC_INTERVAL_MS = 3000;

/**
 * Menjaga status PRO tetap segar saat halaman dipulihkan dari bfcache
 * (tombol Back browser) atau saat tab kembali aktif.
 *
 * Tanpa ini, browser bisa menampilkan snapshot HTML lama yang masih
 * berstatus Free walaupun webhook sudah meng-update database.
 */
export function ProStatusSync() {
  const pathname = usePathname();
  const { syncProStatus } = useProStatus();
  const lastSyncRef = useRef(0);
  const wasHiddenRef = useRef(false);

  useEffect(() => {
    const isPrivateArea =
      pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");
    if (!isPrivateArea) return;

    let disposed = false;

    const syncIfStale = (force = false) => {
      if (disposed) return;
      const now = Date.now();
      // Throttle: visibilitychange bisa terpicu berkali-kali saat user
      // berpindah tab. Jangan sampai memicu refresh beruntun.
      if (!force && now - lastSyncRef.current < MIN_SYNC_INTERVAL_MS) return;
      lastSyncRef.current = now;
      void syncProStatus();
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming | undefined;
      // `persisted` = dipulihkan dari bfcache; `back_forward` menangkap
      // navigasi Back/Forward yang memakai cache Next.js (bukan bfcache).
      if (event.persisted || navigation?.type === "back_forward") {
        syncIfStale(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        wasHiddenRef.current = true;
        return;
      }
      if (wasHiddenRef.current) {
        wasHiddenRef.current = false;
        syncIfStale();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      disposed = true;
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname, syncProStatus]);

  return null;
}

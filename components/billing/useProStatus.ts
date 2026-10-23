"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, useUser } from "@clerk/nextjs";

export interface UserProStatus {
  ok: boolean;
  is_admin: boolean;
  account_pro: boolean;
  slug: string | null;
  is_pro: boolean;
  pro_slugs: string[];
  pages: Array<{ slug: string; is_pro: boolean }>;
}

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException || error instanceof Error) &&
    error.name === "AbortError"
  );
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const onAbort = () => {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };

    const timer = window.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * Sinkronisasi status PRO di browser.
 *
 * - `syncProStatus()`  : reload resource Clerk (user + session) lalu
 *   `router.refresh()` agar server component dashboard/builder
 *   mengambil ulang `landing_pages.is_pro` dari database.
 * - `waitForProActivation(slug)` : polling singkat ke `/api/user`
 *   untuk menutup race dengan webhook Midtrans (webhook biasanya tiba
 *   beberapa detik setelah Snap mengirim `onSuccess`).
 */
export function useProStatus() {
  const router = useRouter();
  const { user } = useUser();
  const { session } = useSession();

  const syncProStatus = useCallback(async () => {
    const tasks: Promise<unknown>[] = [];
    if (user) tasks.push(user.reload());
    if (session) tasks.push(session.reload());

    const results = await Promise.allSettled(tasks);
    for (const result of results) {
      if (result.status === "rejected") {
        console.error("[pro-status] gagal reload resource Clerk:", result.reason);
      }
    }

    router.refresh();
  }, [router, user, session]);

  const fetchProStatus = useCallback(
    async (slug?: string, signal?: AbortSignal): Promise<UserProStatus | null> => {
      const url = slug
        ? `/api/user?slug=${encodeURIComponent(slug)}`
        : "/api/user";
      try {
        const res = await fetch(url, {
          cache: "no-store",
          headers: { Accept: "application/json" },
          signal,
        });
        if (!res.ok) return null;
        return (await res.json()) as UserProStatus;
      } catch (error) {
        if (!isAbortError(error)) {
          console.error("[pro-status] gagal memuat status PRO:", error);
        }
        return null;
      }
    },
    []
  );

  const waitForProActivation = useCallback(
    async (
      slug: string,
      options?: {
        attempts?: number;
        intervalMs?: number;
        signal?: AbortSignal;
      }
    ): Promise<boolean> => {
      const attempts = options?.attempts ?? 8;
      const intervalMs = options?.intervalMs ?? 1500;

      for (let i = 0; i < attempts; i += 1) {
        if (options?.signal?.aborted) return false;

        const status = await fetchProStatus(slug, options?.signal);
        if (status?.pro_slugs.includes(slug)) return true;

        if (i < attempts - 1) {
          try {
            await sleep(intervalMs, options?.signal);
          } catch (error) {
            if (isAbortError(error)) return false;
            throw error;
          }
        }
      }

      return false;
    },
    [fetchProStatus]
  );

  return { syncProStatus, fetchProStatus, waitForProActivation };
}

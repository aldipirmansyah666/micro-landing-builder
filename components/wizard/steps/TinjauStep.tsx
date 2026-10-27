"use client";

import { Button } from "@/design-system/primitives";
import { coupleNames } from "@/lib/invitation";
import type { InvitationContent } from "@/lib/invitation";
import type { WizardMeta } from "@/lib/wizard/wizardMachine";
import { primaryEvent } from "@/lib/invitation-events";

/**
 * Langkah 7 (terakhir): ringkasan read-only seluruh data + tombol
 * "Terbitkan & Bagikan" yang memicu penyimpanan final ke server
 * (divalidasi menyeluruh oleh `InvitationContentSchema` di save-route).
 */
export function TinjauStep({
  data,
  meta,
  isSaving,
  saveError,
  onPublish,
}: {
  data: InvitationContent;
  meta: WizardMeta;
  isSaving: boolean;
  saveError: string | null;
  onPublish: () => void;
}) {
  const events = data.events ?? [];
  const primary = primaryEvent(events);
  const accounts = data.accounts;

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-xs uppercase tracking-wide text-zinc-400">
          Alamat Undangan
        </p>
        <p className="mt-1 font-mono text-sm">
          /p/{meta.slug || "(belum diisi)"}
        </p>
        <p className="mt-1 text-sm text-zinc-500">{meta.title}</p>
      </div>

      <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-xs uppercase tracking-wide text-zinc-400">Mempelai</p>
        <p className="mt-1 text-base font-semibold">{coupleNames(data)}</p>
        <p className="text-sm text-zinc-500">
          {data.coupleOrder === "brideFirst" ? "Wanita ditampilkan dulu" : "Pria ditampilkan dulu"}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-xs uppercase tracking-wide text-zinc-400">
          Rangkaian Acara ({events.length})
        </p>
        {events.length === 0 ? (
          <p className="mt-1 text-sm text-zinc-500">Belum ada acara.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-1.5">
            {events.map((e) => (
              <li key={e.id} className="text-sm">
                <span className="font-medium">{e.title || "(tanpa nama)"}</span>
                {e.isPrimary && primary && (
                  <span className="ml-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    Utama
                  </span>
                )}
                <span className="text-zinc-500">
                  {" "}
                  — {e.date || "(tanggal belum diisi)"} {e.time} {e.timezone}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-xs uppercase tracking-wide text-zinc-400">
          Rekening ({accounts.length})
        </p>
        {accounts.length === 0 ? (
          <p className="mt-1 text-sm text-zinc-500">Belum ada rekening.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-1">
            {accounts.map((a, i) => (
              <li key={i} className="text-sm">
                <span className="font-medium">{a.bank}</span>{" "}
                <span className="font-mono">{a.number}</span>{" "}
                <span className="text-zinc-500">a.n. {a.holder}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-xs uppercase tracking-wide text-zinc-400">Media</p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {data.galleryImages.length} foto · {data.galleryVideos.length} video ·{" "}
          {data.backsoundUrl ? "backsound aktif" : "tanpa backsound"}
        </p>
      </div>

      {saveError && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950 dark:text-red-300"
        >
          {saveError}
        </p>
      )}

      <Button
        onClick={onPublish}
        disabled={isSaving || !meta.slug || !meta.title}
        className="w-full"
        size="lg"
      >
        {isSaving ? "Menyimpan…" : "Terbitkan & Bagikan Undangan"}
      </Button>
    </div>
  );
}

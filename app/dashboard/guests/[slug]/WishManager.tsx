"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import type { Wish } from "@/lib/db";
import { deleteWishAction } from "./actions";

export function WishManager({
  slug,
  initial,
  stats,
}: {
  slug: string;
  initial: Wish[];
  stats: { attendance: string; count: number }[];
}) {
  const [wishes, setWishes] = useState<Wish[]>(initial);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  const total = stats.reduce((s, x) => s + x.count, 0);
  const countOf = (label: string) =>
    stats.find((s) => s.attendance === label)?.count ?? 0;

  function handleDelete(w: Wish) {
    if (!window.confirm(`Hapus ucapan dari "${w.name}"?`)) return;
    setDeletingId(w.id);
    startTransition(async () => {
      try {
        await deleteWishAction(slug, w.id);
        setWishes((list) => list.filter((x) => x.id !== w.id));
      } catch (err) {
        window.alert(err instanceof Error ? err.message : "Gagal menghapus");
      } finally {
        setDeletingId(null);
      }
    });
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Ucapan", value: total },
          { label: "Hadir", value: countOf("Hadir") },
          { label: "Tidak Hadir", value: countOf("Tidak Hadir") },
          { label: "Ragu-ragu", value: countOf("Masih Ragu") },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-center dark:border-zinc-800 dark:bg-zinc-950"
          >
            <p className="text-2xl font-semibold tabular-nums">{s.value}</p>
            <p className="text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {wishes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
            Belum ada ucapan masuk.
          </p>
        ) : (
          wishes.map((w) => (
            <div
              key={w.id}
              className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{w.name}</p>
                  <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {w.attendance}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {w.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(w)}
                disabled={deletingId === w.id}
                title="Hapus ucapan"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-200 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

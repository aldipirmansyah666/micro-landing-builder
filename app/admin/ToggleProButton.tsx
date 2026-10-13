"use client";

import { useTransition } from "react";
import { Crown } from "lucide-react";
import { toggleProAction } from "./actions";

export function ToggleProButton({
  slug,
  isPro,
}: {
  slug: string;
  isPro: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const next = !isPro;

  function handleToggle() {
    startTransition(async () => {
      try {
        await toggleProAction(slug, next);
      } catch (error) {
        window.alert(
          error instanceof Error ? error.message : "Gagal mengubah status"
        );
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      title={next ? "Jadikan PRO" : "Kembalikan ke FREE"}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
        next
          ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:hover:bg-amber-900/60"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      }`}
    >
      <Crown className="h-3.5 w-3.5" />
      {isPending ? "..." : next ? "Jadi PRO" : "Jadi FREE"}
    </button>
  );
}

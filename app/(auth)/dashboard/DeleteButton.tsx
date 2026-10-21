"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteLandingPageAction } from "./actions";

export function DeleteLandingPageButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(`Hapus landing page "${title}"?`)) return;
    startTransition(async () => {
      try {
        await deleteLandingPageAction(slug);
      } catch (error) {
        window.alert(
          error instanceof Error ? error.message : "Gagal menghapus halaman"
        );
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      aria-label={`Hapus ${title}`}
      className="inline-flex items-center justify-center rounded-full border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
    >
      <Trash2 className="h-3.5 w-3.5" />
      <span className="sr-only">Hapus</span>
    </button>
  );
}

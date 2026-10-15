"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-lg font-semibold">Terjadi kesalahan</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Maaf, halaman gagal dimuat. Coba lagi atau kembali nanti.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      >
        Coba lagi
      </button>
    </div>
  );
}

/**
 * Placeholder saat chunk template sedang dimuat (lihat registry.ts).
 *
 * SENGAJA file terpisah tanpa import berat: kalau komponen ini diimpor
 * dari `shared.tsx`, seluruh modul shared (beserta ikon lucide-react-nya)
 * ikut masuk ke bundle awal dan membatalkan gunanya code-splitting.
 *
 * Halaman publik tidak pernah melihat placeholder ini karena komponen
 * di-SSR (tidak ada flash), tapi mencegah kedipan kosong saat berpindah
 * template di builder/katalog.
 */
export function TemplateLoading() {
  return (
    <div
      aria-hidden
      className="flex min-h-[60vh] items-center justify-center bg-white dark:bg-black"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-400 dark:border-zinc-800 dark:border-t-zinc-600" />
    </div>
  );
}

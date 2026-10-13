import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-white shadow-sm dark:bg-zinc-900">
        <Compass className="h-7 w-7 text-zinc-400" />
      </span>
      <p className="mt-6 text-sm font-medium tracking-widest text-zinc-400 uppercase">
        404
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        Tautan yang kamu buka sudah dihapus, dipindahkan, atau slug-nya salah
        ketik. Coba periksa kembali tautannya.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-medium transition-colors hover:bg-white dark:border-zinc-800 dark:hover:bg-zinc-900"
        >
          Buka Dashboard
        </Link>
      </div>
    </div>
  );
}

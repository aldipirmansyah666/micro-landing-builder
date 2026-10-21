import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  getGuestsBySlug,
  getLandingPageBasicByUserAndSlug,
  getWishesBySlug,
  getWishStatsBySlug,
} from "@/lib/db";
import { GuestManager } from "./GuestManager";
import { WishManager } from "./WishManager";

// Halaman privat (auth + query Neon per-request): boleh blocking,
// opt-out dari validasi instant navigation (Next.js 16 + cacheComponents).
export const instant = false;

export default async function GuestsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { slug } = await params;
  // Cukup `title` untuk header — query ringan tanpa `content_json`.
  const page = await getLandingPageBasicByUserAndSlug(userId, slug);
  if (!page) redirect("/dashboard");

  const [guests, wishes, stats] = await Promise.all([
    getGuestsBySlug(slug),
    getWishesBySlug(slug),
    getWishStatsBySlug(slug),
  ]);

  const opened = guests.filter((g) => g.opened_at).length;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              aria-label="Kembali ke dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-base font-semibold tracking-tight">
                Tamu & RSVP
              </h1>
              <p className="text-xs text-zinc-500">
                {page.title} · /p/{slug}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/p/${slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Lihat Live</span>
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-10 px-6 py-10">
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Daftar Tamu</h2>
            <p className="text-sm text-zinc-500">
              {guests.length} tamu · {opened} sudah membuka
            </p>
          </div>
          <div className="mt-4">
            <GuestManager slug={slug} initial={guests} />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight">
            Rekap RSVP & Ucapan
          </h2>
          <div className="mt-4">
            <WishManager slug={slug} initial={wishes} stats={stats} />
          </div>
        </section>
      </main>
    </div>
  );
}

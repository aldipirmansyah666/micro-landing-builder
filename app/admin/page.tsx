import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft, Crown, ExternalLink, ShieldCheck } from "lucide-react";
import { getAllLandingPages, isAdmin } from "@/lib/db";
import { ToggleProButton } from "./ToggleProButton";

// Halaman privat admin: render per-request (blocking), bukan prerender statis.
export const instant = false;

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  if (!(await isAdmin(userId))) redirect("/dashboard");

  const pages = await getAllLandingPages();
  const proCount = pages.filter((p) => p.is_pro).length;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              aria-label="Kembali ke dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="inline-flex items-center gap-2 text-base font-semibold tracking-tight">
              <ShieldCheck className="h-4 w-4" />
              Admin Panel
            </h1>
          </div>
          <UserButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Semua Landing Page
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {pages.length} halaman · {proCount} PRO
            </p>
          </div>
        </div>

        {pages.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-950">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Belum ada landing page dari user mana pun.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-xs text-zinc-500 uppercase dark:border-zinc-800 dark:text-zinc-400">
                  <th className="px-5 py-3 font-medium">Judul</th>
                  <th className="px-5 py-3 font-medium">Slug</th>
                  <th className="px-5 py-3 font-medium">Email Pemilik</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr
                    key={page.id}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                  >
                    <td className="max-w-[220px] truncate px-5 py-3.5 font-medium">
                      {page.title}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/p/${page.slug}`}
                        className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
                      >
                        /p/{page.slug}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </Link>
                    </td>
                    <td className="max-w-[220px] truncate px-5 py-3.5 text-zinc-600 dark:text-zinc-400">
                      {page.owner_email ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      {page.is_pro ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          <Crown className="h-3 w-3" />
                          PRO
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          FREE
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <ToggleProButton slug={page.slug} isPro={page.is_pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

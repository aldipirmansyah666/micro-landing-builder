import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import {
  ArrowLeft,
  Crown,
  ExternalLink,
  Pencil,
  Plus,
  LayoutGrid,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  getLandingPageSummariesByUserId,
  getUserRole,
  upsertUser,
  getDashboardStats,
  type LandingPageSummary,
} from "@/lib/db";
import { DeleteLandingPageButton } from "./DeleteButton";
import { CopyWaLinkButton, ExportGuestsButton } from "./QuickActions";
import { UpgradeProButton } from "@/components/billing/UpgradeProModal";
import { UpgradedBanner } from "@/components/billing/UpgradedBanner";
import { hasProAccess } from "@/lib/entitlements";
import { templateLabel } from "@/lib/templates";
import { buttonClass } from "@/design-system/primitives";

// Halaman privat (auth + query Neon per-request): boleh blocking,
// opt-out dari validasi instant navigation (Next.js 16 + cacheComponents).
export const instant = false;

function StatusBadge({ isPro }: { isPro: boolean }) {
  if (isPro) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
        <Crown className="h-3 w-3" />
        Pro
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
      Free
    </span>
  );
}

function LandingPageCard({
  page,
  isAdmin,
  email,
}: {
  page: LandingPageSummary;
  isAdmin: boolean;
  email: string | null;
}) {
  // Admin & surel yang terdaftar di PRO_BYPASS_EMAILS mendapat akses Pro
  // penuh (bypass paywall).
  const showAsPro = hasProAccess({ isPro: page.is_pro, isAdmin, email });
  return (
    <article className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <h2 className="truncate text-base font-semibold tracking-tight">
          {page.title}
        </h2>
        <StatusBadge isPro={showAsPro} />
      </div>

      <Link
        href={`/p/${page.slug}`}
        className="mt-1 inline-flex items-center gap-1 truncate text-sm text-zinc-500 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        /p/{page.slug}
        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
      </Link>

      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
        Template: {templateLabel(page.template_type)} · Dibuat{" "}
        {new Date(page.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>

      <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <Link
          href={`/dashboard/builder/${page.slug}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Link>
        <Link
          href={`/p/${page.slug}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-zinc-200 px-3 py-2 text-xs font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Lihat Live
        </Link>
        <DeleteLandingPageButton slug={page.slug} title={page.title} />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Link
          href={`/dashboard/guests/${page.slug}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-zinc-200 px-3 py-2 text-xs font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          <Users className="h-3.5 w-3.5" />
          Tamu & RSVP
        </Link>
        <ExportGuestsButton slug={page.slug} />
        {!showAsPro && <UpgradeProButton slug={page.slug} />}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <CopyWaLinkButton slug={page.slug} title={page.title} />
      </div>
    </article>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string | string[] }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Pastikan baris user ada (FK landing_pages.user_id -> users.clerk_id)
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? null;
  if (email) {
    await upsertUser({ id: userId, clerk_id: userId, email });
  }

  const pages = await getLandingPageSummariesByUserId(userId);
  const role = await getUserRole(userId);
  const isUserAdmin = role === "admin";
  const stats = await getDashboardStats(userId);
  const accountPro =
    isUserAdmin || pages.some((p) => p.is_pro);

  // Sinyal sukses pembayaran dari redirect Midtrans/Xendit (?upgraded=<slug>).
  // Hanya ditampilkan bila slug memang milik user ini — mencegah parameter
  // URL dipakai untuk menampilkan status halaman orang lain.
  const { upgraded } = await searchParams;
  const upgradedSlug =
    typeof upgraded === "string" && pages.some((p) => p.slug === upgraded)
      ? upgraded
      : null;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              aria-label="Kembali ke beranda"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-base font-semibold tracking-tight">
              Dashboard
            </h1>
            <Link href="/" aria-label="NikahYuk — beranda">
              <Image
                src="/logo-nikahyuk.svg"
                alt="NikahYuk"
                width={200}
                height={34}
                className="h-7 w-auto dark:hidden"
              />
              <Image
                src="/logo-nikahyuk-light.svg"
                alt="NikahYuk"
                width={200}
                height={34}
                className="hidden h-7 w-auto dark:block"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {isUserAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:hover:bg-amber-900/60"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {upgradedSlug && <UpgradedBanner slug={upgradedSlug} />}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Kelola Undangan NikahYuk Kamu
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {pages.length === 0
                ? "Belum ada undangan. Buat yang pertama!"
                : `${pages.length} undangan`}
            </p>
          </div>
          <Link
            href="/dashboard/builder/new"
            className={buttonClass({ variant: "primary", size: "lg" })}
          >
            <Plus className="h-4 w-4" />
            Buat Undangan Baru
          </Link>
        </div>

        {/* Widget analitik ringkas */}
        <section
          aria-label="Ringkasan analitik"
          className="mt-6 grid grid-cols-3 gap-3"
        >
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xl" aria-hidden>
              👁️
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {stats.views}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Total Kunjungan
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xl" aria-hidden>
              💌
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {stats.wishes}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Ucapan & RSVP
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xl" aria-hidden>
              👑
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {accountPro ? "Pro" : "Free"}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Status Akun
            </p>
          </div>
        </section>

        {pages.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-950">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
              <LayoutGrid className="h-6 w-6 text-zinc-500" />
            </span>
            <h3 className="mt-4 text-base font-semibold">
              Mulai dari undangan kosong
            </h3>
            <p className="mt-1 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
              Buat undangan pertamamu dalam hitungan menit dan bagikan
              tautannya ke tamu.
            </p>
            <Link
              href="/dashboard/builder/new"
              className={buttonClass({
                variant: "primary",
                size: "lg",
                className: "mt-6",
              })}
            >
              <Plus className="h-4 w-4" />
              Buat Undangan Baru
            </Link>
          </div>
        ) : (
            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <LandingPageCard
                  key={page.id}
                  page={page}
                  isAdmin={isUserAdmin}
                  email={email}
                />
              ))}
            </section>
        )}
      </main>
    </div>
  );
}

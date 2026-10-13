import Link from "next/link";
import { Suspense } from "react";
import { Show, UserButton } from "@clerk/nextjs";
import { ArrowRight, Sparkles, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Cepat & Ringan",
    description: "Publish landing page dalam hitungan menit, tanpa setup rumit.",
  },
  {
    icon: Globe,
    title: "Siap Online",
    description: "Setiap page langsung punya URL publik yang bisa dibagikan.",
  },
  {
    icon: Sparkles,
    title: "Minimalis Modern",
    description: "Template bersih yang fokus pada konversi dan CTA.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      {/* Navbar */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-base font-semibold tracking-tight">
          Micro Landing Builder
        </Link>
        <nav className="flex items-center gap-3">
          <Suspense
            fallback={
              <Link
                href="/sign-in"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
              >
                Masuk
              </Link>
            }
          >
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Masuk
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Mulai Gratis
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Buka Dashboard
              </Link>
              <UserButton />
            </Show>
          </Suspense>
        </nav>
      </header>

      {/* Hero */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-6 pb-20 pt-16 text-center sm:pt-24">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <Sparkles className="h-3.5 w-3.5" />
          Micro landing page builder untuk semua orang
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Bangun landing page memukau dalam hitungan menit.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg">
          Buat, atur, dan publikasikan micro landing page tanpa coding.
          Fokus pada pesan Anda — biar kami yang urus sisanya.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Suspense
            fallback={
              <Link
                href="/sign-in"
                className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-7 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
              >
                Mulai Sekarang
              </Link>
            }
          >
            <Show when="signed-out">
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-900 px-7 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Mulai Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 px-7 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                Saya sudah punya akun
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-900 px-7 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Buka Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Show>
          </Suspense>
        </div>

        {/* Features */}
        <section className="mt-20 grid w-full gap-4 text-left sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <feature.icon className="mb-4 h-5 w-5" />
              <h2 className="text-sm font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
        Micro Landing Builder — dibuat dengan Next.js & Clerk
      </footer>
    </div>
  );
}

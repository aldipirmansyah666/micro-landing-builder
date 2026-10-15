import Link from "next/link";
import { Suspense } from "react";
import { Show, UserButton } from "@clerk/nextjs";
import { ArrowRight, Check } from "lucide-react";
import { TEMPLATE_REGISTRY } from "@/lib/templates";

const FEATURED_IDS = [
  "aruna",
  "mahardika",
  "puspaningrat",
  "azzahra",
  "blossom",
  "verdant",
];

const featuredTemplates = FEATURED_IDS.map(
  (id) => TEMPLATE_REGISTRY.find((t) => t.id === id) ?? TEMPLATE_REGISTRY[0]
);

const features = [
  {
    icon: "🎨",
    title: "18+ Template Premium",
    description:
      "Minimalis, Luxury, Adat Jawa/Bali, Islami, hingga Rustic — tinggal pilih dan preview instan.",
  },
  {
    icon: "📍",
    title: "Peta Lokasi Google Maps Interaktif",
    description:
      "Sematkan lokasi akad & resepsi dengan tombol Lihat Lokasi untuk setiap acara.",
  },
  {
    icon: "💌",
    title: "RSVP & Ucapan Tamu Real-time",
    description:
      "Konfirmasi kehadiran dan ucapan tamu terkumpul otomatis di dashboard.",
  },
  {
    icon: "💳",
    title: "Amplop Digital & Rekening",
    description:
      "Terima tanda kasih via rekening bank/e-wallet dengan tombol salin sekali klik.",
  },
  {
    icon: "🎵",
    title: "Backsound Musik Kustom",
    description:
      "Upload atau tempel URL musik favorit sebagai latar undangan (khusus PRO).",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      {/* Navbar */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-base font-semibold tracking-tight">
          💍 NikahYuk
        </Link>
        <nav className="flex items-center gap-3">
          <Suspense
            fallback={
              <Link
                href="/dashboard"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
              >
                Buat Undangan Gratis
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
                href="/dashboard"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Buat Undangan Gratis
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Buat Undangan Gratis
              </Link>
              <UserButton />
            </Show>
          </Suspense>
        </nav>
      </header>

      {/* Hero */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-6 pt-16 pb-20 text-center sm:pt-24">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          ✨ Platform Undangan Digital Pernikahan #1
        </span>
        <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-6xl">
          Buat Undangan Digital Pernikahan Mewah & Elegan dalam Hitungan Menit.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-400">
          Bagikan momen bahagiamu bersama NikahYuk. Pilih dari 18+ template
          eksklusif, atur cerita cinta, lokasi Google Maps, galeri foto, dan
          RSVP tamu secara instan.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Suspense
            fallback={
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-900 px-7 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
              >
                Mulai Buat Undangan
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          >
            <Show when="signed-out">
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-900 px-7 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Mulai Buat Undangan
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
                Mulai Buat Undangan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Show>
          </Suspense>
        </div>

        {/* Showcase template */}
        <section className="mt-20 w-full text-center">
          <span className="inline-flex items-center rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white dark:bg-zinc-50 dark:text-zinc-900">
            18+ Pilihan Template
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Template Unggulan
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-600 dark:text-zinc-400">
            Pratinjau langsung dengan datamu di builder — ganti template kapan
            pun tanpa mengulang isian.
          </p>
          <div className="mt-8 grid w-full gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
            {featuredTemplates.map((t) => (
              <Link
                key={t.id}
                href="/dashboard"
                className="group overflow-hidden rounded-2xl border border-zinc-200 transition-shadow hover:shadow-lg dark:border-zinc-800"
              >
                <div
                  className="flex h-28 items-end p-4"
                  style={{
                    background: `linear-gradient(135deg, ${t.swatches[0]} 0%, ${t.swatches[1]} 55%, ${t.swatches[2]} 130%)`,
                  }}
                >
                  <span className="rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                    {t.name}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5">
                    {t.swatches.map((c) => (
                      <span
                        key={c}
                        aria-hidden
                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t.category}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                    {t.tagline}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
                    <Check className="h-3.5 w-3.5" />
                    Coba template ini
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mt-20 w-full text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Kenapa NikahYuk?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-600 dark:text-zinc-400">
            Semua yang kamu butuhkan untuk undangan digital yang berkesan.
          </p>
          <div className="mt-8 grid w-full gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <p className="mb-4 text-2xl" aria-hidden>
                  {feature.icon}
                </p>
                <h3 className="text-sm font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
        © 2026 NikahYuk. All rights reserved.
      </footer>
    </div>
  );
}

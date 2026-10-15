import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Show, UserButton } from "@clerk/nextjs";
import { ArrowRight, Check, Eye, Heart, MapPin, Sparkles } from "lucide-react";
import { DEMO_INVITATION, TEMPLATE_REGISTRY } from "@/lib/templates";
import { InvitationTemplate } from "@/components/templates/InvitationTemplate";

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
        <Link href="/" className="flex flex-col gap-1" aria-label="NikahYuk — beranda">
          <Image
            src="/logo-nikahyuk.svg"
            alt="NikahYuk"
            width={360}
            height={60}
            priority
            className="h-9 w-auto sm:h-10 dark:rounded-lg dark:bg-white dark:px-2 dark:py-1"
          />
          <span className="text-[11px] font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
            Undangan Online, Lebih Mudah
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <Suspense
            fallback={
              <Link
                href="/dashboard"
                className="rounded-full bg-[#F4735C] px-4 py-2 text-sm font-medium text-white hover:bg-[#E15F47]"
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
                className="rounded-full bg-[#F4735C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E15F47]"
              >
                Buat Undangan Gratis
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="rounded-full bg-[#F4735C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E15F47]"
              >
                Buat Undangan Gratis
              </Link>
              <UserButton />
            </Show>
          </Suspense>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden px-6 pt-12 pb-20 sm:pt-16">
        {/* Aura gradien + dekorasi */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-[#F4735C]/15 blur-3xl" />
          <div className="absolute top-48 -right-24 h-80 w-80 rounded-full bg-[#E8A94E]/20 blur-3xl" />
          <div className="absolute top-96 -left-28 h-72 w-72 rounded-full bg-[#F4735C]/10 blur-3xl" />
          <div className="absolute top-8 right-6 h-44 w-44 rounded-full border border-[#F4735C]/20" />
          <div className="absolute top-14 right-12 h-32 w-32 rounded-full border border-[#E8A94E]/30" />
          <div className="absolute bottom-24 left-8 h-28 w-28 rounded-full border border-[#F4735C]/15" />
          <Sparkles className="absolute top-20 left-[10%] h-4 w-4 animate-pulse text-[#F4735C]/60" />
          <Sparkles className="absolute top-64 right-[8%] h-5 w-5 animate-pulse text-[#E8A94E]/70 [animation-delay:0.6s]" />
          <Heart className="absolute bottom-40 left-[6%] h-4 w-4 animate-pulse text-[#F4735C]/40 [animation-delay:1.2s]" />
          <span className="absolute top-40 left-[42%] h-1.5 w-1.5 rounded-full bg-[#E8A94E]/70" />
          <span className="absolute top-72 right-[38%] h-1 w-1 rounded-full bg-[#F4735C]/70" />
          <span className="absolute bottom-56 left-[30%] h-1.5 w-1.5 rounded-full bg-[#F4735C]/50" />
        </div>

        <div className="relative grid items-center gap-12 text-center lg:grid-cols-2 lg:text-left">
          <div className="flex flex-col items-center lg:items-start">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F4735C]/30 bg-[#F4735C]/10 px-3 py-1 text-xs font-medium text-[#C24E38] dark:border-[#F4735C]/40 dark:bg-[#F4735C]/10 dark:text-[#F49A86]">
              ✨ Platform Undangan Digital Pernikahan #1
            </span>
            <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-6xl">
              Buat Undangan Digital Pernikahan{" "}
              <span className="bg-gradient-to-r from-[#F4735C] to-[#E8A94E] bg-clip-text text-transparent">
                Mewah & Elegan
              </span>{" "}
              dalam Hitungan Menit.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-400">
              Bagikan momen bahagiamu bersama NikahYuk. Pilih dari 18+ template
              eksklusif, atur cerita cinta, lokasi Google Maps, galeri foto, dan
              RSVP tamu secara instan.
            </p>
            <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Suspense
                fallback={
                  <Link
                    href="/dashboard"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#F4735C] px-7 text-sm font-medium text-white shadow-lg shadow-[#F4735C]/30 hover:bg-[#E15F47]"
                  >
                    Mulai Buat Undangan
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                }
              >
                <Show when="signed-out">
                  <Link
                    href="/sign-up"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#F4735C] px-7 text-sm font-medium text-white shadow-lg shadow-[#F4735C]/30 transition-colors hover:bg-[#E15F47]"
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
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#F4735C] px-7 text-sm font-medium text-white shadow-lg shadow-[#F4735C]/30 transition-colors hover:bg-[#E15F47]"
                  >
                    Mulai Buat Undangan
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Show>
              </Suspense>
            </div>

            {/* Trust badge */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <div className="flex -space-x-2.5" aria-hidden>
                {[
                  { initials: "A&S", bg: "from-[#F4735C] to-[#E8A94E]" },
                  { initials: "R&D", bg: "from-[#1B2A4A] to-[#3B4F7A]" },
                  { initials: "Y&A", bg: "from-[#C98A94] to-[#7D8B7A]" },
                  { initials: "B&L", bg: "from-[#C9A227] to-[#8A5A2B]" },
                  { initials: "M&N", bg: "from-[#0B3B36] to-[#3F6B63]" },
                ].map((a) => (
                  <span
                    key={a.initials}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white ring-2 ring-white ${a.bg} dark:ring-black`}
                  >
                    {a.initials}
                  </span>
                ))}
              </div>
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                ⭐ 4.9/5 dari 1,000+ Pasangan Bahagia
              </p>
            </div>
          </div>

          {/* Mockup HP: preview undangan asli */}
          <div className="relative mx-auto w-full max-w-[290px]">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-[#F4735C]/25 via-[#E8A94E]/15 to-transparent blur-2xl"
            />
            <div className="relative overflow-hidden rounded-[2.5rem] border-[8px] border-zinc-900 bg-zinc-900 shadow-2xl dark:border-zinc-700">
              <div className="relative h-[540px] overflow-hidden bg-white">
                <div aria-hidden className="pointer-events-none absolute inset-0" inert>
                  <InvitationTemplate
                    title="Demo"
                    templateType="blossom"
                    content={DEMO_INVITATION}
                    guestName="Tamu Undangan"
                    rsvpSlot={null}
                  />
                </div>
              </div>
            </div>
            {/* Chip melayang */}
            <div className="absolute top-16 -right-4 flex items-center gap-1.5 rounded-2xl border border-zinc-200 bg-white/95 px-3 py-2 text-[11px] font-semibold shadow-xl backdrop-blur sm:-right-10 dark:border-zinc-700 dark:bg-zinc-900/95">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                <Check className="h-3 w-3" />
              </span>
              RSVP Terkirim
            </div>
            <div className="absolute bottom-20 -left-4 flex items-center gap-1.5 rounded-2xl border border-zinc-200 bg-white/95 px-3 py-2 text-[11px] font-semibold shadow-xl backdrop-blur sm:-left-10 dark:border-zinc-700 dark:bg-zinc-900/95">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F4735C] text-white">
                <MapPin className="h-3 w-3" />
              </span>
              Maps Terpasang
            </div>
          </div>
        </div>

        {/* Showcase template */}
        <section className="mt-20 w-full text-center">
          <span className="inline-flex items-center rounded-full bg-[#1B2A4A] px-4 py-1.5 text-xs font-semibold text-white">
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
                href={`/dashboard/builder/new?template=${t.id}`}
                className="group overflow-hidden rounded-2xl border border-zinc-200 transition-shadow hover:shadow-lg dark:border-zinc-800"
              >
                {/* Thumbnail asli: komponen template sungguhan + data demo —
                    ornamen khas (arch Aruna, kawung Puspaningrat, mihrab
                    Azzahra) ikut terlihat seperti di builder. */}
                <div className="relative h-64 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <div
                    aria-hidden
                    className="pointer-events-none h-full w-full overflow-hidden"
                  >
                    <InvitationTemplate
                      title="Demo"
                      templateType={t.id}
                      content={DEMO_INVITATION}
                      defaultOpened
                      rsvpSlot={null}
                    />
                  </div>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent"
                  />
                  <span className="pointer-events-none absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase backdrop-blur">
                    Demo
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center bg-[#1B2A4A]/45 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4735C] px-5 py-2.5 text-xs font-semibold text-white shadow-xl transition-transform group-hover:scale-105">
                      <Eye className="h-3.5 w-3.5" />
                      Lihat Demo
                    </span>
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
                  <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#1B2A4A] group-hover:underline dark:text-zinc-100">
                    Coba template ini
                    <ArrowRight className="h-3.5 w-3.5" />
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
      <footer className="border-t border-zinc-200 py-8 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2 px-6 text-center">
          <Image
            src="/logo-nikahyuk.svg"
            alt="NikahYuk"
            width={320}
            height={53}
            className="h-8 w-auto sm:h-9 dark:rounded-lg dark:bg-white dark:px-2 dark:py-1"
          />
          <p className="text-[11px] font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
            Undangan Online, Lebih Mudah
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            © 2026 NikahYuk. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useCallback, type KeyboardEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye } from "lucide-react";
import { InvitationTemplate } from "@/components/templates/InvitationTemplate";
import { StaticPreview } from "@/components/templates/parts";
import { DEMO_INVITATION, type TemplateMeta } from "@/lib/templates";

/**
 * Kartu template unggulan di landing page.
 *
 * Kenapa BUKAN `<Link>`:
 * thumbnail di dalam kartu memakai komponen template sungguhan, dan
 * template itu merender tautan Google Maps (`<a href={e.maps}>`). Kalau
 * kartu dibungkus `<Link>` (yang jadi `<a>`), hasilnya `<a>` di dalam
 * `<a>` — violates HTML spec. Parser HTML lalu MENUTUP `<a>` luar
 * otomatis saat menemukan `<a>` dalam, sehingga struktur DOM hasil
 * parse berbeda dari yang diharapkan React → hydration mismatch.
 *
 * Solusinya: pembungkus jadi `<div>` + navigasi via `useRouter`, dengan
 * affordance aksesibilitas (role="link", tabIndex, onKeyDown) supaya
 * tetap bisa dioperasikan keyboard.
 *
 * Elemen interaktif di dalam preview (tautan Maps, tombol musik) TIDAK
 * boleh memicu navigasi kartu — dicek lewat `closest()` pada event
 * target, bukan `stopPropagation()` di dalam template (template adalah
 * komponen bersama yang juga dipakai halaman undangan asli).
 */
export function FeaturedTemplateCard({ meta }: { meta: TemplateMeta }) {
  const router = useRouter();
  const href = `/dashboard/builder/new?template=${meta.id}`;

  const navigate = useCallback(() => {
    router.push(href);
  }, [router, href]);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    // Abaikan klik yang berasal dari elemen interaktif di dalam preview
    // (tautan Maps, tombol audio) — klik itu harus memakai elemennya
    // sendiri, bukan memaksa navigasi kartu.
    const target = event.target as HTMLElement | null;
    if (target?.closest("a, button, input, select, textarea")) return;
    navigate();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate();
    }
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 transition-shadow hover:shadow-lg dark:border-zinc-800"
    >
      {/* Thumbnail asli: komponen template sungguhan + data demo —
          ornamen khas (arch Aruna, kawung Puspaningrat, mihrab
          Azzahra) ikut terlihat seperti di builder. */}
      <div className="relative h-64 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <div
          aria-hidden
          className="pointer-events-none h-full w-full overflow-hidden"
        >
          <StaticPreview>
            <InvitationTemplate
              title="Demo"
              templateType={meta.id}
              content={DEMO_INVITATION}
              defaultOpened
              rsvpSlot={null}
            />
          </StaticPreview>
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
          {meta.swatches.map((c) => (
            <span
              key={c}
              aria-hidden
              className="h-3.5 w-3.5 rounded-full border border-black/10"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <p className="mt-2 text-sm font-semibold">{meta.name}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {meta.category}
        </p>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
          {meta.tagline}
        </p>
        <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#1B2A4A] group-hover:underline dark:text-zinc-100">
          Coba template ini
          <ArrowRight className="h-3.5 w-3.5" />
        </p>
      </div>
    </div>
  );
}

"use client";

import { resolveTemplate, type TemplateId } from "@/lib/invitation";
import { TEMPLATE_COMPONENTS } from "./registry";
import type { TemplateProps } from "./types";

export type { TemplateId };

/**
 * Dispatcher template undangan.
 *
 * TIDAK lagi meng-import 24 template secara statis (sebelumnya seluruh
 * desain ikut ter-bundle dalam satu chunk ~197 KB dan terunduh setiap kali
 * seorang tamu membuka satu undangan). Sekarang tiap template dimuat
 * lewat `next/dynamic` di `registry.ts`, sehingga browser hanya mengambil
 * chunk template yang benar-benar dipakai.
 *
 * SSR tetap berjalan (`ssr: true` bawaan `next/dynamic`), jadi halaman
 * publik tetap ter-render di server untuk SEO dan first paint.
 */
export function InvitationTemplate({
  templateType,
  ...props
}: TemplateProps & { templateType: string }) {
  const id = resolveTemplate(templateType);
  // `resolveTemplate` selalu mengembalikan TemplateId yang valid, tapi
  // fallback ini tetap dijaga untuk id rusak/ unforeseen (mis. prototype
  // chain) agar halaman tidak pernah crash.
  const Template = TEMPLATE_COMPONENTS[id] ?? TEMPLATE_COMPONENTS.minimalist;
  return <Template {...props} />;
}

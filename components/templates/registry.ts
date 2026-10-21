"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { TemplateId } from "@/lib/invitation";
import { TemplateLoading } from "./TemplateLoading";
import type { TemplateProps } from "./types";

/**
 * Registri komponen template — 24 template, masing-masing chunk terpisah.
 *
 * SEBELUMNYA semua template di-import statis di `InvitationTemplate.tsx`,
 * sehingga satu chunk ~197 KB berisi seluruh desain ikut terunduh setiap
 * kali seorang tamu membuka satu undangan. Dengan `next/dynamic`, browser
 * hanya mengambil chunk template yang benar-benar dipakai.
 *
 * PENTING: `import()` harus ditulis LITERAL di dalam setiap pemanggilan
 * `dynamic()` — kalau loader-nya dibungkus fungsi pembantu, bundler tidak
 * bisa membuat chunk terpisah dan seluruh template ikut ter-bundle lagi.
 *
 * `Record<TemplateId, ...>` memastikan kelengkapan registri: kalau ada
 * template baru di `lib/invitation.ts` tapi lupa didaftarkan di sini,
 * TypeScript akan gagal build.
 */
export const TEMPLATE_COMPONENTS: Record<
  TemplateId,
  ComponentType<TemplateProps>
> = {
  // --- 18 template katalog ---
  aruna: dynamic(() => import("./ArunaTemplate").then((m) => m.ArunaTemplate), {
    loading: TemplateLoading,
  }),
  mahardika: dynamic(
    () => import("./MahardikaTemplate").then((m) => m.MahardikaTemplate),
    { loading: TemplateLoading }
  ),
  puspaningrat: dynamic(
    () => import("./PuspaningratTemplate").then((m) => m.PuspaningratTemplate),
    { loading: TemplateLoading }
  ),
  azzahra: dynamic(
    () => import("./AzzahraTemplate").then((m) => m.AzzahraTemplate),
    { loading: TemplateLoading }
  ),
  seruni: dynamic(
    () => import("./SeruniTemplate").then((m) => m.SeruniTemplate),
    { loading: TemplateLoading }
  ),
  elan: dynamic(() => import("./ElanTemplate").then((m) => m.ElanTemplate), {
    loading: TemplateLoading,
  }),
  kala: dynamic(() => import("./KalaTemplate").then((m) => m.KalaTemplate), {
    loading: TemplateLoading,
  }),
  senja: dynamic(() => import("./SenjaTemplate").then((m) => m.SenjaTemplate), {
    loading: TemplateLoading,
  }),
  verdant: dynamic(
    () => import("./VerdantGlassTemplate").then((m) => m.VerdantGlassTemplate),
    { loading: TemplateLoading }
  ),
  terra: dynamic(
    () => import("./RusticTerraTemplate").then((m) => m.RusticTerraTemplate),
    { loading: TemplateLoading }
  ),
  heritage: dynamic(
    () =>
      import("./SurabayaHeritageTemplate").then(
        (m) => m.SurabayaHeritageTemplate
      ),
    { loading: TemplateLoading }
  ),
  celestial: dynamic(
    () => import("./CelestialNightTemplate").then((m) => m.CelestialNightTemplate),
    { loading: TemplateLoading }
  ),
  parisian: dynamic(
    () =>
      import("./ParisianEditorialTemplate").then(
        (m) => m.ParisianEditorialTemplate
      ),
    { loading: TemplateLoading }
  ),
  blossom: dynamic(
    () => import("./BlossomSageTemplate").then((m) => m.BlossomSageTemplate),
    { loading: TemplateLoading }
  ),
  balinese: dynamic(
    () => import("./RoyalBalineseTemplate").then((m) => m.RoyalBalineseTemplate),
    { loading: TemplateLoading }
  ),
  mono: dynamic(
    () => import("./MinimalistMonoTemplate").then((m) => m.MinimalistMonoTemplate),
    { loading: TemplateLoading }
  ),
  arabesque: dynamic(
    () => import("./ArabesqueSakralTemplate").then((m) => m.ArabesqueSakralTemplate),
    { loading: TemplateLoading }
  ),
  retro: dynamic(
    () => import("./RetroSunsetTemplate").then((m) => m.RetroSunsetTemplate),
    { loading: TemplateLoading }
  ),

  // --- 6 template lawas (kompatibilitas data lama) ---
  elegant: dynamic(
    () => import("./ElegantTemplate").then((m) => m.ElegantTemplate),
    { loading: TemplateLoading }
  ),
  rustic: dynamic(() => import("./RusticTemplate").then((m) => m.RusticTemplate), {
    loading: TemplateLoading,
  }),
  floral: dynamic(() => import("./FloralTemplate").then((m) => m.FloralTemplate), {
    loading: TemplateLoading,
  }),
  minimalist: dynamic(
    () => import("./MinimalistTemplate").then((m) => m.MinimalistTemplate),
    { loading: TemplateLoading }
  ),
  luxury: dynamic(() => import("./LuxuryTemplate").then((m) => m.LuxuryTemplate), {
    loading: TemplateLoading,
  }),
  sage: dynamic(() => import("./SageTemplate").then((m) => m.SageTemplate), {
    loading: TemplateLoading,
  }),
};

"use client";

import { useMemo, useState } from "react";
import { Check, Eye, LayoutGrid, Lock, X } from "lucide-react";
import { FREE_TEMPLATE_ID } from "@/lib/entitlements";
import type { CatalogTemplateId } from "@/lib/invitation";
import {
  DEMO_INVITATION,
  TEMPLATE_REGISTRY,
  type TemplateMeta,
} from "@/lib/templates";
import { InvitationTemplate } from "./InvitationTemplate";

export type TemplateFilter =
  | "Semua"
  | "Minimalis"
  | "Adat"
  | "Luxury"
  | "Islami";

export const TEMPLATE_FILTERS: TemplateFilter[] = [
  "Semua",
  "Minimalis",
  "Adat",
  "Luxury",
  "Islami",
];

/** Pemetaan setiap id template ke satu kategori filter katalog. */
const GROUP_BY_ID: Record<string, TemplateFilter> = {
  aruna: "Minimalis",
  elan: "Minimalis",
  mono: "Minimalis",
  senja: "Minimalis",
  kala: "Minimalis",
  blossom: "Minimalis",
  terra: "Minimalis",
  seruni: "Minimalis",
  retro: "Minimalis",
  puspaningrat: "Adat",
  heritage: "Adat",
  balinese: "Adat",
  mahardika: "Luxury",
  celestial: "Luxury",
  parisian: "Luxury",
  verdant: "Luxury",
  azzahra: "Islami",
  arabesque: "Islami",
};

export function templateGroupFor(id: string): TemplateFilter {
  return GROUP_BY_ID[id] ?? "Minimalis";
}

function TemplateCard({
  meta,
  selected,
  locked,
  onPreview,
  onSelect,
}: {
  meta: TemplateMeta;
  selected: boolean;
  locked: boolean;
  onPreview: () => void;
  onSelect: () => void;
}) {
  return (
    <div
      className={`min-w-0 overflow-hidden rounded-2xl border bg-white transition-shadow dark:bg-zinc-950 ${
        selected
          ? "border-zinc-900 shadow-lg dark:border-zinc-100"
          : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      {/* Thumbnail: komponen asli + data demo, tanpa interaksi.
          Tinggi tetap + overflow-hidden agar preview terpotong rapi;
          badge melayang di dalam frame thumbnail sehingga tidak
          menutupi teks nama template di badan kartu. */}
      <div className="relative h-56 overflow-hidden rounded-t-lg bg-zinc-100 dark:bg-zinc-900">
        <div aria-hidden className="pointer-events-none h-full w-full overflow-hidden">
          <InvitationTemplate
            title="Demo"
            templateType={meta.id}
            content={DEMO_INVITATION}
            defaultOpened
            rsvpSlot={null}
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/60 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/50 to-transparent"
        />
        <span className="pointer-events-none absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase backdrop-blur">
          Demo
        </span>
        {locked && (
          <span className="pointer-events-none absolute top-2 right-2 inline-flex items-center gap-0.5 rounded-full bg-amber-400/95 px-2 py-0.5 text-[10px] font-semibold text-amber-950">
            <Lock className="h-2.5 w-2.5" />
            PRO
          </span>
        )}
        {selected && (
          <span
            className={`pointer-events-none absolute right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white shadow ring-2 ring-white/80 ${
              locked ? "bottom-2" : "top-2"
            }`}
            title="Template dipilih"
          >
            <Check className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-col p-3">
        <div className="flex items-center gap-1.5">
          {meta.swatches.map((c) => (
            <span
              key={c}
              aria-hidden
              className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10"
              style={{ backgroundColor: c }}
            />
          ))}
          <span className="ml-auto shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {templateGroupFor(meta.id)}
          </span>
        </div>
        <p className="mt-1.5 truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {meta.name}
        </p>
        <p className="truncate text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
          {meta.category}
        </p>
        <p className="mt-1 line-clamp-2 min-h-8 text-[11px] leading-snug break-words text-zinc-600 dark:text-zinc-400">
          {meta.tagline}
        </p>
        <div className="mt-2 grid min-w-0 grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex h-8 min-w-0 items-center justify-center gap-1 truncate rounded-full border border-zinc-200 px-2 text-xs font-medium whitespace-nowrap text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            <Eye className="h-3.5 w-3.5 shrink-0" /> Preview
          </button>
          <button
            type="button"
            onClick={onSelect}
            title={
              locked
                ? `Preview template ${meta.name} (khusus PRO saat menyimpan)`
                : selected
                  ? `Template ${meta.name} sedang dipilih`
                  : `Pilih template ${meta.name}`
            }
            className={`inline-flex h-8 min-w-0 items-center justify-center gap-1 truncate rounded-full px-2 text-xs font-medium whitespace-nowrap transition-colors ${
              selected
                ? "bg-green-600 text-white"
                : locked
                  ? "bg-zinc-900 text-amber-300 hover:bg-zinc-700 dark:bg-zinc-50 dark:text-amber-700"
                  : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
            }`}
          >
            {selected ? (
              <>
                <Check className="h-3.5 w-3.5 shrink-0" /> Dipilih
              </>
            ) : locked ? (
              <>
                <Lock className="h-3.5 w-3.5 shrink-0" /> Pilih
              </>
            ) : (
              "Pilih"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Katalog template: thumbnail dirender dari KOMPONEN template asli
 * (bukan mockup palsu) dengan data demo yang ditandai jelas.
 * Memilih template hanya mengubah templateId — konten pengguna
 * tidak disentuh/di-reset. Dilengkapi filter kategori.
 */
export function TemplateCatalog({
  value,
  onChange,
  isPro,
}: {
  value: string;
  onChange: (id: CatalogTemplateId) => void;
  isPro: boolean;
}) {
  const [previewId, setPreviewId] = useState<CatalogTemplateId | null>(null);
  const [filter, setFilter] = useState<TemplateFilter>("Semua");

  const visible = useMemo(
    () =>
      filter === "Semua"
        ? TEMPLATE_REGISTRY
        : TEMPLATE_REGISTRY.filter((t) => templateGroupFor(t.id) === filter),
    [filter]
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter kategori template">
        {TEMPLATE_FILTERS.map((f) => {
          const active = filter === f;
          const count =
            f === "Semua"
              ? TEMPLATE_REGISTRY.length
              : TEMPLATE_REGISTRY.filter((t) => templateGroupFor(t.id) === f).length;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={active}
              className={`inline-flex h-8 items-center gap-1 rounded-full px-3 text-xs font-medium whitespace-nowrap transition-colors ${
                active
                  ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                  : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
              }`}
            >
              {f}
              <span className={`text-[10px] ${active ? "opacity-70" : "opacity-50"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {visible.map((t) => (
          <TemplateCard
            key={t.id}
            meta={t}
            selected={value === t.id}
            locked={!isPro && t.id !== FREE_TEMPLATE_ID}
            onPreview={() => setPreviewId(t.id)}
            onSelect={() => onChange(t.id)}
          />
        ))}
      </div>
      {!isPro && (
        <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
          Paket Free tersimpan dengan template Aruna. Preview template PRO bebas
          dicoba — upgrade ke PRO untuk menyimpan & mempublish dengan template
          tersebut.
        </p>
      )}

      {previewId && (
        <TemplatePreviewModal
          templateId={previewId}
          isPro={isPro}
          selected={value === previewId}
          onSelect={() => {
            onChange(previewId);
            setPreviewId(null);
          }}
          onClose={() => setPreviewId(null)}
        />
      )}
    </div>
  );
}

/**
 * Selector ringkas untuk panel editor: menampilkan template aktif
 * + tombol "Lihat Semua Template (N)" yang membuka modal katalog.
 */
export function CompactTemplateSelector({
  value,
  onChange,
  isPro,
}: {
  value: string;
  onChange: (id: CatalogTemplateId) => void;
  isPro: boolean;
}) {
  const [open, setOpen] = useState(false);
  const active =
    TEMPLATE_REGISTRY.find((t) => t.id === value) ?? TEMPLATE_REGISTRY[0];
  const locked = !isPro && active.id !== FREE_TEMPLATE_ID;

  return (
    <div>
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex shrink-0 items-center gap-1" aria-hidden>
          {active.swatches.map((c) => (
            <span
              key={c}
              className="h-5 w-5 rounded-full border border-black/10"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {active.name}
            {locked && (
              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                <Lock className="h-2.5 w-2.5" />
                PRO
              </span>
            )}
          </p>
          <p className="truncate text-[11px] text-zinc-600 dark:text-zinc-400">
            {active.category}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-zinc-900 px-4 text-xs font-medium whitespace-nowrap text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          Lihat Semua Template ({TEMPLATE_REGISTRY.length})
        </button>
      </div>

      <TemplateCatalogModal
        open={open}
        value={value}
        onChange={onChange}
        isPro={isPro}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

/** Modal katalog: grid rapi + filter kategori + tombol Pilih per kartu. */
export function TemplateCatalogModal({
  open,
  value,
  onChange,
  isPro,
  onClose,
}: {
  open: boolean;
  value: string;
  onChange: (id: CatalogTemplateId) => void;
  isPro: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Katalog template"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Pilih Template ({TEMPLATE_REGISTRY.length})
            </h3>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              Klik “Pilih” pada kartu untuk mengganti preview secara instan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup katalog template"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">
          <TemplateCatalog
            value={value}
            onChange={(id) => {
              onChange(id);
              onClose();
            }}
            isPro={isPro}
          />
        </div>
      </div>
    </div>
  );
}

/** Preview penuh komponen asli dalam bingkai ponsel + data demo. */
function TemplatePreviewModal({
  templateId,
  isPro,
  selected,
  onSelect,
  onClose,
}: {
  templateId: CatalogTemplateId;
  isPro: boolean;
  selected: boolean;
  onSelect: () => void;
  onClose: () => void;
}) {
  const meta = TEMPLATE_REGISTRY.find((t) => t.id === templateId);
  const locked = !isPro && templateId !== FREE_TEMPLATE_ID;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview template ${meta?.name ?? templateId}`}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-[400px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <div>
            <p className="text-sm font-semibold">
              {meta?.name}{" "}
              <span className="ml-1 rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-semibold uppercase dark:bg-white/10">
                Demo
              </span>
            </p>
            <p className="text-xs text-zinc-500">{meta?.category} · data contoh, tidak disimpan</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup preview"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-lg leading-none transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto">
          <InvitationTemplate
            key={templateId}
            title="Demo Undangan"
            templateType={templateId}
            content={DEMO_INVITATION}
            guestName="Tamu Undangan"
            rsvpSlot={
              <div className="rounded-2xl border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-500 dark:border-zinc-700">
                Form Ucapan & RSVP tampil di sini pada halaman live.
              </div>
            }
          />
        </div>
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          {locked && (
            <p className="mb-2 text-center text-xs text-amber-700 dark:text-amber-400">
              Template ini khusus PRO saat menyimpan — preview bebas dicoba.
            </p>
          )}
          <button
            type="button"
            onClick={onSelect}
            className={`h-11 w-full rounded-full text-sm font-medium transition-colors ${
              selected
                ? "bg-green-600 text-white"
                : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
            }`}
          >
            {selected
              ? "✓ Template ini sedang dipilih"
              : `Gunakan Template ${meta?.name}`}
          </button>
        </div>
      </div>
    </div>
  );
}

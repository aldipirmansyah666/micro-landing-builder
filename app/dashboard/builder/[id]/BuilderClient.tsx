"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Crown,
  ExternalLink,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Minus,
  Music,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type { LandingPage } from "@/lib/db";
import {
  FREE_TEMPLATE_ID,
  maxGallery,
  type Plan,
} from "@/lib/entitlements";
import {
  resolveTemplate,
  slugify,
  toInvitationContent,
  type GiftAccount,
  type InvitationContent,
} from "@/lib/invitation";
import { InvitationTemplate } from "@/components/templates/InvitationTemplate";
import { CompactTemplateSelector } from "@/components/templates/TemplateCatalog";
import { SafeImg } from "@/components/templates/shared";
import { UpgradeProButton } from "@/components/billing/UpgradeProModal";
import { TEMPLATE_REGISTRY, templateLabel } from "@/lib/templates";

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-400";

const labelClass =
  "mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function Accordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 bg-zinc-50 px-4 py-3.5 text-left text-sm font-semibold tracking-tight transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="space-y-4 p-4">{children}</div>}
    </div>
  );
}

function EventFields({
  prefix,
  title,
  content,
  onChange,
}: {
  prefix: "akad" | "reception";
  title: string;
  content: InvitationContent;
  onChange: (patch: Partial<InvitationContent>) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">{title}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tanggal">
          <input
            type="date"
            value={prefix === "akad" ? content.akadDate : content.receptionDate}
            onChange={(e) =>
              onChange(
                prefix === "akad"
                  ? { akadDate: e.target.value }
                  : { receptionDate: e.target.value }
              )
            }
            className={inputClass}
          />
        </Field>
        <Field label="Jam">
          <input
            type="time"
            value={prefix === "akad" ? content.akadTime : content.receptionTime}
            onChange={(e) =>
              onChange(
                prefix === "akad"
                  ? { akadTime: e.target.value }
                  : { receptionTime: e.target.value }
              )
            }
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Alamat / Gedung">
        <input
          value={prefix === "akad" ? content.akadVenue : content.receptionVenue}
          onChange={(e) =>
            onChange(
              prefix === "akad"
                ? { akadVenue: e.target.value }
                : { receptionVenue: e.target.value }
            )
          }
          placeholder="cth: Gedung Serbaguna, Jakarta"
          className={inputClass}
        />
      </Field>
      <Field label="Link Google Maps">
        <input
          value={prefix === "akad" ? content.akadMapsUrl : content.receptionMapsUrl}
          onChange={(e) =>
            onChange(
              prefix === "akad"
                ? { akadMapsUrl: e.target.value }
                : { receptionMapsUrl: e.target.value }
            )
          }
          placeholder="https://maps.google.com/..."
          inputMode="url"
          className={inputClass}
        />
      </Field>
    </div>
  );
}

export function TemplatePreviewDropdown({
  value,
  isPro,
  onSelect,
}: {
  value: string;
  isPro: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">
      <span aria-hidden className="shrink-0 text-base">
        🎨
      </span>
      <span className="shrink-0 text-xs font-medium text-zinc-600 dark:text-zinc-400">
        Preview Template:
      </span>
      <span className="relative min-w-0 flex-1">
        <select
          value={value}
          onChange={(e) => onSelect(e.target.value)}
          aria-label="Pilih template untuk preview"
          className="w-full appearance-none truncate bg-transparent pr-6 text-xs font-semibold outline-none"
        >
          {TEMPLATE_REGISTRY.map((t) => {
            const needsPro = !isPro && t.id !== FREE_TEMPLATE_ID;
            return (
              <option key={t.id} value={t.id}>
                {t.name}
                {needsPro ? " • PRO" : ""}
              </option>
            );
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-0 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
      </span>
    </label>
  );
}

function ProTemplateInfoModal({
  templateId,
  savedSlug,
  onClose,
}: {
  templateId: string;
  savedSlug: string | null;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Template khusus PRO"
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-6 text-zinc-900 shadow-2xl dark:bg-zinc-950 dark:text-zinc-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="inline-flex items-center gap-2 text-base font-semibold tracking-tight">
            <Crown className="h-5 w-5 text-amber-500" />
            {templateLabel(templateId)}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup info PRO"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-sm opacity-70">
          Template ini khusus PRO. Kamu tetap bisa{" "}
          <span className="font-medium">preview secara real-time</span> dengan
          semua data form yang sedang diisi — tanpa terkunci.
        </p>
        <p className="mt-2 text-sm opacity-70">
          Upgrade ke PRO untuk menyimpan & mempublish undangan dengan template
          ini. Paket Free tersimpan dengan template Aruna.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 flex-1 rounded-full border border-zinc-200 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Tetap Preview
          </button>
          {savedSlug ? (
            <div className="flex-1 [&>button]:w-full">
              <UpgradeProButton slug={savedSlug} />
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="h-10 flex-1 rounded-full bg-amber-400 text-sm font-semibold text-amber-950 transition-colors hover:bg-amber-300"
            >
              Mengerti
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function BuilderClient({
  mode,
  initial,
  plan,
  initialTemplate,
}: {
  mode: "new" | "edit";
  initial: LandingPage | null;
  plan: Plan;
  /** Deep-link ?template= dari landing page (hanya dipakai mode "new"). */
  initialTemplate?: string;
}) {
  const seed = useMemo(
    () => toInvitationContent(initial?.content_json),
    [initial]
  );
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [templateType, setTemplateType] = useState<string>(
    resolveTemplate(
      mode === "new"
        ? (initialTemplate ?? initial?.template_type ?? FREE_TEMPLATE_ID)
        : (initial?.template_type ?? FREE_TEMPLATE_ID)
    )
  );
  const [content, setContent] = useState<InvitationContent>(seed);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(
    initial?.slug ?? null
  );
  const [previewGuest, setPreviewGuest] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  // Preview langsung menampilkan isi (cover terbuka) agar foto cover
  // langsung kelihatan; matikan untuk memeriksa tampilan cover tertutup.
  const [previewOpened, setPreviewOpened] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Toast sukses menghilang otomatis setelah 3 detik; error tetap
  // sampai ditutup manual agar tidak kelewat dibaca.
  useEffect(() => {
    if (message?.type !== "success") return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);

  function patch(p: Partial<InvitationContent>) {
    setContent((c) => ({ ...c, ...p }));
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function uploadFile(file: File): Promise<{ url: string; warning?: string }> {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = (await res.json()) as { ok?: boolean; url?: string; warning?: string; error?: string };
    if (!res.ok || !data.url) throw new Error(data.error ?? "Gagal mengunggah file");
    return { url: data.url, warning: data.warning };
  }

  async function runUpload(kind: string, fn: () => Promise<void>) {
    setUploading(kind);
    setMessage(null);
    try {
      await fn();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Gagal mengunggah",
      });
    } finally {
      setUploading(null);
    }
  }

  function updateAccount(idx: number, p: Partial<GiftAccount>) {
    setContent((c) => ({
      ...c,
      accounts: c.accounts.map((a, i) => (i === idx ? { ...a, ...p } : a)),
    }));
  }

  const isPro = plan === "pro";
  const galleryLimit = maxGallery(plan);
  // Real-Time Multi-Template Preview:
  // - `templateType` adalah draft pilihan pengguna (boleh PRO walau akun Free)
  //   dan HANYA mengubah template — state `content` tidak disentuh sehingga
  //   data form (nama, foto cover, lokasi, gallery) tetap utuh & reaktif.
  // - `effectiveTemplateType` adalah yang benar-benar disimpan ke server
  //   (Free selalu Aruna). Preview memakai draft agar PRO bisa dicoba
  //   tanpa terkunci; banner/modal PRO tampil dengan halus.
  const effectiveTemplateType = isPro ? templateType : FREE_TEMPLATE_ID;
  const previewTemplateType = resolveTemplate(templateType);
  const isPreviewProTemplate =
    !isPro && previewTemplateType !== FREE_TEMPLATE_ID;
  const [proInfoTemplate, setProInfoTemplate] = useState<string | null>(null);

  function handleTemplateSelect(id: string) {
    const normalized = resolveTemplate(id);
    // Instan: hanya set template, jangan reset `content`/form lainnya.
    setTemplateType(normalized);
    if (!isPro && normalized !== FREE_TEMPLATE_ID) {
      setProInfoTemplate(normalized);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/pages/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim(),
          title: title.trim(),
          template_type: effectiveTemplateType,
          content_json: content,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        created?: boolean;
        page?: { slug: string; template_type?: string };
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan perubahan");
      const finalSlug = data.page?.slug ?? slug.trim();
      setSavedSlug(finalSlug);
      // Samakan state dengan yang benar-benar tersimpan (kanonis dari
      // server) agar preview tidak stale dan pasti sama dengan live view.
      if (data.page?.template_type) {
        setTemplateType(resolveTemplate(data.page.template_type));
      }
      setMessage({
        type: "success",
        text: data.created
          ? "Undangan berhasil dibuat!"
          : "Perubahan berhasil disimpan.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Gagal menyimpan perubahan",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-6 py-3.5">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              aria-label="Kembali ke dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-base font-semibold tracking-tight">
              {mode === "new" ? "Buat Undangan Digital" : "Edit Undangan Digital"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {!isPro && savedSlug ? (
              <UpgradeProButton slug={savedSlug} />
            ) : (
              isPro && (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  PRO
                </span>
              )
            )}
            {savedSlug && (
              <Link
                href={`/p/${savedSlug}`}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-zinc-200 px-4 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Lihat Live</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving || uploading !== null}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Simpan Perubahan
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-6 py-8 lg:grid-cols-2">
        {/* Form editor kiri */}
        <section className="h-fit space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-semibold tracking-tight">Editor Undangan</h2>

          <Field label="Template">
            <CompactTemplateSelector
              value={templateType}
              onChange={handleTemplateSelect}
              isPro={isPro}
            />
            {!isPro && templateType !== FREE_TEMPLATE_ID && (
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                Preview memakai {templateLabel(templateType)} (PRO). Yang
                tersimpan untuk paket Free tetap Aruna.
              </p>
            )}
          </Field>

          <Accordion title="📌 Informasi Dasar & Slug" defaultOpen>
            <Field label="Judul Undangan">
              <input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="cth: Pernikahan Andi & Sinta"
                className={inputClass}
              />
            </Field>
            <Field label="Slug (link halaman)">
              <div className="flex items-center">
                <span className="rounded-l-xl border border-r-0 border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                  /p/
                </span>
                <input
                  value={slug}
                  disabled={mode === "edit"}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="andi-sinta"
                  className={`${inputClass} rounded-l-none`}
                />
              </div>
            </Field>
            <Field label="Kata Pengantar / Quote">
              <textarea
                value={content.quote}
                onChange={(e) => patch({ quote: e.target.value })}
                rows={3}
                placeholder="Kutipan atau salam pembuka undangan..."
                className={`${inputClass} resize-none`}
              />
            </Field>
          </Accordion>

          <Accordion title="💍 Profil Mempelai Pria & Wanita">
            <p className="text-sm font-medium">Mempelai Pria</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama Lengkap">
                <input
                  value={content.groomFullName}
                  onChange={(e) => patch({ groomFullName: e.target.value })}
                  placeholder="Andi Pratama"
                  className={inputClass}
                />
              </Field>
              <Field label="Nama Panggilan">
                <input
                  value={content.groomNickname}
                  onChange={(e) => patch({ groomNickname: e.target.value })}
                  placeholder="Andi"
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Nama Orang Tua (Pria)">
              <input
                value={content.groomParents}
                onChange={(e) => patch({ groomParents: e.target.value })}
                placeholder="Bpk. Harto & Ibu Wulan"
                className={inputClass}
              />
            </Field>
            <p className="pt-2 text-sm font-medium">Mempelai Wanita</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama Lengkap">
                <input
                  value={content.brideFullName}
                  onChange={(e) => patch({ brideFullName: e.target.value })}
                  placeholder="Sinta Dewi"
                  className={inputClass}
                />
              </Field>
              <Field label="Nama Panggilan">
                <input
                  value={content.brideNickname}
                  onChange={(e) => patch({ brideNickname: e.target.value })}
                  placeholder="Sinta"
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Nama Orang Tua (Wanita)">
              <input
                value={content.brideParents}
                onChange={(e) => patch({ brideParents: e.target.value })}
                placeholder="Bpk. Joko & Ibu Ratna"
                className={inputClass}
              />
            </Field>
          </Accordion>

          <Accordion title="📅 Detail Akad & Resepsi">
            <EventFields prefix="akad" title="Detail Akad" content={content} onChange={patch} />
            <EventFields
              prefix="reception"
              title="Detail Resepsi"
              content={content}
              onChange={patch}
            />
            <button
              type="button"
              onClick={() =>
                patch({
                  receptionDate: content.akadDate,
                  receptionTime: content.akadTime,
                  receptionVenue: content.akadVenue,
                  receptionMapsUrl: content.akadMapsUrl,
                })
              }
              className="text-xs font-medium text-zinc-600 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Samakan dengan detail Akad
            </button>
          </Accordion>

          <Accordion title="🖼️ Media">
            <Field label="Foto Cover">
              <div className="flex items-center gap-2">
                <input
                  ref={coverRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (coverRef.current) coverRef.current.value = "";
                    if (f)
                      void runUpload("cover", async () => {
                        const r = await uploadFile(f);
                        patch({ heroImage: r.url });
                        if (r.warning)
                          setMessage({ type: "error", text: r.warning });
                      });
                  }}
                />
                <button
                  type="button"
                  onClick={() => coverRef.current?.click()}
                  disabled={uploading !== null}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 px-4 text-sm font-medium transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  {uploading === "cover" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                  {content.heroImage ? "Ganti Foto" : "Upload Foto"}
                </button>
                {content.heroImage && (
                  <button
                    type="button"
                    onClick={() => patch({ heroImage: "" })}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-200 text-red-600 dark:border-red-900 dark:text-red-400"
                    aria-label="Hapus foto cover"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </Field>
            <Field label="URL Backsound Audio 🔒 PRO">
              <div className="flex items-center gap-2">
                <input
                  value={content.backsoundUrl}
                  disabled={!isPro}
                  onChange={(e) => patch({ backsoundUrl: e.target.value })}
                  placeholder={
                    isPro
                      ? "https://.../backsound.mp3"
                      : "Khusus PRO — upgrade untuk mengaktifkan"
                  }
                  inputMode="url"
                  className={`${inputClass} disabled:opacity-50`}
                />
                <input
                  ref={audioRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (audioRef.current) audioRef.current.value = "";
                    if (f)
                      void runUpload("audio", async () => {
                        const r = await uploadFile(f);
                        patch({ backsoundUrl: r.url });
                        if (r.warning)
                          setMessage({ type: "error", text: r.warning });
                      });
                  }}
                />
                <button
                  type="button"
                  onClick={() => audioRef.current?.click()}
                  disabled={uploading !== null || !isPro}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                  aria-label="Upload file audio"
                  title={
                    isPro
                      ? "Upload file audio (MP3/Ogg/WAV, maks 10MB)"
                      : "Khusus PRO"
                  }
                >
                  {uploading === "audio" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Music className="h-4 w-4" />
                  )}
                </button>
              </div>
              {!isPro && (
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                  Backsound musik khusus PRO.
                </p>
              )}
            </Field>
            <Field
              label={`Galeri Foto (${content.galleryImages.length}/${galleryLimit})`}
            >
              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = [...(e.target.files ?? [])];
                  if (galleryRef.current) galleryRef.current.value = "";
                    if (files.length > 0)
                      void runUpload("gallery", async () => {
                        const room = Math.max(
                          galleryLimit - content.galleryImages.length,
                          0
                        );
                        if (room <= 0) {
                          throw new Error(
                            `Galeri penuh (maks ${galleryLimit} foto untuk paket ${isPro ? "PRO" : "Free"})`
                          );
                        }
                        const results = await Promise.all(
                          files.slice(0, room).map(uploadFile)
                        );
                        const urls = results.map((r) => r.url);
                        const warning = results.find((r) => r.warning)?.warning;
                        setContent((c) => ({
                          ...c,
                          galleryImages: [...c.galleryImages, ...urls].slice(
                            0,
                            galleryLimit
                          ),
                        }));
                        if (warning)
                          setMessage({ type: "error", text: warning });
                      });
                }}
              />
              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                disabled={uploading !== null}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 px-4 text-sm font-medium transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                {uploading === "gallery" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Tambah Foto (maks {galleryLimit})
              </button>
              {content.galleryImages.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {content.galleryImages.map((url) => (
                    <div key={url} className="group relative">
                      <SafeImg
                        src={url}
                        alt="Galeri"
                        fallbackLabel="Gagal dimuat"
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setContent((c) => ({
                            ...c,
                            galleryImages: c.galleryImages.filter((u) => u !== url),
                          }))
                        }
                        aria-label="Hapus foto galeri"
                        className="absolute top-1 right-1 hidden h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white group-hover:inline-flex"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Field>
            <p className="pt-2 text-sm font-medium">Amplop Digital / Rekening</p>
            {content.accounts.map((a, i) => (
              <div
                key={i}
                className="space-y-3 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">Rekening {i + 1}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setContent((c) => ({
                        ...c,
                        accounts: c.accounts.filter((_, j) => j !== i),
                      }))
                    }
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                    aria-label={`Hapus rekening ${i + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Bank">
                    <input
                      value={a.bank}
                      onChange={(e) => updateAccount(i, { bank: e.target.value })}
                      placeholder="BCA"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="No. Rekening">
                    <input
                      value={a.number}
                      onChange={(e) => updateAccount(i, { number: e.target.value })}
                      placeholder="1234567890"
                      inputMode="numeric"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Atas Nama">
                    <input
                      value={a.holder}
                      onChange={(e) => updateAccount(i, { holder: e.target.value })}
                      placeholder="Andi Pratama"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setContent((c) => ({
                  ...c,
                  accounts: [...c.accounts, { bank: "", number: "", holder: "" }],
                }))
              }
              className="inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 px-4 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              <Plus className="h-4 w-4" />
              Tambah Rekening
            </button>
          </Accordion>
        </section>

        {/* Live preview kanan: frame smartphone */}
        <section className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-tight">Live Preview</h2>
            <div className="flex items-center gap-2">
              <input
                value={previewGuest}
                onChange={(e) => setPreviewGuest(e.target.value)}
                placeholder="Pratinjau sbg tamu..."
                className="h-8 w-44 rounded-full border border-zinc-200 bg-white px-3 text-xs outline-none placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-400"
              />
              <button
                type="button"
                onClick={() => setPreviewKey((k) => k + 1)}
                title="Putar ulang cover"
                aria-label="Putar ulang cover"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 transition-colors hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewOpened((v) => !v)}
                title={previewOpened ? "Lihat cover tertutup" : "Lewati cover (lihat isi)"}
                aria-label={previewOpened ? "Lihat cover tertutup" : "Lewati cover (lihat isi)"}
                aria-pressed={previewOpened}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 transition-colors hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                {previewOpened ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
          {/* Dropdown pemilih template preview — ringkas, tidak terpotong.
              Mengubah `templateType` secara instan; `content` tidak di-reset
              sehingga seluruh data form langsung re-render reaktif. */}
          <div className="mb-3">
            <TemplatePreviewDropdown
              value={previewTemplateType}
              isPro={isPro}
              onSelect={handleTemplateSelect}
            />
            {isPreviewProTemplate ? (
              <button
                type="button"
                onClick={() => setProInfoTemplate(previewTemplateType)}
                className="mt-2 flex w-full items-center justify-between gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Crown className="h-3.5 w-3.5 shrink-0" />
                  Preview {templateLabel(previewTemplateType)} (PRO) — data
                  form tetap tampil. Klik untuk info upgrade.
                </span>
                <span className="shrink-0 rounded-full bg-amber-400 px-2 py-0.5 font-semibold text-amber-950">
                  PRO
                </span>
              </button>
            ) : (
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                Preview: {templateLabel(previewTemplateType)} — semua data form
                ter-render otomatis di sini.
              </p>
            )}
          </div>
          <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-[2.5rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl dark:border-zinc-700">
            <div className="mx-auto mt-2 h-5 w-28 rounded-full bg-zinc-900 dark:bg-zinc-700" />
            <div className="h-[720px] overflow-y-auto rounded-b-[1.8rem] bg-white dark:bg-black">
              <InvitationTemplate
                key={`${previewKey}-${previewOpened}`}
                title={title || "Undangan Digital"}
                templateType={previewTemplateType}
                content={content}
                guestName={previewGuest}
                defaultOpened={previewOpened}
                rsvpSlot={
                  <div className="rounded-2xl border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-500 dark:border-zinc-700">
                    Form Ucapan & RSVP akan tampil di sini pada halaman live.
                  </div>
                }
              />
            </div>
          </div>
          {proInfoTemplate && !isPro && resolveTemplate(proInfoTemplate) !== FREE_TEMPLATE_ID && (
            <ProTemplateInfoModal
              templateId={proInfoTemplate}
              savedSlug={savedSlug}
              onClose={() => setProInfoTemplate(null)}
            />
          )}
        </section>
      </main>

      {/* Floating toast pojok kanan bawah (sukses auto-hilang 3 dtk) */}
      {message && (
        <div
          role={message.type === "error" ? "alert" : "status"}
          className={`fixed right-4 bottom-4 z-50 flex max-w-sm items-start gap-2 rounded-2xl border p-4 text-sm shadow-2xl backdrop-blur ${
            message.type === "success"
              ? "border-green-200 bg-green-50/95 text-green-800 dark:border-green-900 dark:bg-green-950/95 dark:text-green-300"
              : "border-red-200 bg-red-50/95 text-red-800 dark:border-red-900 dark:bg-red-950/95 dark:text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <p className="flex-1">{message.text}</p>
          <button
            type="button"
            onClick={() => setMessage(null)}
            aria-label="Tutup notifikasi"
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

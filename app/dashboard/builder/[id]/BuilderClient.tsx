"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  ImagePlus,
  Loader2,
  Minus,
  Music,
  Plus,
  RotateCcw,
  Save,
  Trash2,
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
  TEMPLATE_OPTIONS,
  toInvitationContent,
  type GiftAccount,
  type InvitationContent,
} from "@/lib/invitation";
import { InvitationTemplate } from "@/components/templates/InvitationTemplate";
import { UpgradeProButton } from "@/components/billing/UpgradeProModal";

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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <legend className="px-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
        {title}
      </legend>
      <div className="space-y-4">{children}</div>
    </fieldset>
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

export function BuilderClient({
  mode,
  initial,
  plan,
}: {
  mode: "new" | "edit";
  initial: LandingPage | null;
  plan: Plan;
}) {
  const seed = useMemo(
    () => toInvitationContent(initial?.content_json),
    [initial]
  );
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [templateType, setTemplateType] = useState<string>(
    resolveTemplate(initial?.template_type ?? "elegant")
  );
  const [content, setContent] = useState<InvitationContent>(seed);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(
    initial?.slug ?? null
  );
  const [previewGuest, setPreviewGuest] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

  async function uploadFile(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = (await res.json()) as { ok?: boolean; url?: string; error?: string };
    if (!res.ok || !data.url) throw new Error(data.error ?? "Gagal mengunggah file");
    return data.url;
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
  // Paket Free terkunci ke template dasar di semua titik (form, simpan, preview).
  const effectiveTemplateType = isPro ? templateType : FREE_TEMPLATE_ID;

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
        page?: { slug: string };
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan perubahan");
      const finalSlug = data.page?.slug ?? slug.trim();
      setSavedSlug(finalSlug);
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
        {message && (
          <div
            className={`flex items-center gap-2 border-t px-6 py-2.5 text-sm ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
                : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            {message.text}
          </div>
        )}
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-6 py-8 lg:grid-cols-2">
        {/* Form editor kiri */}
        <section className="h-fit space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-semibold tracking-tight">Editor Undangan</h2>

          <Section title="Informasi Dasar">
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
            <Field label="Tipe Template">
              <select
                value={effectiveTemplateType}
                onChange={(e) => setTemplateType(e.target.value)}
                className={inputClass}
              >
                {TEMPLATE_OPTIONS.map((t) => (
                  <option
                    key={t.value}
                    value={t.value}
                    disabled={!isPro && t.value !== FREE_TEMPLATE_ID}
                  >
                    {t.label}
                    {!isPro && t.value !== FREE_TEMPLATE_ID ? " 🔒 PRO" : ""}
                  </option>
                ))}
              </select>
              {!isPro && (
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                  Paket Free hanya template Modern Minimalist. Upgrade ke PRO
                  untuk membuka semua template.
                </p>
              )}
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
          </Section>

          <Section title="Mempelai Pria">
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
            <Field label="Nama Orang Tua">
              <input
                value={content.groomParents}
                onChange={(e) => patch({ groomParents: e.target.value })}
                placeholder="Bpk. Harto & Ibu Wulan"
                className={inputClass}
              />
            </Field>
          </Section>

          <Section title="Mempelai Wanita">
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
            <Field label="Nama Orang Tua">
              <input
                value={content.brideParents}
                onChange={(e) => patch({ brideParents: e.target.value })}
                placeholder="Bpk. Joko & Ibu Ratna"
                className={inputClass}
              />
            </Field>
          </Section>

          <Section title="Akad Nikah">
            <EventFields prefix="akad" title="Detail Akad" content={content} onChange={patch} />
          </Section>

          <Section title="Resepsi">
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
          </Section>

          <Section title="Media">
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
                      void runUpload("cover", async () =>
                        patch({ heroImage: await uploadFile(f) })
                      );
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
                      void runUpload("audio", async () =>
                        patch({ backsoundUrl: await uploadFile(f) })
                      );
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
                      const urls = await Promise.all(
                        files.slice(0, room).map(uploadFile)
                      );
                      setContent((c) => ({
                        ...c,
                        galleryImages: [...c.galleryImages, ...urls].slice(
                          0,
                          galleryLimit
                        ),
                      }));
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt="Galeri"
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
          </Section>

          <Section title="Amplop Digital">
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
          </Section>
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
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 transition-colors hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-[2.5rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl dark:border-zinc-700">
            <div className="mx-auto mt-2 h-5 w-28 rounded-full bg-zinc-900 dark:bg-zinc-700" />
            <div className="h-[720px] overflow-y-auto rounded-b-[1.8rem] bg-white dark:bg-black">
              <InvitationTemplate
                key={previewKey}
                title={title || "Undangan Digital"}
                templateType={effectiveTemplateType}
                content={content}
                guestName={previewGuest}
                rsvpSlot={
                  <div className="rounded-2xl border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-500 dark:border-zinc-700">
                    Form Ucapan & RSVP akan tampil di sini pada halaman live.
                  </div>
                }
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

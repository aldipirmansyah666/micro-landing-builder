"use client";

import { memo, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Crown,
  ExternalLink,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Lock,
  MessageCircle,
  Minus,
  Music,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Video,
  X,
} from "lucide-react";
import type { LandingPage } from "@/lib/db";
import {
  applyRenderEntitlements,
  FREE_TEMPLATE_ID,
  maxGallery,
  type Plan,
} from "@/lib/entitlements";
import {
  COUPLE_ORDER_OPTIONS,
  MAX_CLOSING_NOTE_LEN,
  MAX_GALLERY_VIDEOS,
  MAX_GREETING_LEN,
  MAX_STORIES,
  MAX_STORY_TEXT_LEN,
  MAX_STORY_TITLE_LEN,
  TIMEZONE_OPTIONS,
  dayNameFromDate,
  resolveTemplate,
  safeHttpUrl,
  slugify,
  toInvitationContent,
  type GiftAccount,
  type InvitationContent,
  type StoryEntry,
} from "@/lib/invitation";
import { InvitationTemplate } from "@/components/templates/InvitationTemplate";
import { CompactTemplateSelector } from "@/components/templates/TemplateCatalog";
import { SafeImg } from "@/components/templates/shared";
import { UpgradeProButton } from "@/components/billing/UpgradeProModal";
import {
  BACKSOUND_PRESETS,
  isPresetBacksoundUrl,
  type BacksoundPreset,
} from "@/lib/backsounds";
import { TEMPLATE_REGISTRY, templateLabel } from "@/lib/templates";
import { copyText, waShareText } from "../../QuickActions";
import {
  Accordion,
  Button,
  Dialog,
  Field,
  Input,
  Select,
  Textarea,
  fieldLabelClass,
} from "@/design-system/primitives";

/**
 * Placeholder RSVP untuk preview builder.
 *
 * Di-hoist ke level modul (bukan JSX inline di dalam render) supaya
 * identitas elemennya stabil. `React.memo` membandingkan props secara
 * shallow — props `rsvpSlot` yang dibuat inline selalu berbeda pada
 * setiap render, sehingga memo tidak pernah bisa melewati render.
 */
const PREVIEW_RSVP_PLACEHOLDER = (
  <div className="rounded-2xl border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-500 dark:border-zinc-700">
    Form Ucapan & RSVP akan tampil di sini pada halaman live.
  </div>
);

interface BuilderPreviewProps {
  title: string;
  templateType: string;
  content: InvitationContent;
  guestName: string;
  defaultOpened: boolean;
  replayKey: number;
}

/**
 * Panel preview live (bingkai ponsel).
 *
 * Dipisah dari `BuilderClient` dan dibungkus `memo` supaya render
 * form — mengetik di input, status upload, pesan toast — tidak ikut
 * menarik seluruh pohon template.
 *
 * `key` hanya berisi `replayKey` (tombol "Putar ulang cover").
 * Sebelumnya `previewOpened` ikut masuk ke `key`, sehingga membuka /
 * menutup cover akan me-remount SELURUH pohon template: seluruh DOM
 * dibuat ulang, `<img>` di-decode ulang, dan setiap IntersectionObserver
 * milik `Reveal` dibuat ulang. Sekarang `defaultOpened` disinkronkan
 * di dalam template lewat `useCoverOpened`, jadi cukup state update
 * biasa — tanpa remount.
 */
const BuilderPreview = memo(function BuilderPreview({
  title,
  templateType,
  content,
  guestName,
  defaultOpened,
  replayKey,
}: BuilderPreviewProps) {
  return (
    <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-[2.5rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl dark:border-zinc-700">
      <div className="mx-auto mt-2 h-5 w-28 rounded-full bg-zinc-900 dark:bg-zinc-700" />
      <div className="h-[720px] overflow-y-auto rounded-b-[1.8rem] bg-white dark:bg-black">
        <InvitationTemplate
          key={replayKey}
          title={title}
          templateType={templateType}
          content={content}
          guestName={guestName}
          defaultOpened={defaultOpened}
          rsvpSlot={PREVIEW_RSVP_PLACEHOLDER}
        />
      </div>
    </div>
  );
});

/**
 * Audio picker backsound khusus PRO: mode "Preset Lagu" (daftar preset
 * dengan preview play/pause) atau "Upload Custom MP3" (file MP3 sendiri).
 * Preview memakai satu elemen Audio bersama agar tidak ada dua lagu
 * yang berbunyi bersamaan; dihentikan saat komponen dilepas.
 */
function BacksoundPicker({
  value,
  uploadingAudio,
  uploadDisabled,
  fileInputRef,
  onPick,
  onClear,
  onUploadFile,
}: {
  value: string;
  uploadingAudio: boolean;
  uploadDisabled: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onPick: (url: string) => void;
  onClear: () => void;
  onUploadFile: (file: File) => void;
}) {
  const [mode, setMode] = useState<"preset" | "custom">(() =>
    value.trim() === "" || isPresetBacksoundUrl(value) ? "preset" : "custom"
  );
  const [previewId, setPreviewId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(
    () => () => {
      previewAudioRef.current?.pause();
      previewAudioRef.current = null;
    },
    []
  );

  const selectedId =
    BACKSOUND_PRESETS.find((p) => p.url === value.trim())?.id ?? null;
  const trimmed = value.trim();

  function togglePreview(preset: BacksoundPreset) {
    const current = previewAudioRef.current;
    if (previewId === preset.id && current) {
      current.pause();
      setPreviewId(null);
      return;
    }
    current?.pause();
    const next = new Audio(preset.url);
    next.preload = "none";
    next.onended = () => setPreviewId(null);
    previewAudioRef.current = next;
    setPreviewId(preset.id);
    void next.play().catch(() => setPreviewId(null));
  }

  return (
    <div>
      <span className={fieldLabelClass}>Backsound Musik 🔒 PRO</span>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode("preset")}
          aria-pressed={mode === "preset"}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors ${
            mode === "preset"
              ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
              : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          }`}
        >
          <Music className="h-4 w-4" />
          Preset Lagu
        </button>
        <button
          type="button"
          onClick={() => setMode("custom")}
          aria-pressed={mode === "custom"}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors ${
            mode === "custom"
              ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
              : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          }`}
        >
          <ImagePlus className="h-4 w-4" />
          Custom MP3
        </button>
      </div>

      {mode === "preset" ? (
        <ul className="space-y-2">
          {BACKSOUND_PRESETS.map((preset) => {
            const isSelected = selectedId === preset.id;
            const isPreviewing = previewId === preset.id;
            return (
              <li
                key={preset.id}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                  isSelected
                    ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                <button
                  type="button"
                  onClick={() => togglePreview(preset)}
                  aria-label={
                    isPreviewing
                      ? `Hentikan preview ${preset.title}`
                      : `Dengarkan preview ${preset.title}`
                  }
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white transition-transform hover:scale-105 dark:bg-zinc-100 dark:text-zinc-900"
                >
                  {isPreviewing ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 translate-x-[1px]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onPick(preset.url)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm font-medium">
                    {preset.title}
                    {isSelected && (
                      <Check className="ml-1.5 inline h-3.5 w-3.5 text-emerald-600" />
                    )}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="inline-flex shrink-0 items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase dark:bg-zinc-800">
                      {preset.category}
                    </span>
                    <span className="truncate">{preset.artist}</span>
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={value}
              onChange={(e) => onPick(e.target.value)}
              placeholder="https://.../lagu.mp3"
              inputMode="url"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/mpeg,audio/mp3"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (fileInputRef.current) fileInputRef.current.value = "";
                if (f) onUploadFile(f);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadDisabled}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              aria-label="Upload file MP3 custom"
              title="Upload file MP3 (maks 10MB)"
            >
              {uploadingAudio ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Music className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Tempel URL MP3 langsung atau upload file MP3 (maks 10MB).
          </p>
        </div>
      )}

      {trimmed !== "" && (
        <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-zinc-50 px-3 py-2 text-xs dark:bg-zinc-900">
          <p className="min-w-0 flex-1 truncate text-zinc-600 dark:text-zinc-400">
            Aktif:{" "}
            {BACKSOUND_PRESETS.find((p) => p.url === trimmed)?.title ??
              trimmed}
          </p>
          <button
            type="button"
            onClick={() => {
              previewAudioRef.current?.pause();
              setPreviewId(null);
              onClear();
            }}
            className="inline-flex shrink-0 items-center gap-1 font-medium text-red-600 dark:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}

function ProfileFields({
  side,
  title,
  content,
  onChange,
  onUploadPhoto,
  onRemovePhoto,
  uploading,
}: {
  side: "groom" | "bride";
  title: string;
  content: InvitationContent;
  onChange: (patch: Partial<InvitationContent>) => void;
  onUploadPhoto: (file: File) => void;
  onRemovePhoto: () => void;
  uploading: boolean;
}) {
  const isGroom = side === "groom";
  const fullName = isGroom ? content.groomFullName : content.brideFullName;
  const nickname = isGroom ? content.groomNickname : content.brideNickname;
  const parents = isGroom ? content.groomParents : content.brideParents;
  const childOrder = isGroom
    ? content.groomChildOrder
    : content.brideChildOrder;
  const instagram = isGroom ? content.groomInstagram : content.brideInstagram;
  const photo = isGroom ? content.groomPhoto : content.bridePhoto;
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="text-sm font-semibold">{title}</p>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (fileRef.current) fileRef.current.value = "";
          if (file) onUploadPhoto(file);
        }}
      />
      <div className="flex items-center gap-3">
        <SafeImg
          key={photo}
          src={safeHttpUrl(photo)}
          alt={fullName || title}
          fallbackLabel="Foto"
          className="h-16 w-16 shrink-0 rounded-full object-cover"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-200 px-3.5 text-xs font-medium transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImagePlus className="h-3.5 w-3.5" />
            )}
            {photo ? "Ganti Foto" : "Upload Foto"}
          </button>
          {photo && (
            <button
              type="button"
              onClick={onRemovePhoto}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-red-200 px-3.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Hapus
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama Lengkap">
          <Input
            value={fullName}
            onChange={(e) =>
              onChange(
                isGroom
                  ? { groomFullName: e.target.value }
                  : { brideFullName: e.target.value }
              )
            }
            placeholder={isGroom ? "Andi Pratama" : "Sinta Dewi"}
          />
        </Field>
        <Field label="Nama Panggilan">
          <Input
            value={nickname}
            onChange={(e) =>
              onChange(
                isGroom
                  ? { groomNickname: e.target.value }
                  : { brideNickname: e.target.value }
              )
            }
            placeholder={isGroom ? "Andi" : "Sinta"}
          />
        </Field>
      </div>
      <Field label="Nama Orang Tua">
        <Input
          value={parents}
          onChange={(e) =>
            onChange(
              isGroom
                ? { groomParents: e.target.value }
                : { brideParents: e.target.value }
            )
          }
          placeholder={
            isGroom ? "Bpk. Harto & Ibu Wulan" : "Bpk. Joko & Ibu Ratna"
          }
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Anak ke-">
          <Input
            value={childOrder}
            onChange={(e) =>
              onChange(
                isGroom
                  ? { groomChildOrder: e.target.value }
                  : { brideChildOrder: e.target.value }
              )
            }
            placeholder="cth: 2"
            inputMode="numeric"
          />
        </Field>
        <Field label="Instagram">
          <Input
            value={instagram}
            onChange={(e) =>
              onChange(
                isGroom
                  ? { groomInstagram: e.target.value }
                  : { brideInstagram: e.target.value }
              )
            }
            placeholder="@username"
          />
        </Field>
      </div>
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
  const isAkad = prefix === "akad";
  const date = isAkad ? content.akadDate : content.receptionDate;
  const time = isAkad ? content.akadTime : content.receptionTime;
  const timezone = isAkad
    ? content.akadTimezone
    : content.receptionTimezone;
  const venue = isAkad ? content.akadVenue : content.receptionVenue;
  const maps = isAkad ? content.akadMapsUrl : content.receptionMapsUrl;
  const dresscode = isAkad
    ? content.akadDresscode
    : content.receptionDresscode;
  const day = dayNameFromDate(date);

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="text-sm font-semibold">{title}</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Hari">
          <Input value={day} readOnly placeholder="Otomatis dari tanggal" />
        </Field>
        <Field label="Tanggal">
          <Input
            type="date"
            value={date}
            onChange={(e) =>
              onChange(
                isAkad
                  ? { akadDate: e.target.value }
                  : { receptionDate: e.target.value }
              )
            }
          />
        </Field>
        <Field label="Jam">
          <Input
            type="time"
            value={time}
            onChange={(e) =>
              onChange(
                isAkad
                  ? { akadTime: e.target.value }
                  : { receptionTime: e.target.value }
              )
            }
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Zona Waktu">
          <Select
            value={timezone}
            onChange={(e) =>
              onChange(
                isAkad
                  ? {
                      akadTimezone: e.target
                        .value as InvitationContent["akadTimezone"],
                    }
                  : {
                      receptionTimezone: e.target
                        .value as InvitationContent["receptionTimezone"],
                    }
              )
            }
          >
            {TIMEZONE_OPTIONS.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Dresscode">
          <Input
            value={dresscode}
            onChange={(e) =>
              onChange(
                isAkad
                  ? { akadDresscode: e.target.value }
                  : { receptionDresscode: e.target.value }
              )
            }
            placeholder="cth: Formal earthy tone"
          />
        </Field>
      </div>
      <Field label="Alamat / Gedung">
        <Textarea
          value={venue}
          onChange={(e) =>
            onChange(
              isAkad
                ? { akadVenue: e.target.value }
                : { receptionVenue: e.target.value }
            )
          }
          rows={2}
          placeholder="cth: Gedung Serbaguna, Jakarta"
          className="resize-none"
        />
      </Field>
      <Field label="Link Google Maps">
        <Input
          value={maps}
          onChange={(e) =>
            onChange(
              isAkad
                ? { akadMapsUrl: e.target.value }
                : { receptionMapsUrl: e.target.value }
            )
          }
          placeholder="https://maps.google.com/..."
          inputMode="url"
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
          className="w-full appearance-none truncate rounded-lg border border-stone-700 bg-stone-900 px-3 py-1.5 pr-8 text-xs font-semibold text-stone-100 outline-none [color-scheme:dark] focus:ring-2 focus:ring-amber-500 focus:outline-none"
        >
          {TEMPLATE_REGISTRY.map((t) => {
            const needsPro = !isPro && t.id !== FREE_TEMPLATE_ID;
            return (
              <option
                key={t.id}
                value={t.id}
                className="bg-stone-900 py-1 text-stone-100 dark:bg-stone-900 dark:text-stone-100"
              >
                {t.name}
                {needsPro ? " • PRO" : ""}
              </option>
            );
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
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
    <Dialog
      open
      onClose={onClose}
      size="sm"
      title={
        <>
          <Crown className="h-5 w-5 text-amber-500" />
          {templateLabel(templateId)}
        </>
      }
      titleClassName="inline-flex items-center gap-2 text-base"
    >
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
    </Dialog>
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
  /**
   * Status paket effective. Dihitung di awal komponen karena dipakai
   * oleh seed di bawah (filter entitlement) maupun logika form.
   */
  const isPro = plan === "pro";

  /**
   * Seed state konten dari data tersimpan.
   *
   * PENTING: applyRenderEntitlements() diterapkan DI SINI, bukan hanya
   * saat render publik. Alasannya: konten PRO yang tertinggal di DB
   * (mis. sisa "Cerita & Sapaan" dari akun yang sebelumnya Pro, atau
   * `greeting: ""` hasil user mengosongkan field) akan membuat server
   * menolak penyimpanan dengan 403 — padahal UI untuk menghapus field
   * PRO itu disembunyikan pada paket Free, sehingga user tidak pernah
   * punya jalan keluar (halaman terkunci permanen).
   *
   * applyRenderEntitlements() menyetel field PRO menjadi `undefined`
   * (key hilang saat JSON.stringify) dan mengosongkan backsound, sehingga
   * payload yang dikirim server bebas field PRO dan lolos checkSaveEntitlements().
   */
  const seed = useMemo(
    () =>
      applyRenderEntitlements(
        toInvitationContent(initial?.content_json),
        isPro
      ),
    [initial, isPro]
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
  const [shareGuest, setShareGuest] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
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
  const galleryVideoRef = useRef<HTMLInputElement>(null);
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

  const stories = content.stories ?? [];

  function updateStory(idx: number, p: Partial<StoryEntry>) {
    setContent((c) => ({
      ...c,
      stories: (c.stories ?? []).map((s, i) => (i === idx ? { ...s, ...p } : s)),
    }));
  }

  function moveStory(idx: number, dir: -1 | 1) {
    setContent((c) => {
      const list = [...(c.stories ?? [])];
      const j = idx + dir;
      if (j < 0 || j >= list.length) return c;
      const [s] = list.splice(idx, 1);
      list.splice(j, 0, s!);
      return { ...c, stories: list };
    });
  }

  function removeStory(idx: number) {
    setContent((c) => ({
      ...c,
      stories: (c.stories ?? []).filter((_, i) => i !== idx),
    }));
  }

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

  /**
   * Payload preview ditunda (deferred) supaya mengetik di form tidak
   * memaksa render penuh pohon template pada setiap ketikan.
   *
   * `useDeferredValue` membuat React memakai nilai LAMA untuk render
   * mendesak — input tetap responsif dan caret tidak berkedip — lalu
   * menjadwalkan render lanjutan dengan nilai baru pada prioritas lebih
   * rendah. Efeknya: beberapa ketikan beruntun digabung menjadi satu
   * render template, bukan satu render per ketikan.
   *
   * Perhatikan bahwa `previewContent` (normalisasi) ikut di-defer:
   * normalisasi hanya dijalankan ulang ketika nilai tertunda benar-benar
   * berubah, bukan pada setiap ketikan.
   */
  const deferredTitle = useDeferredValue(title);
  const deferredContent = useDeferredValue(content);
  const deferredGuestName = useDeferredValue(previewGuest);

  /**
   * Preview memakai konten yang dinormalisasi ulang lewat
   * toInvitationContent() — choke point yang sama dengan halaman publik
   * /p/[slug]. Dengan begitu URL non-http(s) yang diketik manual di form
   * (mis. "javascript:...") tidak pernah sampai ke href/src di preview,
   * persis seperti perilaku produksi.
   */
  const deferredPreviewContent = useMemo(
    () => toInvitationContent(deferredContent),
    [deferredContent]
  );

  function handleTemplateSelect(id: string) {
    const normalized = resolveTemplate(id);
    // Instan: hanya set template, jangan reset `content`/form lainnya.
    setTemplateType(normalized);
    if (!isPro && normalized !== FREE_TEMPLATE_ID) {
      setProInfoTemplate(normalized);
    }
  }

  // Link sebar personal: pakai slug tersimpan bila ada, fallback slug draft.
  const shareSlug = savedSlug ?? slug.trim();
  const shareLink =
    typeof window !== "undefined" && shareSlug
      ? `${window.location.origin}/p/${shareSlug}?to=${encodeURIComponent(shareGuest.trim())}`
      : "";

  async function handleCopyShareLink() {
    if (!shareLink) return;
    const ok = await copyText(shareLink);
    if (!ok) return;
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }

  function handleShareWhatsApp() {
    if (!shareSlug) return;
    const text = waShareText(
      shareSlug,
      title.trim() || "Undangan Digital",
      shareGuest.trim() || undefined
    );
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener"
    );
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
            <Link href="/" aria-label="NikahYuk — beranda">
              <Image
                src="/logo-nikahyuk.svg"
                alt="NikahYuk"
                width={180}
                height={30}
                className="h-7 w-auto dark:hidden"
              />
              <Image
                src="/logo-nikahyuk-light.svg"
                alt="NikahYuk"
                width={180}
                height={30}
                className="hidden h-7 w-auto dark:block"
              />
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
            <Button
              size="md"
              className="px-5"
              onClick={() => void handleSave()}
              disabled={saving || uploading !== null}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Simpan Perubahan
            </Button>
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
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="cth: Pernikahan Andi & Sinta"
              />
            </Field>
            <Field label="Slug (link halaman)">
              <div className="flex items-center">
                <span className="rounded-l-xl border border-r-0 border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                  /p/
                </span>
                <Input
                  value={slug}
                  disabled={mode === "edit"}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="andi-sinta"
                  className="rounded-l-none"
                />
              </div>
            </Field>
            <Field label="Kata Pengantar / Quote">
              <Textarea
                value={content.quote}
                onChange={(e) => patch({ quote: e.target.value })}
                rows={3}
                placeholder="Kutipan atau salam pembuka undangan..."
                className="resize-none"
              />
            </Field>
          </Accordion>

          {isPro ? (
          <Accordion title="💞 Love Story & Sapaan">
            <Field label={`Sapaan Pembuka (${(content.greeting ?? "").length}/${MAX_GREETING_LEN})`}>
              <Textarea
                value={content.greeting ?? ""}
                onChange={(e) => patch({ greeting: e.target.value.slice(0, MAX_GREETING_LEN) })}
                rows={2}
                maxLength={MAX_GREETING_LEN}
                placeholder="cth: Assalamu'alaikum Wr. Wb. — Dengan penuh syukur kami mengundang…"
                className="resize-none"
              />
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Menggantikan salam bawaan template. Kosongkan untuk
                menyembunyikan; undangan lama tanpa isian tetap memakai salam
                bawaan.
              </p>
            </Field>
            <Field label={`Pesan Penutup (${(content.closingNote ?? "").length}/${MAX_CLOSING_NOTE_LEN})`}>
              <Textarea
                value={content.closingNote ?? ""}
                onChange={(e) => patch({ closingNote: e.target.value.slice(0, MAX_CLOSING_NOTE_LEN) })}
                rows={2}
                maxLength={MAX_CLOSING_NOTE_LEN}
                placeholder="cth: Terima kasih atas doa & kehadiran Anda…"
                className="resize-none"
              />
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Menggantikan ucapan terima kasih bawaan template. Kosongkan
                untuk menyembunyikan.
              </p>
            </Field>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Love Story ({stories.length}/{MAX_STORIES})
              </p>
              <button
                type="button"
                disabled={stories.length >= MAX_STORIES}
                onClick={() =>
                  setContent((c) => ({
                    ...c,
                    stories: [...(c.stories ?? []), { title: "", text: "" }],
                  }))
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-200 px-4 text-xs font-medium transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah Love Story
              </button>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Tampil sebagai timeline pada template PRO. Love Story kosong tidak
              ditampilkan.
            </p>
            {stories.map((s, i) => (
              <div
                key={i}
                className="space-y-3 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">Love Story {i + 1}</p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={() => moveStory(i, -1)}
                      aria-label={`Pindah love story ${i + 1} ke atas`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-zinc-200 disabled:opacity-40 dark:hover:bg-zinc-800"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={i === stories.length - 1}
                      onClick={() => moveStory(i, 1)}
                      aria-label={`Pindah cerita ${i + 1} ke bawah`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-zinc-200 disabled:opacity-40 dark:hover:bg-zinc-800"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStory(i)}
                      aria-label={`Hapus love story ${i + 1}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <Field label={`Judul (${s.title.length}/${MAX_STORY_TITLE_LEN})`}>
                  <Input
                    value={s.title}
                    onChange={(e) => updateStory(i, { title: e.target.value.slice(0, MAX_STORY_TITLE_LEN) })}
                    maxLength={MAX_STORY_TITLE_LEN}
                    placeholder="cth: Awal Bertemu — 2019"
                  />
                </Field>
                <Field label={`Isi Love Story (${s.text.length}/${MAX_STORY_TEXT_LEN})`}>
                  <Textarea
                    value={s.text}
                    onChange={(e) => updateStory(i, { text: e.target.value.slice(0, MAX_STORY_TEXT_LEN) })}
                    rows={3}
                    maxLength={MAX_STORY_TEXT_LEN}
                    placeholder="Tulis momen berkesan secara singkat…"
                    className="resize-none"
                  />
                </Field>
              </div>
            ))}
          </Accordion>
          ) : (
          <div className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/30">
            <div className="flex items-center justify-between gap-2 px-4 py-3.5">
              <p className="text-sm font-semibold tracking-tight">
                💞 Love Story & Sapaan
              </p>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-amber-950">
                <Lock className="h-3 w-3" />
                PRO
              </span>
            </div>
            <div className="space-y-3 px-4 pb-4">
              <p className="text-xs leading-6 text-amber-900 dark:text-amber-200">
                Fitur khusus pengguna PRO — Upgrade seharga Rp 49.000 untuk
                mengaktifkan Sapaan Kustom & Timeline Love Story.
              </p>
              {savedSlug ? (
                <UpgradeProButton slug={savedSlug} />
              ) : (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Simpan undangan terlebih dahulu untuk membuka upgrade.
                </p>
              )}
            </div>
          </div>
          )}

          <Accordion title="💍 Profil Mempelai Pria & Wanita" defaultOpen>
            <div>
              <span className={fieldLabelClass}>Urutan Mempelai</span>
              <div className="grid grid-cols-2 gap-2">
                {COUPLE_ORDER_OPTIONS.map((option) => {
                  const active = content.coupleOrder === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => patch({ coupleOrder: option.value })}
                      className={`inline-flex h-10 items-center justify-center rounded-xl border text-sm font-medium transition-colors ${
                        active
                          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                          : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {content.coupleOrder === "groomFirst" ? (
              <>
                <ProfileFields
                  side="groom"
                  title="Mempelai Laki-Laki"
                  content={content}
                  onChange={patch}
                  uploading={uploading === "groomPhoto"}
                  onUploadPhoto={(file) =>
                    void runUpload("groomPhoto", async () => {
                      const r = await uploadFile(file);
                      patch({ groomPhoto: r.url });
                      if (r.warning)
                        setMessage({ type: "error", text: r.warning });
                    })
                  }
                  onRemovePhoto={() => patch({ groomPhoto: "" })}
                />
                <ProfileFields
                  side="bride"
                  title="Mempelai Wanita"
                  content={content}
                  onChange={patch}
                  uploading={uploading === "bridePhoto"}
                  onUploadPhoto={(file) =>
                    void runUpload("bridePhoto", async () => {
                      const r = await uploadFile(file);
                      patch({ bridePhoto: r.url });
                      if (r.warning)
                        setMessage({ type: "error", text: r.warning });
                    })
                  }
                  onRemovePhoto={() => patch({ bridePhoto: "" })}
                />
              </>
            ) : (
              <>
                <ProfileFields
                  side="bride"
                  title="Mempelai Wanita"
                  content={content}
                  onChange={patch}
                  uploading={uploading === "bridePhoto"}
                  onUploadPhoto={(file) =>
                    void runUpload("bridePhoto", async () => {
                      const r = await uploadFile(file);
                      patch({ bridePhoto: r.url });
                      if (r.warning)
                        setMessage({ type: "error", text: r.warning });
                    })
                  }
                  onRemovePhoto={() => patch({ bridePhoto: "" })}
                />
                <ProfileFields
                  side="groom"
                  title="Mempelai Laki-Laki"
                  content={content}
                  onChange={patch}
                  uploading={uploading === "groomPhoto"}
                  onUploadPhoto={(file) =>
                    void runUpload("groomPhoto", async () => {
                      const r = await uploadFile(file);
                      patch({ groomPhoto: r.url });
                      if (r.warning)
                        setMessage({ type: "error", text: r.warning });
                    })
                  }
                  onRemovePhoto={() => patch({ groomPhoto: "" })}
                />
              </>
            )}
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
                  receptionTimezone: content.akadTimezone,
                  receptionVenue: content.akadVenue,
                  receptionMapsUrl: content.akadMapsUrl,
                  receptionDresscode: content.akadDresscode,
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
            {isPro ? (
              <BacksoundPicker
                value={content.backsoundUrl}
                uploadingAudio={uploading === "audio"}
                uploadDisabled={uploading !== null}
                fileInputRef={audioRef}
                onPick={(url) => patch({ backsoundUrl: url })}
                onClear={() => patch({ backsoundUrl: "" })}
                onUploadFile={(f) =>
                  void runUpload("audio", async () => {
                    const r = await uploadFile(f);
                    patch({ backsoundUrl: r.url });
                    if (r.warning)
                      setMessage({ type: "error", text: r.warning });
                  })
                }
              />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/30">
                <div className="flex items-center justify-between gap-2 px-4 py-3.5">
                  <p className="text-sm font-semibold tracking-tight">
                    🎵 Musik & Backsound
                  </p>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-amber-950">
                    <Lock className="h-3 w-3" />
                    PRO
                  </span>
                </div>
                <div className="space-y-3 px-4 pb-4">
                  <p className="text-xs leading-6 text-amber-900 dark:text-amber-200">
                    Fitur khusus pengguna PRO — Upgrade seharga Rp 49.000
                    untuk mengaktifkan preset lagu & upload MP3 custom
                    sebagai backsound undangan.
                  </p>
                  {savedSlug ? (
                    <UpgradeProButton slug={savedSlug} />
                  ) : (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Simpan undangan terlebih dahulu untuk membuka upgrade.
                    </p>
                  )}
                </div>
              </div>
            )}
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
                        src={safeHttpUrl(url)}
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
            <Field
              label={`Galeri Video (${content.galleryVideos.length}/${MAX_GALLERY_VIDEOS})`}
            >
              <input
                ref={galleryVideoRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = [...(e.target.files ?? [])];
                  if (galleryVideoRef.current) galleryVideoRef.current.value = "";
                  if (files.length > 0)
                    void runUpload("galleryVideo", async () => {
                      const room = Math.max(
                        MAX_GALLERY_VIDEOS - content.galleryVideos.length,
                        0
                      );
                      if (room <= 0) {
                        throw new Error(
                          `Galeri video penuh (maks ${MAX_GALLERY_VIDEOS} video)`
                        );
                      }
                      const results = await Promise.all(
                        files.slice(0, room).map(uploadFile)
                      );
                      const urls = results.map((r) => r.url);
                      const warning = results.find((r) => r.warning)?.warning;
                      setContent((c) => ({
                        ...c,
                        galleryVideos: [...c.galleryVideos, ...urls].slice(
                          0,
                          MAX_GALLERY_VIDEOS
                        ),
                      }));
                      if (warning)
                        setMessage({ type: "error", text: warning });
                    });
                }}
              />
              <button
                type="button"
                onClick={() => galleryVideoRef.current?.click()}
                disabled={uploading !== null}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 px-4 text-sm font-medium transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                {uploading === "galleryVideo" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Video className="h-4 w-4" />
                )}
                Tambah Video (maks {MAX_GALLERY_VIDEOS})
              </button>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Format MP4/WebM/MOV, maks 50MB per video.
              </p>
              {content.galleryVideos.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {content.galleryVideos.map((url) => (
                    <div key={url} className="group relative">
                      <video
                        src={safeHttpUrl(url)}
                        controls
                        playsInline
                        preload="metadata"
                        className="aspect-video w-full rounded-xl bg-black object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setContent((c) => ({
                            ...c,
                            galleryVideos: c.galleryVideos.filter(
                              (u) => u !== url
                            ),
                          }))
                        }
                        aria-label="Hapus video galeri"
                        className="absolute top-1 right-1 hidden h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white group-hover:inline-flex"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Field>
          </Accordion>

          <Accordion title="🎁 Wedding Gift">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Tambahkan banyak rekening bank atau e-wallet. Tamu dapat menyalin
              nomor dengan satu klik.
            </p>
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
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Jenis">
                    <Select
                      value={a.kind ?? "bank"}
                      onChange={(e) =>
                        updateAccount(i, {
                          kind:
                            e.target.value === "ewallet" ? "ewallet" : "bank",
                        })
                      }
                    >
                      <option value="bank">Bank</option>
                      <option value="ewallet">E-Wallet</option>
                    </Select>
                  </Field>
                  <Field label={a.kind === "ewallet" ? "Nama E-Wallet" : "Nama Bank"}>
                    <Input
                      value={a.bank}
                      onChange={(e) => updateAccount(i, { bank: e.target.value })}
                      placeholder={a.kind === "ewallet" ? "GoPay" : "BCA"}
                    />
                  </Field>
                  <Field label="No. Rekening / HP">
                    <Input
                      value={a.number}
                      onChange={(e) => updateAccount(i, { number: e.target.value })}
                      placeholder={a.kind === "ewallet" ? "081234567890" : "1234567890"}
                      inputMode="numeric"
                    />
                  </Field>
                  <Field label="Atas Nama">
                    <Input
                      value={a.holder}
                      onChange={(e) => updateAccount(i, { holder: e.target.value })}
                      placeholder="Andi Pratama"
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
                  accounts: [
                    ...c.accounts,
                    { bank: "", number: "", holder: "", kind: "bank" },
                  ],
                }))
              }
              className="inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 px-4 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              <Plus className="h-4 w-4" />
              Tambah Rekening / E-Wallet
            </button>
            <Field label="Alamat Kirim Kado Fisik">
              <Textarea
                value={content.giftAddress}
                onChange={(e) => patch({ giftAddress: e.target.value })}
                rows={3}
                placeholder="Nama penerima, alamat lengkap, kota, kode pos"
                className="resize-none"
              />
            </Field>
          </Accordion>

          <Accordion title="🔗 Link Live Stream, Filter & Musik">
            <Field label="Link Live Streaming">
              <Input
                value={content.liveStreamUrl}
                onChange={(e) => patch({ liveStreamUrl: e.target.value })}
                placeholder="https://youtube.com/live/..."
                inputMode="url"
              />
            </Field>
            <Field label="Link IG Filter">
              <Input
                value={content.igFilterUrl}
                onChange={(e) => patch({ igFilterUrl: e.target.value })}
                placeholder="https://instagram.com/ar/..."
                inputMode="url"
              />
            </Field>
            <Field label="Request Musik (Link YouTube)">
              <Input
                value={content.musicRequestUrl}
                onChange={(e) => patch({ musicRequestUrl: e.target.value })}
                placeholder="https://youtube.com/playlist?list=..."
                inputMode="url"
              />
            </Field>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Ketiga tautan opsional dan tampil sebagai tombol di undangan.
            </p>
          </Accordion>

          <Accordion title="💌 Fitur Sebar Undangan (Nama Tamu)">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Nama di sini hanya untuk membuat link — tidak tersimpan ke
              undangan. Kelola daftar tamu permanen di menu Tamu & RSVP.
            </p>
            <Field label="Nama Tamu">
              <Input
                value={shareGuest}
                onChange={(e) => setShareGuest(e.target.value)}
                placeholder="cth: Budi"
              />
            </Field>
            {!shareSlug ? (
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Isi slug lalu simpan undangan dulu agar link sebar bisa dibuat.
              </p>
            ) : !shareGuest.trim() ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Ketik nama tamu untuk membuat link personal
                <span className="font-mono"> ?to=NamaTamu</span>.
              </p>
            ) : (
              <>
                <Field label="Link Personal Tamu">
                  <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 font-mono text-xs break-all dark:border-zinc-700 dark:bg-zinc-900">
                    {shareLink}
                  </p>
                </Field>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => void handleCopyShareLink()}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-zinc-200 px-4 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                  >
                    {shareCopied ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" /> Disalin!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Salin Link
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1fb857]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Bagikan ke WhatsApp
                  </button>
                </div>
              </>
            )}
          </Accordion>
        </section>

        {/* Live preview kanan: frame smartphone */}
        <section className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold tracking-tight">Live Preview</h2>
            <div className="flex items-center gap-2" title="Nama pratinjau hanya tampil di preview ini dan tidak tersimpan">
              <Input
                value={previewGuest}
                onChange={(e) => setPreviewGuest(e.target.value)}
                placeholder="Pratinjau sbg tamu..."
                aria-label="Pratinjau sebagai tamu (tidak tersimpan)"
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
          <BuilderPreview
            title={deferredTitle || "Undangan Digital"}
            templateType={previewTemplateType}
            content={deferredPreviewContent}
            guestName={deferredGuestName}
            defaultOpened={previewOpened}
            replayKey={previewKey}
          />
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

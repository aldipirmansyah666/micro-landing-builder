import type { CoupleOrder, InvitationContent } from "@/lib/invitation";
import { EMPTY_INVITATION } from "@/lib/invitation";
import type { WeddingEventEntry } from "@/lib/invitation-events";
import { deriveDayLabel } from "@/lib/invitation-events";

/**
 * Id langkah wizard — mencakup 7 langkah (termasuk "tinjau" yang tidak
 * punya schema validasi sendiri, karena hanya menampilkan ringkasan
 * read-only + tombol terbitkan).
 *
 * Sengaja TERPISAH dari `StepId` di `lib/validation/invitation.ts`
 * (yang hanya 6 key: template…hadiah) — validasi strict hanya berlaku
 * pada 6 langkah berform; langkah "tinjau" divalidasi menyeluruh oleh
 * save-route (`InvitationContentSchema`) saat benar-benar disimpan.
 */
export type WizardStepId =
  | "template"
  | "mempelai"
  | "acara"
  | "cerita"
  | "media"
  | "hadiah"
  | "tinjau";

/**
 * Urutan langkah wizard — satu sumber kebenaran untuk indikator progress,
 * navigasi, dan pemetaan index ↔ id. Jangan ubah urutan tanpa memikirkan
 * migrasi draft tersimpan di localStorage (lihat `useDraftPersistence`).
 */
export const WIZARD_STEPS: {
  id: WizardStepId;
  label: string;
  description: string;
}[] = [
  { id: "template", label: "Template", description: "Pilih desain & atur alamat undangan" },
  { id: "mempelai", label: "Mempelai", description: "Data kedua mempelai & urutan tampil" },
  { id: "acara", label: "Acara", description: "Jadwal akad, resepsi & acara lain" },
  { id: "cerita", label: "Cerita", description: "Sapaan pembuka & love story" },
  { id: "media", label: "Media", description: "Foto sampul, galeri & backsound" },
  { id: "hadiah", label: "Hadiah", description: "Rekening, alamat kado & link tambahan" },
  { id: "tinjau", label: "Terbitkan", description: "Tinjau akhir & bagikan undangan" },
] as const;

export const WIZARD_STEP_COUNT = WIZARD_STEPS.length;

/**
 * Metadata non-konten yang hidup di luar `InvitationContent` (kolom
 * terpisah di tabel `landing_pages`). Disimpan bersama state wizard
 * agar satu langkah "Template" bisa mengatur semuanya sekaligus.
 */
export interface WizardMeta {
  slug: string;
  title: string;
  templateType: string;
}

export interface WizardState {
  /** Index 0-based ke `WIZARD_STEPS`. */
  stepIndex: number;
  /** Konten undangan kanonik — selalu lengkap (bukan partial). */
  data: InvitationContent;
  meta: WizardMeta;
  /**
   * Status kelengkapan per langkah, dihitung ulang setiap kali data/meta
   * berubah lewat efek di `useInvitationWizard`. True = langkah lolos
   * validasi strict (`STEP_SCHEMAS`) saat terakhir diperiksa.
   */
  completed: Record<WizardStepId, boolean>;
  /** True bila ada perubahan yang belum tersimpan ke server. */
  isDirty: boolean;
}

export type WizardAction =
  | { type: "GOTO"; index: number }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "PATCH"; patch: Partial<InvitationContent> }
  | { type: "PATCH_META"; patch: Partial<WizardMeta> }
  | { type: "SET_EVENTS"; events: WeddingEventEntry[] }
  | { type: "SET_COMPLETED"; completed: Partial<Record<WizardStepId, boolean>> }
  | { type: "HYDRATE"; state: WizardState }
  | { type: "MARK_SAVED" };

export function clampStepIndex(index: number): number {
  if (Number.isNaN(index)) return 0;
  return Math.min(Math.max(index, 0), WIZARD_STEP_COUNT - 1);
}

/**
 * Status awal wizard. `data` diseed dari `EMPTY_INVITATION` sehingga
 * setiap field punya tipe & nilai default yang aman — langkah mana pun
 * bisa membaca `state.data.field` tanpa optional chaining.
 */
export function createInitialWizardState(
  seed?: Partial<{ meta: Partial<WizardMeta>; data: Partial<InvitationContent> }>
): WizardState {
  return {
    stepIndex: 0,
    data: { ...EMPTY_INVITATION, ...seed?.data },
    meta: {
      slug: "",
      title: "",
      templateType: "aruna",
      ...seed?.meta,
    },
    completed: {} as Record<WizardStepId, boolean>,
    isDirty: false,
  };
}

/**
 * Reducer murni (tanpa side-effect) — mudah diuji & diprediksi.
 * Autosave/persistensi ditangani terpisah di `useDraftPersistence`.
 */
export function wizardReducer(
  state: WizardState,
  action: WizardAction
): WizardState {
  switch (action.type) {
    case "GOTO":
      return { ...state, stepIndex: clampStepIndex(action.index) };
    case "NEXT": {
      const next = clampStepIndex(state.stepIndex + 1);
      if (next === state.stepIndex) return state;
      return { ...state, stepIndex: next };
    }
    case "PREV": {
      const prev = clampStepIndex(state.stepIndex - 1);
      if (prev === state.stepIndex) return state;
      return { ...state, stepIndex: prev };
    }
    case "PATCH":
      return {
        ...state,
        data: { ...state.data, ...action.patch },
        isDirty: true,
      };
    case "PATCH_META":
      return {
        ...state,
        meta: { ...state.meta, ...action.patch },
        isDirty: true,
      };
    case "SET_EVENTS":
      return {
        ...state,
        data: { ...state.data, events: action.events },
        isDirty: true,
      };
    case "SET_COMPLETED":
      return {
        ...state,
        completed: { ...state.completed, ...action.completed },
      };
    case "HYDRATE":
      return action.state;
    case "MARK_SAVED":
      return { ...state, isDirty: false };
    default:
      return state;
  }
}

/**
 * Bangun entri acara baru dengan id unik. `isPrimary` false secara
 * default — hanya boleh ada satu acara utama, dan pemilihan utama
 * dikendalikan eksplisit lewat radio "jadwal countdown" di UI.
 */
export function createEmptyEvent(): WeddingEventEntry {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind: "lainnya",
    title: "",
    dayLabel: "",
    date: "",
    time: "",
    timezone: "WIB",
    venue: "",
    address: "",
    mapsUrl: "",
    dresscode: "",
    isPrimary: false,
  };
}

/**
 * Sinkronkan `dayLabel` setiap acara dengan tanggalnya (contoh: "Sabtu").
 * Dipanggil dari reducer `SET_EVENTS` agar tampilan timeline langsung
 * konsisten tanpa menunggu langkah render ulang manual.
 */
export function withDerivedDayLabels(
  events: WeddingEventEntry[]
): WeddingEventEntry[] {
  return events.map((e) => ({
    ...e,
    dayLabel: e.date ? deriveDayLabel(e.date) : "",
  }));
}

/** Tukar urutan tampil mempelai (untuk toggle "Wanita Dulu" vs "Pria Dulu"). */
export function toggleCoupleOrder(current: CoupleOrder): CoupleOrder {
  return current === "brideFirst" ? "groomFirst" : "brideFirst";
}

"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import type { ZodError } from "zod";
import type { InvitationContent } from "@/lib/invitation";
import { STEP_SCHEMAS, type StepId } from "@/lib/validation/invitation";
import {
  WIZARD_STEPS,
  clampStepIndex,
  createInitialWizardState,
  wizardReducer,
  type WizardMeta,
  type WizardStepId,
  type WizardState,
} from "./wizardMachine";
import { useDraftPersistence } from "./useDraftPersistence";

/**
 * Ekstrak payload yang relevan dari state penuh untuk divalidasi
 * per-langkah — `STEP_SCHEMAS` hanya membutuhkan subset field tertentu,
 * bukan seluruh `InvitationContent`.
 */
function pickStepPayload(step: WizardStepId, state: WizardState): unknown {
  const { data, meta } = state;
  switch (step) {
    case "template":
      return { slug: meta.slug, title: meta.title, templateType: meta.templateType };
    case "mempelai":
      return {
        coupleOrder: data.coupleOrder,
        groomFullName: data.groomFullName,
        groomNickname: data.groomNickname,
        groomParents: data.groomParents,
        groomChildOrder: data.groomChildOrder,
        groomInstagram: data.groomInstagram,
        groomPhoto: data.groomPhoto,
        brideFullName: data.brideFullName,
        brideNickname: data.brideNickname,
        brideParents: data.brideParents,
        brideChildOrder: data.brideChildOrder,
        brideInstagram: data.brideInstagram,
        bridePhoto: data.bridePhoto,
      };
    case "acara":
      return { events: data.events ?? [] };
    case "cerita":
      return {
        greeting: data.greeting,
        closingNote: data.closingNote,
        stories: data.stories,
      };
    case "media":
      return {
        heroImage: data.heroImage,
        galleryImages: data.galleryImages,
        galleryVideos: data.galleryVideos,
        backsoundUrl: data.backsoundUrl,
      };
    case "hadiah":
      return {
        accounts: data.accounts,
        giftAddress: data.giftAddress,
        liveStreamUrl: data.liveStreamUrl,
        igFilterUrl: data.igFilterUrl,
        musicRequestUrl: data.musicRequestUrl,
      };
    case "tinjau":
      // Langkah tinjau tidak punya field sendiri — validasi menyeluruh
      // (draft-lenient) hanya untuk memastikan struktur data utuh sebelum
      // benar-benar disimpan oleh save-route.
      return data;
    default:
      return data;
  }
}

/**
 * Validasi satu langkah terhadap `STEP_SCHEMAS` (strict) — kecuali
 * langkah `tinjau` yang tidak punya schema tersendiri (seluruh
 * keputusan kelengkapan sudah di-check per langkah sebelumnya; struktur
 * akhir divalidasi menyeluruh oleh save-route).
 */
export function validateWizardStep(
  step: WizardStepId,
  state: WizardState
): { success: true } | { success: false; error: ZodError } {
  if (step === "tinjau") {
    return { success: true };
  }
  // `step` di sini pasti salah satu dari 6 key `STEP_SCHEMAS` (tipe
  // `WizardStepId` minus "tinjau" secara kontrak sama dengan `StepId`).
  const schema = STEP_SCHEMAS[step as StepId];
  const result = schema.safeParse(pickStepPayload(step, state));
  if (result.success) return { success: true };
  return { success: false, error: result.error };
}

/** Format ZodError jadi pesan ringkas untuk ditampilkan di bawah tombol. */
export function formatStepError(error: ZodError): string {
  return error.issues
    .slice(0, 3)
    .map((i) => {
      const path = i.path.length > 0 ? i.path.map(String).join(".") : "(root)";
      return `${path}: ${i.message}`;
    })
    .join("; ");
}

export interface UseInvitationWizard {
  state: WizardState;
  /** True bila semua langkah sebelum `stepIndex` (inklusif) lolos validasi strict. */
  isFirstInvalidAbove: (index: number) => boolean;
  /** Validasi langkah saat ini. Tidak memutus navigasi — hanya melaporkan. */
  validateCurrentStep: () => { success: true } | { success: false; message: string };
  /** Validasi lalu lanjut. Return false bila validasi gagal (pesan disimpan di `stepError`). */
  goNext: () => boolean;
  goPrev: () => void;
  goTo: (index: number) => boolean;
  patch: (patch: Partial<InvitationContent>) => void;
  patchMeta: (patch: Partial<WizardMeta>) => void;
  markSaved: () => void;
  /** Pesan error validasi langkah saat ini (null bila tidak ada). */
  stepError: string | null;
  /** Waktu terakhir draft lokal tersimpan (epoch ms) atau null. */
  lastSavedAt: number | null;
  /** Hapus draft lokal (setelah sukses simpan server). */
  clearDraft: () => void;
  /** Status kelengkapan tiap langkah, di-update setiap patch. */
  completed: Record<WizardStepId, boolean>;
}

/**
 * Hook inti wizard: menggabungkan reducer murni (`wizardReducer`),
 * validasi per-langkah (`STEP_SCHEMAS`), dan autosave draft lokal
 * (`useDraftPersistence`) di balik satu API yang mudah dipakai
 * komponen presentasional.
 */
export function useInvitationWizard(options: {
  initialMeta?: Partial<WizardMeta>;
  initialData?: Partial<InvitationContent>;
  /** Matikan autosave draft (mis. untuk preview read-only). */
  persistDraft?: boolean;
}): UseInvitationWizard {
  const { initialMeta, initialData, persistDraft = true } = options;
  const [state, dispatch] = useReducer(
    wizardReducer,
    undefined,
    () => createInitialWizardState({ meta: initialMeta, data: initialData })
  );
  const [stepError, setStepError] = useState<string | null>(null);

  const { lastSavedAt, clearDraft } = useDraftPersistence(
    state.meta.slug,
    state,
    (hydrated) => dispatch({ type: "HYDRATE", state: hydrated }),
    { enabled: persistDraft }
  );

  // Hitung ulang status `completed` setiap kali data/meta berubah —
  // mahal tapi murah untuk skala form ini (< 1ms per objek kecil), dan
  // menghindari bug stale-state khas manual bookkeeping.
  useEffect(() => {
    const completed = {} as Record<WizardStepId, boolean>;
    for (const { id } of WIZARD_STEPS) {
      completed[id] = id === "tinjau" ? true : validateWizardStep(id, state).success;
    }
    dispatch({ type: "SET_COMPLETED", completed });
  }, [state]);

  const validateCurrentStep = useCallback((): {
    success: true;
  } | { success: false; message: string } => {
    const step = WIZARD_STEPS[state.stepIndex].id;
    const result = validateWizardStep(step, state);
    if (result.success) {
      setStepError(null);
      return { success: true };
    }
    const message = formatStepError(result.error);
    setStepError(message);
    return { success: false, message };
  }, [state]);

  const goNext = useCallback((): boolean => {
    const check = validateCurrentStep();
    if (!check.success) return false;
    dispatch({ type: "NEXT" });
    return true;
  }, [validateCurrentStep]);

  const goPrev = useCallback(() => {
    setStepError(null);
    dispatch({ type: "PREV" });
  }, []);

  const goTo = useCallback((index: number): boolean => {
    setStepError(null);
    dispatch({ type: "GOTO", index: clampStepIndex(index) });
    return true;
  }, []);

  const patch = useCallback((p: Partial<InvitationContent>) => {
    setStepError(null);
    dispatch({ type: "PATCH", patch: p });
  }, []);

  const patchMeta = useCallback((p: Partial<WizardMeta>) => {
    setStepError(null);
    dispatch({ type: "PATCH_META", patch: p });
  }, []);

  const markSaved = useCallback(() => {
    dispatch({ type: "MARK_SAVED" });
  }, []);

  const isFirstInvalidAbove = useCallback(
    (index: number): boolean => {
      for (let i = 0; i < index; i++) {
        if (!state.completed[WIZARD_STEPS[i].id]) return true;
      }
      return false;
    },
    [state.completed]
  );

  return useMemo(
    () => ({
      state,
      isFirstInvalidAbove,
      validateCurrentStep,
      goNext,
      goPrev,
      goTo,
      patch,
      patchMeta,
      markSaved,
      stepError,
      lastSavedAt,
      clearDraft,
      completed: state.completed,
    }),
    [
      state,
      isFirstInvalidAbove,
      validateCurrentStep,
      goNext,
      goPrev,
      goTo,
      patch,
      patchMeta,
      markSaved,
      stepError,
      lastSavedAt,
      clearDraft,
    ]
  );
}

"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { WizardShell } from "./WizardShell";
import { TemplateStep } from "./steps/TemplateStep";
import { MempelaiStep } from "./steps/MempelaiStep";
import { AcaraStep } from "./steps/AcaraStep";
import { CeritaStep } from "./steps/CeritaStep";
import { MediaStep } from "./steps/MediaStep";
import { HadiahStep } from "./steps/HadiahStep";
import { TinjauStep } from "./steps/TinjauStep";
import { useInvitationWizard } from "@/lib/wizard/useInvitationWizard";
import { WIZARD_STEPS } from "@/lib/wizard/wizardMachine";
import type { InvitationContent } from "@/lib/invitation";

/**
 * Komponen klien utama multi-step wizard.
 *
 * Menyusun seluruh langkah, menghubungkan `useInvitationWizard`
 * (state + validasi + autosave draft) ke UI, dan menangani penyimpanan
 * final ke `POST /api/pages/save` (yang sudah divalidasi `InvitationContentSchema`
 * di sisi server).
 */
export function InvitationWizard({
  initialMeta,
  initialData,
  onSaved,
}: {
  initialMeta?: { slug?: string; title?: string; templateType?: string };
  initialData?: Partial<InvitationContent>;
  /** Dipanggil setelah simpan sukses (mis. redirect ke dashboard/live view). */
  onSaved?: (result: { slug: string; created: boolean }) => void;
}) {
  const router = useRouter();
  const wizard = useInvitationWizard({
    initialMeta,
    initialData,
    persistDraft: true,
  });
  const { state, patch, patchMeta, goNext, goPrev, goTo, stepError } = wizard;

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  const handlePublish = useCallback(async () => {
    setSaveError(null);
    setIsSaving(true);
    try {
      const res = await fetch("/api/pages/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: state.meta.slug.trim(),
          title: state.meta.title.trim(),
          template_type: state.meta.templateType,
          content_json: state.data,
        }),
      });
      const body = (await res.json()) as {
        ok?: boolean;
        created?: boolean;
        page?: { slug: string };
        error?: string;
      };
      if (!res.ok) throw new Error(body.error ?? "Gagal menyimpan undangan");
      const finalSlug = body.page?.slug ?? state.meta.slug.trim();
      setSavedSlug(finalSlug);
      wizard.markSaved();
      wizard.clearDraft();
      onSaved?.({ slug: finalSlug, created: body.created === true });
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Gagal menyimpan undangan"
      );
    } finally {
      setIsSaving(false);
    }
  }, [state.meta.slug, state.meta.title, state.meta.templateType, state.data, wizard, onSaved]);

  const currentStepId = WIZARD_STEPS[state.stepIndex].id;
  const isFirst = state.stepIndex === 0;
  const isLast = state.stepIndex === WIZARD_STEPS.length - 1;

  function renderStep() {
    switch (currentStepId) {
      case "template":
        return <TemplateStep meta={state.meta} onChange={patchMeta} />;
      case "mempelai":
        return <MempelaiStep data={state.data} onChange={patch} />;
      case "acara":
        return <AcaraStep data={state.data} onChange={patch} />;
      case "cerita":
        return <CeritaStep data={state.data} onChange={patch} />;
      case "media":
        return <MediaStep data={state.data} onChange={patch} />;
      case "hadiah":
        return <HadiahStep data={state.data} onChange={patch} />;
      case "tinjau":
        return (
          <TinjauStep
            data={state.data}
            meta={state.meta}
            isSaving={isSaving}
            saveError={saveError}
            onPublish={() => void handlePublish()}
          />
        );
      default:
        return null;
    }
  }

  return (
    <WizardShell
      stepIndex={state.stepIndex}
      completed={state.completed}
      onSelectStep={goTo}
      onPrev={goPrev}
      onNext={() => goNext()}
      onNextLabel={isLast ? "Selesai" : "Lanjut"}
      isPrevDisabled={isFirst}
      stepError={stepError}
      lastSavedAt={wizard.lastSavedAt}
      isSaving={isSaving}
      footerExtra={
        savedSlug ? (
          <button
            type="button"
            onClick={() => router.push(`/p/${savedSlug}`)}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Lihat Live ↗
          </button>
        ) : null
      }
    >
      {renderStep()}
    </WizardShell>
  );
}

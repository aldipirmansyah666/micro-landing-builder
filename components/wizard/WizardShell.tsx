"use client";

import type { ReactNode } from "react";
import { Button } from "@/design-system/primitives";
import { cn } from "@/design-system/cn";
import { StepIndicator } from "./StepIndicator";
import { WIZARD_STEPS } from "@/lib/wizard/wizardMachine";

/**
 * Shell layout untuk multi-step wizard.
 *
 * Struktur (mobile-first):
 * - Header sticky: indikator progres + info "Tersimpan lokal" (draft autosave).
 * - Konten langkah (slot `children`) — diberi `key={stepIndex}` agar
 *   state form per-langkah (controlled input) di-reset saat pindah langkah,
 *   mencegah nilai input lama "bocor" ke langkah berbeda.
 * - Footer sticky: tombol Kembali / Lanjut / Terbitkan + pesan error
 *   validasi (muncul saat Lanjut ditolak).
 */
export function WizardShell({
  stepIndex,
  completed,
  onSelectStep,
  onPrev,
  onNext,
  onNextLabel = "Lanjut",
  isNextDisabled = false,
  isPrevDisabled = false,
  stepError,
  lastSavedAt,
  isSaving = false,
  saveDisabled = false,
  footerExtra,
  children,
}: {
  stepIndex: number;
  completed: Record<string, boolean>;
  onSelectStep: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onNextLabel?: string;
  isNextDisabled?: boolean;
  isPrevDisabled?: boolean;
  stepError: string | null;
  lastSavedAt: number | null;
  isSaving?: boolean;
  saveDisabled?: boolean;
  /** Slot opsional di footer (mis. tombol "Terbitkan" di langkah tinjau). */
  footerExtra?: ReactNode;
  children: ReactNode;
}) {
  const current = WIZARD_STEPS[stepIndex];
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
          <StepIndicator
            stepIndex={stepIndex}
            completed={completed}
            onSelect={onSelectStep}
          />
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                Langkah {stepIndex + 1} dari {WIZARD_STEPS.length} — {current.label}
              </p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {current.description}
              </p>
            </div>
            {lastSavedAt && (
              <span className="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500">
                Draft lokal tersimpan
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
        {/* key memaksa remount penuh tiap ganti langkah — state form
            controlled per-langkah tidak saling bocor antar layar. */}
        <div key={stepIndex}>{children}</div>
      </main>

      <footer className="sticky bottom-0 z-10 border-t border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
          {stepError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950 dark:text-red-300"
            >
              {stepError}
            </p>
          )}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              onClick={onPrev}
              disabled={isPrevDisabled || stepIndex === 0}
            >
              Kembali
            </Button>
            <div className="flex items-center gap-2">
              {footerExtra}
              {stepIndex < WIZARD_STEPS.length - 1 ? (
                <Button onClick={onNext} disabled={isNextDisabled}>
                  {onNextLabel}
                </Button>
              ) : null}
            </div>
          </div>
          {isSaving && (
            <p className={cn("text-center text-[11px] text-zinc-400")}>
              Menyimpan…
            </p>
          )}
          {saveDisabled && null}
        </div>
      </footer>
    </div>
  );
}

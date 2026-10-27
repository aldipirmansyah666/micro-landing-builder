"use client";

import { cn } from "@/design-system/cn";
import { WIZARD_STEPS } from "@/lib/wizard/wizardMachine";

/**
 * Indikator progres horizontal untuk wizard (mobile-first).
 *
 * Menampilkan 7 langkah sebagai bulatan bernomor yang terhubung garis.
 * Status tiap bulatan:
 * - `done` (hijau + centang): langkah sudah lolos validasi strict.
 * - `active` (hitam solid): langkah yang sedang dibuka.
 * - `todo` (abu-abu outline): langkah berikutnya yang belum tersentuh.
 * - `blocked` (kuning): langkah yang bisa diklik tetapi langkah sebelumnya
 *   belum lengkap (perlu diselesaikan dulu).
 */
export function StepIndicator({
  stepIndex,
  completed,
  onSelect,
}: {
  stepIndex: number;
  completed: Record<string, boolean>;
  onSelect: (index: number) => void;
}) {
  return (
    <nav aria-label="Progres langkah" className="w-full">
      <ol className="flex items-center gap-0">
        {WIZARD_STEPS.map((step, index) => {
          const isActive = index === stepIndex;
          const isDone = completed[step.id] === true && !isActive;
          const isBlocked =
            !isActive &&
            !isDone &&
            WIZARD_STEPS.slice(0, index).some((s) => completed[s.id] !== true);
          return (
            <li key={step.id} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "group flex flex-col items-center gap-1.5 outline-none",
                  "focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 rounded-lg px-1"
                )}
                title={step.description}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                    isDone &&
                      "border-emerald-600 bg-emerald-600 text-white",
                    isActive &&
                      "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900",
                    isBlocked &&
                      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
                    !isActive &&
                      !isDone &&
                      !isBlocked &&
                      "border-zinc-200 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500",
                    "group-hover:border-zinc-400 group-hover:text-zinc-600 dark:group-hover:border-zinc-500 dark:group-hover:text-zinc-300"
                  )}
                >
                  {isDone ? "✓" : index + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-[10px] font-medium sm:block",
                    isActive
                      ? "text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-500 dark:text-zinc-400"
                  )}
                >
                  {step.label}
                </span>
              </button>
              {index < WIZARD_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "mx-1 h-px flex-1 sm:mx-2",
                    completed[step.id] === true
                      ? "bg-emerald-500"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/design-system/cn";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Judul yang dibaca screen reader sebagai nama dialog. */
  title?: ReactNode;
  /** Ukuran panel. `md` mengikuti modal upgrade, `sm` mengikuti modal info PRO. */
  size?: "sm" | "md";
  /** Tombol tutup di pojok kanan atas panel. */
  showCloseButton?: boolean;
  /** Class tambahan untuk elemen judul (mis. gaya ikon di samping teks). */
  titleClassName?: string;
  className?: string;
  children: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal dialog dengan semantik aksesibilitas yang benar:
 * `role="dialog"` + `aria-modal`, focus awal masuk ke panel, Tab
 * diputar di dalam panel (focus trap), Escape menutup, dan fokus
 * dikembalikan ke elemen pemicu saat ditutup.
 *
 * Modal yang sudah ada sebelumnya di aplikasi (upgrade PRO, info PRO,
 * katalog template) memakai pola yang serupa tetapi tanpa focus trap
 * maupun Escape — primitive iniraisal menyatukan semuanya.
 */
export function Dialog({
  open,
  onClose,
  title,
  size = "md",
  showCloseButton = true,
  titleClassName,
  className,
  children,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const panel = panelRef.current;
    if (panel) {
      const focusable = panel.querySelector<HTMLElement>(FOCUSABLE);
      (focusable ?? panel).focus();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full rounded-3xl bg-white p-6 text-zinc-900 shadow-2xl outline-none dark:bg-zinc-950 dark:text-zinc-50",
          size === "md" ? "max-w-md" : "max-w-sm",
          className
        )}
      >
        {title ? (
          <div className="flex items-start justify-between gap-4">
            <h3
              id={titleId}
              className={cn(
                "text-lg font-semibold tracking-tight",
                titleClassName
              )}
            >
              {title}
            </h3>
            {showCloseButton ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/design-system/cn";

export interface AccordionProps {
  title: ReactNode;
  /** Keadaan awal saat uncontrolled. */
  defaultOpen?: boolean;
  /** Set untuk controlled mode; `onOpenChange` wajib diisi bila dipakai. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: ReactNode;
}

/**
 * Akordeon yang dapat dipakai dalam mode controlled maupun uncontrolled.
 *
 * Bagian dalam hanya dirender saat terbuka (bukan disembunyikan dengan
 * CSS) — supaya konten berat di dalam accordion tidak ikut ter-mount
 * saat tertutup.
 */
export function Accordion({
  title,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  className,
  children,
}: AccordionProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;
  const panelId = useId();

  function toggle() {
    const next = !open;
    if (!isControlled) setOpenState(next);
    onOpenChange?.(next);
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800",
        className
      )}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-2 bg-zinc-50 px-4 py-3.5 text-left text-sm font-semibold tracking-tight transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open ? (
        <div id={panelId} className="space-y-4 p-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}

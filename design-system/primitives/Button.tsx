import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/design-system/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "pro";

export type ButtonSize = "sm" | "md" | "lg";

/**
 * Class dasar tombol. Sengaja TIDAK memuat `text-*` warna maupun
 * `disabled:opacity-50` — warna berasal dari variant, dan `disabled:`
 * hanya bermakna pada elemen native button (link tidak punya itu).
 */
const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
  secondary:
    "border border-zinc-200 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900",
  ghost: "hover:bg-zinc-100 disabled:opacity-50 dark:hover:bg-zinc-800",
  danger:
    "text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950",
  pro: "bg-amber-400 text-amber-950 hover:bg-amber-300 disabled:opacity-50",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-sm",
};

/**
 * Bangun class tombol tanpa merender elemen `<button>`.
 *
 * Dipakai untuk elemen non-button (mis. `next/link` yang tampil seperti
 * tombol) sehingga gaya "primary" hanya ditulis satu kali di aplikasi.
 */
export function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(baseClass, variantClass[variant], sizeClass[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * Tombol utama aplikasi. Styling dipusatkan di sini agar redesign
 * berikutnya cukup mengubah satu file, bukan menyunting ulang class
 * string di dozens call-site.
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, size, className })}
      {...props}
    />
  );
}

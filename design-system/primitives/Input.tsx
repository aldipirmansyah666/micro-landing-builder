import type {
  InputHTMLAttributes,
  Ref,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/design-system/cn";

/**
 * Class dasar input. Sengaja TIDAK memuat width/tinggi supaya
 * `Input` bisa dipakai di layout yang butuh `flex-1`, `sm:w-44`, atau
 * `w-full` tanpa saling bertabrakan.
 */
export const inputBaseClass =
  "rounded-xl border border-zinc-200 bg-white px-3.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-400";

/**
 * `md` — field formulir standar: lebar penuh + padding vertikal.
 * `sm` — field compact: tinggi tetap 40px, tanpa padding vertikal
 *         (dipakai pada baris filter/tabel yang menempel berdampingan).
 */
export type InputSize = "md" | "sm";

const sizeClass: Record<InputSize, string> = {
  md: "w-full py-2.5",
  sm: "h-10",
};

/**
 * Ukuran field di sini BUKAN atribut HTML `size` (yang berisi jumlah
 * karakter). Atribut HTML asli itu dikecualikan dari props agar tidak bentrok.
 */
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Ukuran field (bukan atribut HTML `size` yang berisi angka karakter).
   * `md` — field formulir standar: lebar penuh + padding vertikal.
   * `sm` — field compact: tinggi tetap 40px, tanpa padding vertikal
   *         (dipakai pada baris filter/tabel yang menempel berdampingan).
   */
  size?: InputSize;
  /**
   * `ref` diteruskan apa adanya. Pada React 19 `ref` bisa menjadi
   * prop biasa untuk function component, jadi primitive ini tetap
   * bisa dipakai sebagai target `input[type=file]` yang di-klik lewat
   * tombol ("Upload Foto").
   */
  ref?: Ref<HTMLInputElement>;
}

export function Input({
  size = "md",
  className,
  ...props
}: InputProps) {
  return (
    <input
      className={cn(inputBaseClass, sizeClass[size], className)}
      {...props}
    />
  );
}

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: InputSize;
}

export function Textarea({
  size = "md",
  className,
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={cn(inputBaseClass, sizeClass[size], className)}
      {...props}
    />
  );
}

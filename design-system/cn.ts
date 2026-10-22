import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Gabungkan class Tailwind dengan aman.
 *
 * `clsx` menangani input kondisional (string/array/object/false/null), lalu
 * `twMerge` menyelesaikan konflik utility Tailwind yang saling menimpa
 * (mis. `px-2` vs `px-4` → hanya `px-4` yang tersisa). Tanpa
 * `tailwind-merge`, penulisan class kondisional seperti
 * `` `${active ? "bg-zinc-900" : "bg-white"}` `` menghasilkan CSS yang
 * tidak bisa diprediksi urutan cascade-nya.
 *
 * PEMAKAIAN: seluruh primitive UI di `design-system/primitives` memakai
 * helper ini. Komponen yang belum dimigrasi (template undangan) boleh
 * tetap memakai template literal biasa — helper ini hanya wajib dipakai
 * ketika menggabungkan class dari luar (mis. `className` dari props).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type { ClassValue };

import type { ReactNode } from "react";

export const fieldLabelClass =
  "mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400";

export interface FieldProps {
  label: ReactNode;
  /**
   * Id elemen kontrol. Wajib diisi bila `error`/`hint` dipakai agar
   * screen reader mengaitkan pesan dengan field-nya.
   */
  htmlFor?: string;
  error?: ReactNode;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Wrapper label + kontrol + pesan bantu/galat.
 *
 * Dipisah dari komponen `Input` supaya field yang berisi kontrol
 * gabungan (mis. input + tombol upload) tetap bisa memakai label yang
 * sama tanpa membuat ulang markup.
 */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={fieldLabelClass}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      ) : null}
      {hint ? (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

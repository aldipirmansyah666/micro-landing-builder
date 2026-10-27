"use client";

import { Field, Input } from "@/design-system/primitives";
import { cn } from "@/design-system/cn";
import { COUPLE_ORDER_OPTIONS } from "@/lib/invitation";
import type { CoupleOrder, InvitationContent } from "@/lib/invitation";

/**
 * Langkah 2: data mempelai + toggle urutan tampil
 * ("Wanita Dulu" vs "Pria Dulu") yang otomatis mengubah posisi render
 * nama di seluruh template (lewat `coupleOrder` → `coupleEntries()`).
 */
export function MempelaiStep({
  data,
  onChange,
}: {
  data: InvitationContent;
  onChange: (patch: Partial<InvitationContent>) => void;
}) {
  const set = (field: keyof InvitationContent, value: string) =>
    onChange({ [field]: value } as Partial<InvitationContent>);

  return (
    <div className="flex flex-col gap-6">
      {/* Toggle urutan tampil mempelai */}
      <div>
        <span className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Urutan Nama Ditampilkan
        </span>
        <div className="grid grid-cols-2 gap-2">
          {COUPLE_ORDER_OPTIONS.map((opt) => {
            const active = data.coupleOrder === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ coupleOrder: opt.value as CoupleOrder })}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <p className="mt-1 text-[11px] text-zinc-400">
          Mengatur posisi nama mempelai pria vs wanita di sampul & seluruh section undangan.
        </p>
      </div>

      {/* Mempelai Pria */}
      <fieldset className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <legend className="px-1 text-sm font-semibold">Mempelai Pria</legend>
        <Field label="Nama Lengkap" htmlFor="groomFullName">
          <Input
            id="groomFullName"
            value={data.groomFullName}
            maxLength={120}
            onChange={(e) => set("groomFullName", e.target.value)}
          />
        </Field>
        <Field label="Nama Panggilan" htmlFor="groomNickname">
          <Input
            id="groomNickname"
            value={data.groomNickname}
            maxLength={40}
            onChange={(e) => set("groomNickname", e.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama Ayah" htmlFor="groomFatherName">
            <Input
              id="groomFatherName"
              value={data.groomFatherName}
              maxLength={80}
              placeholder="cth: Haryono"
              onChange={(e) => set("groomFatherName", e.target.value)}
            />
          </Field>
          <Field label="Nama Ibu" htmlFor="groomMotherName">
            <Input
              id="groomMotherName"
              value={data.groomMotherName}
              maxLength={80}
              placeholder="cth: Sulastri"
              onChange={(e) => set("groomMotherName", e.target.value)}
            />
          </Field>
        </div>
        <p className="text-[11px] text-zinc-400">
          Cukup ketik nama tanpa gelar — &ldquo;Bpk.&rdquo; dan &ldquo;Ibu&rdquo; ditambahkan otomatis saat dirender.
        </p>
        <Field label="Anak Ke-" htmlFor="groomChildOrder">
          <Input
            id="groomChildOrder"
            value={data.groomChildOrder}
            maxLength={40}
            onChange={(e) => set("groomChildOrder", e.target.value)}
          />
        </Field>
        <Field label="Akun Instagram" htmlFor="groomInstagram">
          <Input
            id="groomInstagram"
            value={data.groomInstagram}
            maxLength={60}
            placeholder="@username"
            onChange={(e) => set("groomInstagram", e.target.value)}
          />
        </Field>
      </fieldset>

      {/* Mempelai Wanita */}
      <fieldset className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <legend className="px-1 text-sm font-semibold">Mempelai Wanita</legend>
        <Field label="Nama Lengkap" htmlFor="brideFullName">
          <Input
            id="brideFullName"
            value={data.brideFullName}
            maxLength={120}
            onChange={(e) => set("brideFullName", e.target.value)}
          />
        </Field>
        <Field label="Nama Panggilan" htmlFor="brideNickname">
          <Input
            id="brideNickname"
            value={data.brideNickname}
            maxLength={40}
            onChange={(e) => set("brideNickname", e.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama Ayah" htmlFor="brideFatherName">
            <Input
              id="brideFatherName"
              value={data.brideFatherName}
              maxLength={80}
              placeholder="cth: Bambang"
              onChange={(e) => set("brideFatherName", e.target.value)}
            />
          </Field>
          <Field label="Nama Ibu" htmlFor="brideMotherName">
            <Input
              id="brideMotherName"
              value={data.brideMotherName}
              maxLength={80}
              placeholder="cth: Ratna"
              onChange={(e) => set("brideMotherName", e.target.value)}
            />
          </Field>
        </div>
        <p className="text-[11px] text-zinc-400">
          Cukup ketik nama tanpa gelar — &ldquo;Bpk.&rdquo; dan &ldquo;Ibu&rdquo; ditambahkan otomatis saat dirender.
        </p>
        <Field label="Anak Ke-" htmlFor="brideChildOrder">
          <Input
            id="brideChildOrder"
            value={data.brideChildOrder}
            maxLength={40}
            onChange={(e) => set("brideChildOrder", e.target.value)}
          />
        </Field>
        <Field label="Akun Instagram" htmlFor="brideInstagram">
          <Input
            id="brideInstagram"
            value={data.brideInstagram}
            maxLength={60}
            placeholder="@username"
            onChange={(e) => set("brideInstagram", e.target.value)}
          />
        </Field>
      </fieldset>
    </div>
  );
}

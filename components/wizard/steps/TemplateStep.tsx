"use client";

import { Field, Input, Select } from "@/design-system/primitives";
import { TEMPLATE_REGISTRY } from "@/lib/templates";
import type { WizardMeta } from "@/lib/wizard/wizardMachine";

/** Langkah 1: pilih template katalog + atur slug/judul undangan. */
export function TemplateStep({
  meta,
  onChange,
}: {
  meta: WizardMeta;
  onChange: (patch: Partial<WizardMeta>) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Field
        label="Judul Undangan"
        htmlFor="wizard-title"
        hint="Contoh: Pernikahan Andi & Sinta — tampil di dashboard & metadata."
      >
        <Input
          id="wizard-title"
          value={meta.title}
          maxLength={120}
          placeholder="Pernikahan Andi & Sinta"
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </Field>

      <Field
        label="Alamat Undangan (slug)"
        htmlFor="wizard-slug"
        hint="Huruf kecil, angka, dan strip. Contoh: andi-sinta."
      >
        <Input
          id="wizard-slug"
          value={meta.slug}
          maxLength={60}
          placeholder="andi-sinta"
          onChange={(e) =>
            onChange({
              slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
            })
          }
        />
      </Field>

      <Field label="Template" htmlFor="wizard-template">
        <Select
          id="wizard-template"
          value={meta.templateType}
          onChange={(e) => onChange({ templateType: e.target.value })}
        >
          {TEMPLATE_REGISTRY.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} — {t.category}
            </option>
          ))}
        </Select>
      </Field>
    </div>
  );
}

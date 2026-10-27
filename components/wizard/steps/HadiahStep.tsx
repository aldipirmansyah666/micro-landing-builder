"use client";

import { Button, Field, Input, Select } from "@/design-system/primitives";
import type { GiftAccount, InvitationContent } from "@/lib/invitation";
import { MAX_ACCOUNTS } from "@/lib/validation/invitation";

/** Langkah 6: rekening wedding gift (dinamis), alamat kado fisik, link tambahan. */
export function HadiahStep({
  data,
  onChange,
}: {
  data: InvitationContent;
  onChange: (patch: Partial<InvitationContent>) => void;
}) {
  const accounts = data.accounts;

  function updateAccount(index: number, patch: Partial<GiftAccount>) {
    const next = accounts.map((a, i) => (i === index ? { ...a, ...patch } : a));
    onChange({ accounts: next });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Daftar Rekening */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Rekening / E-Wallet (maks {MAX_ACCOUNTS})
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={accounts.length >= MAX_ACCOUNTS}
            onClick={() =>
              onChange({
                accounts: [
                  ...accounts,
                  { bank: "", number: "", holder: "", kind: "bank" },
                ],
              })
            }
          >
            + Tambah Rekening
          </Button>
        </div>

        {accounts.map((acc, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800 sm:flex-row sm:items-end"
          >
            <Field label="Bank / E-Wallet" htmlFor={`bank-${index}`} className="flex-1">
              <Select
                id={`bank-${index}`}
                value={acc.kind === "ewallet" ? "ewallet" : "bank"}
                onChange={(e) =>
                  updateAccount(index, {
                    kind: e.target.value === "ewallet" ? "ewallet" : "bank",
                  })
                }
              >
                <option value="bank">Bank</option>
                <option value="ewallet">E-Wallet</option>
              </Select>
            </Field>
            <Field label="Nama Bank" htmlFor={`bankname-${index}`} className="flex-1">
              <Input
                id={`bankname-${index}`}
                value={acc.bank}
                maxLength={40}
                placeholder="BCA"
                onChange={(e) => updateAccount(index, { bank: e.target.value })}
              />
            </Field>
            <Field label="Nomor Rekening" htmlFor={`number-${index}`} className="flex-1">
              <Input
                id={`number-${index}`}
                value={acc.number}
                maxLength={30}
                inputMode="numeric"
                onChange={(e) =>
                  updateAccount(index, {
                    number: e.target.value.replace(/[^0-9]/g, ""),
                  })
                }
              />
            </Field>
            <Field label="Atas Nama" htmlFor={`holder-${index}`} className="flex-1">
              <Input
                id={`holder-${index}`}
                value={acc.holder}
                maxLength={80}
                onChange={(e) => updateAccount(index, { holder: e.target.value })}
              />
            </Field>
            <Button
              variant="danger"
              size="sm"
              onClick={() =>
                onChange({ accounts: accounts.filter((_, i) => i !== index) })
              }
            >
              Hapus
            </Button>
          </div>
        ))}
      </div>

      <Field
        label="Alamat Pengiriman Kado Fisik (opsional)"
        htmlFor="giftAddress"
      >
        <Input
          id="giftAddress"
          value={data.giftAddress}
          maxLength={400}
          onChange={(e) => onChange({ giftAddress: e.target.value })}
        />
      </Field>

      <Field label="Link Live Streaming (opsional)" htmlFor="liveStreamUrl">
        <Input
          id="liveStreamUrl"
          value={data.liveStreamUrl}
          maxLength={500}
          placeholder="https://youtube.com/..."
          onChange={(e) => onChange({ liveStreamUrl: e.target.value })}
        />
      </Field>
      <Field label="Link IG Filter (opsional)" htmlFor="igFilterUrl">
        <Input
          id="igFilterUrl"
          value={data.igFilterUrl}
          maxLength={500}
          placeholder="https://instagram.com/ar/..."
          onChange={(e) => onChange({ igFilterUrl: e.target.value })}
        />
      </Field>
      <Field
        label="Link Request Musik (YouTube, opsional)"
        htmlFor="musicRequestUrl"
      >
        <Input
          id="musicRequestUrl"
          value={data.musicRequestUrl}
          maxLength={500}
          placeholder="https://youtube.com/..."
          onChange={(e) => onChange({ musicRequestUrl: e.target.value })}
        />
      </Field>
    </div>
  );
}

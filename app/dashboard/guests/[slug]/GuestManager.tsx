"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Link2, Plus, Trash2, Loader2 } from "lucide-react";
import type { Guest } from "@/lib/db";
import { addGuestAction, deleteGuestAction } from "./actions";

const inputClass =
  "h-10 rounded-xl border border-zinc-200 bg-white px-3.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-400";

export function GuestManager({
  slug,
  initial,
}: {
  slug: string;
  initial: Guest[];
}) {
  const [guests, setGuests] = useState<Guest[]>(initial);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  function personalLink(guestName: string): string {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/p/${slug}?to=${encodeURIComponent(guestName)}`;
  }

  async function copyLink(g: Guest) {
    try {
      await navigator.clipboard.writeText(personalLink(g.name));
    } catch {
      return;
    }
    setCopiedId(g.id);
    setTimeout(() => setCopiedId((v) => (v === g.id ? null : v)), 2000);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await addGuestAction(slug, name, phone);
      const res = await fetch(
        `/api/guests/list?slug=${encodeURIComponent(slug)}`
      );
      if (res.ok) {
        const data = (await res.json()) as { guests?: Guest[] };
        if (data.guests) setGuests(data.guests);
      }
      setName("");
      setPhone("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah tamu");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(g: Guest) {
    if (!window.confirm(`Hapus tamu "${g.name}"?`)) return;
    setDeletingId(g.id);
    startTransition(async () => {
      try {
        await deleteGuestAction(slug, g.id);
        setGuests((list) => list.filter((x) => x.id !== g.id));
      } catch (err) {
        window.alert(err instanceof Error ? err.message : "Gagal menghapus");
      } finally {
        setDeletingId(null);
      }
    });
  }

  return (
    <div>
      <form
        onSubmit={(e) => void handleAdd(e)}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama tamu"
          maxLength={100}
          className={`${inputClass} flex-1`}
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="No. HP (opsional)"
          maxLength={30}
          className={`${inputClass} sm:w-44`}
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Tambah
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-4 space-y-2">
        {guests.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
            Belum ada tamu. Tambahkan nama untuk membuat link personal
            otomatis.
          </p>
        ) : (
          guests.map((g) => (
            <div
              key={g.id}
              className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{g.name}</p>
                <p className="truncate font-mono text-xs text-zinc-500">
                  /p/{slug}?to={encodeURIComponent(g.name)}
                  {g.phone ? ` · ${g.phone}` : ""}
                </p>
              </div>
              <span
                className={`hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline ${
                  g.opened_at
                    ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {g.opened_at ? "Dibuka" : "Belum dibuka"}
              </span>
              <button
                type="button"
                onClick={() => void copyLink(g)}
                title="Salin link personal"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                {copiedId === g.id ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Link2 className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(g)}
                disabled={deletingId === g.id}
                title="Hapus tamu"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-200 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
      {guests.length > 0 && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-zinc-500">
          <Copy className="h-3.5 w-3.5" />
          Salin ikon rantai untuk membagikan link personal per tamu via WhatsApp.
        </p>
      )}
    </div>
  );
}

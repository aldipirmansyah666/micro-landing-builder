"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, Copy, FileUp, Link2, Loader2, MessageCircle, Plus, Trash2 } from "lucide-react";
import type { Guest } from "@/lib/db";
import { addGuestAction, deleteGuestAction } from "./actions";

const inputClass =
  "h-10 rounded-xl border border-zinc-200 bg-white px-3.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-400";

const DEFAULT_MESSAGE_TEMPLATE = `Halo {nama_tamu}!

Assalamu'alaikum Wr. Wb.
Dengan penuh syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami:

Buka undangan digitalnya di sini:
{link_undangan}

Merupakan suatu kehormatan apabila berkenan hadir. Terima kasih!`;

/** Isi placeholder {nama_tamu} & {link_undangan} pada template pesan. */
export function renderGuestMessage(
  template: string,
  guestName: string,
  link: string
): string {
  return template
    .split("{nama_tamu}")
    .join(guestName)
    .split("{link_undangan}")
    .join(link);
}

/** Normalisasi nomor HP Indonesia ke format wa.me (628xx…). Null bila kosong. */
export function normalizeWaNumber(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
}

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
  const [copiedMsgId, setCopiedMsgId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  // Template pesan custom — disimpan per-undangan di localStorage agar
  // tetap ada saat kembali ke halaman ini.
  const tplKey = `wa-tpl-${slug}`;
  const [messageTpl, setMessageTpl] = useState<string>(() => {
    try {
      if (typeof window !== "undefined") {
        return window.localStorage.getItem(tplKey) ?? DEFAULT_MESSAGE_TEMPLATE;
      }
    } catch {
      /* abaikan */
    }
    return DEFAULT_MESSAGE_TEMPLATE;
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(tplKey, messageTpl);
    } catch {
      /* abaikan */
    }
  }, [tplKey, messageTpl]);

  // Import cepat massal
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkBusy, setBulkBusy] = useState(false);

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

  async function refreshGuests() {
    const res = await fetch(
      `/api/guests/list?slug=${encodeURIComponent(slug)}`
    );
    if (res.ok) {
      const data = (await res.json()) as { guests?: Guest[] };
      if (data.guests) setGuests(data.guests);
    }
  }

  /** Salin pesan personal lengkap (template + link ?to=NamaTamu). */
  async function copyMessage(g: Guest) {
    try {
      await navigator.clipboard.writeText(
        renderGuestMessage(messageTpl, g.name, personalLink(g.name))
      );
    } catch {
      return;
    }
    setCopiedMsgId(g.id);
    setTimeout(() => setCopiedMsgId((v) => (v === g.id ? null : v)), 2000);
  }

  /** Buka chat WhatsApp ke nomor tamu dengan pesan personal terisi. */
  function sendWhatsApp(g: Guest) {
    const wa = normalizeWaNumber(g.phone);
    if (!wa) {
      window.alert(`Tamu "${g.name}" belum punya nomor HP.`);
      return;
    }
    const text = renderGuestMessage(messageTpl, g.name, personalLink(g.name));
    window.open(
      `https://wa.me/${wa}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener"
    );
  }

  /** Import cepat: satu baris per tamu — "Nama" atau "Nama, 08xxxxxxxxxx". */
  async function handleBulkImport() {
    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 200);
    if (lines.length === 0) {
      setError("Tempel minimal 1 baris nama tamu.");
      return;
    }
    setBulkBusy(true);
    setError(null);
    let added = 0;
    try {
      for (const line of lines) {
        const [rawName, rawPhone] = line.split(/[,;|\t]/).map((s) => s.trim());
        if (!rawName) continue;
        await addGuestAction(slug, rawName.slice(0, 100), (rawPhone ?? "").slice(0, 30));
        added += 1;
      }
      await refreshGuests();
      setBulkText("");
      setBulkOpen(false);
      if (added < lines.length) {
        setError(`${added} dari ${lines.length} baris berhasil diimpor.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengimpor tamu");
    } finally {
      setBulkBusy(false);
    }
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

      <button
        type="button"
        onClick={() => setBulkOpen((v) => !v)}
        aria-expanded={bulkOpen}
        className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-200 px-4 text-xs font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
      >
        <FileUp className="h-3.5 w-3.5" />
        {bulkOpen ? "Tutup Import Cepat" : "Import Cepat (banyak sekaligus)"}
      </button>
      {bulkOpen && (
        <div className="mt-2 rounded-2xl border border-dashed border-zinc-300 p-3 dark:border-zinc-700">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={4}
            placeholder={"Budi Santoso\nSinta, 081234567890\nAgus | 081987654321"}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 font-mono text-xs outline-none placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-400"
          />
          <p className="mt-1 text-[11px] text-zinc-500">
            Satu baris per tamu: <span className="font-mono">Nama</span> atau{" "}
            <span className="font-mono">Nama, NoHP</span> (dipisah koma/titik-koma/garis).
          </p>
          <button
            type="button"
            onClick={() => void handleBulkImport()}
            disabled={bulkBusy}
            className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-full bg-zinc-900 px-4 text-xs font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {bulkBusy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FileUp className="h-3.5 w-3.5" />
            )}
            Import Sekarang
          </button>
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-semibold">Template Pesan Undangan</p>
        <p className="mt-0.5 text-[11px] text-zinc-500">
          Gunakan <span className="font-mono">{"{nama_tamu}"}</span> dan{" "}
          <span className="font-mono">{"{link_undangan}"}</span> — otomatis
          terisi per tamu.
        </p>
        <textarea
          value={messageTpl}
          onChange={(e) => setMessageTpl(e.target.value)}
          rows={5}
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 font-mono text-xs outline-none placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-400"
        />
        <button
          type="button"
          onClick={() => setMessageTpl(DEFAULT_MESSAGE_TEMPLATE)}
          className="mt-2 text-[11px] font-medium text-zinc-600 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Kembalikan ke template bawaan
        </button>
      </div>

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
                onClick={() => void copyMessage(g)}
                title="Salin pesan undangan personal"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                {copiedMsgId === g.id ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => sendWhatsApp(g)}
                title={
                  normalizeWaNumber(g.phone)
                    ? `Kirim WhatsApp ke ${g.phone}`
                    : "Isi nomor HP dulu untuk kirim WhatsApp"
                }
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 text-green-700 transition-colors hover:bg-[#25D366]/25 dark:text-green-400"
              >
                <MessageCircle className="h-3.5 w-3.5" />
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
          Ikon rantai = salin link · ikon dokumen = salin pesan personal ·
          ikon chat hijau = kirim WhatsApp langsung ke nomor tamu.
        </p>
      )}
    </div>
  );
}

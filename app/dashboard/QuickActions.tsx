"use client";

import { useState } from "react";
import { Check, Copy, Download, Loader2 } from "lucide-react";
import type { Guest } from "@/lib/db";

function pageUrl(slug: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/p/${slug}`;
}

/** Teks siap sebar ke WhatsApp untuk satu undangan. */
export function waShareText(slug: string, title: string, to?: string): string {
  const greeting = to?.trim() ? `Yth. Bapak/Ibu/Saudara/i\n*${to.trim()}*\n\n` : "";
  return (
    `${greeting}Assalamu'alaikum Wr. Wb.\n\n` +
    `Dengan penuh syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara kami:\n\n` +
    `*${title}*\n${pageUrl(slug)}\n\n` +
    `Merupakan suatu kehormatan bagi kami apabila berkenan hadir. Terima kasih.\n\n` +
    `— via NikahYuk 💍`
  );
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

/** Tombol "Salin Link WA": salin generator teks sebar undangan. */
export function CopyWaLinkButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyText(waShareText(slug, title));
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#25D366]/15 px-4 text-xs font-medium text-green-700 transition-colors hover:bg-[#25D366]/25 dark:text-green-400"
      title="Salin teks sebar undangan untuk WhatsApp"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" /> Disalin!
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" /> Salin Link WA
        </>
      )}
    </button>
  );
}

function csvCell(value: string | number | null | undefined): string {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

/** Tombol ekspor rekap kehadiran tamu ke CSV (terbuka di Excel). */
export function ExportGuestsButton({ slug }: { slug: string }) {
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/guests/list?slug=${encodeURIComponent(slug)}&limit=500`
      );
      const data = (await res.json()) as { guests?: Guest[]; error?: string };
      if (!res.ok || !data.guests) {
        throw new Error(data.error ?? "Gagal memuat data tamu");
      }
      const header = ["Nama", "No. HP", "Status", "Dibuka Pada", "Ditambahkan"];
      const lines = data.guests.map((g) =>
        [
          csvCell(g.name),
          csvCell(g.phone),
          csvCell(g.opened_at ? "Sudah Membuka" : "Belum Membuka"),
          csvCell(
            g.opened_at
              ? new Date(g.opened_at).toLocaleString("id-ID")
              : "-"
          ),
          csvCell(new Date(g.created_at).toLocaleString("id-ID")),
        ].join(",")
      );
      const csv = "﻿" + [header.map(csvCell).join(","), ...lines].join("\r\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rekap-kehadiran-${slug}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Gagal mengekspor CSV");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleExport()}
      disabled={busy}
      title="Ekspor rekap kehadiran ke CSV/Excel"
      aria-label="Ekspor rekap kehadiran ke CSV"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      {busy ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import type { Wish } from "@/lib/db";

const ATTENDANCE = ["Hadir", "Tidak Hadir", "Masih Ragu"] as const;

const badgeClass: Record<string, string> = {
  Hadir: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "Tidak Hadir": "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  "Masih Ragu": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
};

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-400";

export function RsvpSection({
  slug,
  initial,
}: {
  slug: string;
  initial: Wish[];
}) {
  const [wishes, setWishes] = useState<Wish[]>(initial);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<string>("Hadir");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name: name.trim(), message: message.trim(), attendance }),
      });
      const data = (await res.json()) as { ok?: boolean; wish?: Wish; error?: string };
      if (!res.ok || !data.wish) throw new Error(data.error ?? "Gagal mengirim ucapan");
      setWishes((w) => [data.wish as Wish, ...w]);
      setName("");
      setMessage("");
      setAttendance("Hadir");
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim ucapan");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama kamu"
          maxLength={100}
          className={inputClass}
        />
        <select
          value={attendance}
          onChange={(e) => setAttendance(e.target.value)}
          className={inputClass}
          aria-label="Konfirmasi kehadiran"
        >
          {ATTENDANCE.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis ucapan & doa..."
          rows={3}
          maxLength={500}
          className={`${inputClass} resize-none`}
        />
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        {sent && (
          <p className="inline-flex items-center gap-1.5 text-xs text-green-700 dark:text-green-300">
            <CheckCircle2 className="h-3.5 w-3.5" /> Terima kasih atas ucapannya!
          </p>
        )}
        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Kirim Ucapan
        </button>
      </form>

      <div className="mt-5 space-y-3">
        {wishes.length === 0 ? (
          <p className="text-center text-xs opacity-60">
            Belum ada ucapan. Jadilah yang pertama!
          </p>
        ) : (
          wishes.map((w) => (
            <div
              key={w.id}
              className="rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium">{w.name}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${badgeClass[w.attendance] ?? badgeClass.Hadir}`}
                >
                  {w.attendance}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 opacity-80">{w.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

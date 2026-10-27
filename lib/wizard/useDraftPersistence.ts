"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WizardState } from "./wizardMachine";

const DEBOUNCE_MS = 800;
const KEY_PREFIX = "nikahyuk:wizard-draft:";

/**
 * Kunci draft di localStorage per-slug (atau per "new" bila slug belum
 * diisi) agar beberapa undangan berbeda tidak saling menimpa draft.
 */
function draftKey(slug: string): string {
  return `${KEY_PREFIX}${slug.trim() === "" ? "new" : slug.trim()}`;
}

export interface DraftPersistence {
  /** True setelah draft berhasil dimuat dari localStorage (atau dipastikan kosong). */
  hydrated: boolean;
  /** Waktu terakhir draft tersimpan (epoch ms), untuk indikator "Tersimpan lokal". */
  lastSavedAt: number | null;
  /** Hapus draft lokal (dipanggil setelah sukses simpan ke server). */
  clearDraft: () => void;
}

/**
 * Autosave draft wizard ke `localStorage` dengan debounce.
 *
 * Sengaja tidak memakai IndexedDB: ukuran draft (satu objek
 * `InvitationContent` + meta) jauh di bawah kuota localStorage (~5MB),
 * dan sinkron API-nya jauh lebih sederhana tanpa risiko race condition
 * antar tab yang rumit.
 *
 * `enabled` bisa dimatikan sementara (mis. saat modal konfirmasi
 * "Buang perubahan?" terbuka) supaya tidak ada tulisan draft yang
 * terjadi di tengah transisi UI.
 */
export function useDraftPersistence(
  slug: string,
  state: WizardState,
  onHydrate: (state: WizardState) => void,
  { enabled = true }: { enabled?: boolean } = {}
): DraftPersistence {
  const [hydrated, setHydrated] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const skipNextSaveRef = useRef(true);

  // Sinkronkan callback terbaru ke ref lewat efek (bukan saat render —
  // larangan react-hooks/refs: menulis ref saat render membuat komponen
  // tidak update sebagaimana mestinya).
  const onHydrateRef = useRef(onHydrate);
  useEffect(() => {
    onHydrateRef.current = onHydrate;
  }, [onHydrate]);

  // Muat draft tersimpan satu kali saat mount (efek bergantung pada
  // "slug awal" saja agar tidak terjadi hydrate ulang tiap ketikan).
  const initialKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (initialKeyRef.current !== null) return;
    initialKeyRef.current = draftKey(slug);
    try {
      const raw = localStorage.getItem(initialKeyRef.current);
      if (raw) {
        const parsed = JSON.parse(raw) as WizardState;
        if (
          parsed &&
          typeof parsed === "object" &&
          parsed.data &&
          parsed.meta
        ) {
          onHydrateRef.current(parsed);
        }
      }
    } catch {
      // Draft rusak / private mode — abaikan, mulai dari state awal.
    } finally {
      setHydrated(true);
    }
  }, [slug]);

  // Simpan (debounce) setiap kali data/meta berubah — lewati render
  // pertama agar state awal tidak langsung menimpa draft lama sebelum
  // sempat dibaca.
  useEffect(() => {
    if (!enabled || !hydrated) return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(draftKey(slug), JSON.stringify(state));
        setLastSavedAt(Date.now());
      } catch {
        // kuota penuh / private mode — biarkan, tidak fatal.
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [state, slug, enabled, hydrated]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(draftKey(slug));
    } catch {
      // abaikan
    }
    setLastSavedAt(null);
  }, [slug]);

  return { hydrated, lastSavedAt, clearDraft };
}

/**
 * Pustaka preset lagu backsound khusus PRO.
 *
 * Data URL di bawah ini adalah PLACEHOLDER dari CDN publik yang stabil
 * (SoundHelix sample MP3 — terverifikasi HTTP 200, cocok untuk tes
 * preview di browser). WAJIB diganti dengan trek berlisensi milik
 * sendiri / hasil komposisi sebelum rilis production, karena:
 * - kualitas/genre tiap URL tidak mencerminkan label kategorinya, dan
 * - ukuran file besar (7–10MB) — idealnya dikompresi ≤3MB.
 *
 * Kontrak yang dijaga:
 * - setiap preset WAJIB berupa URL http(s) agar lolos
 *   `validateContentUrls()` di save-route (path relatif ditolak).
 * - `backsoundUrl` di InvitationContent menyimpan URL final (preset
 *   atau hasil upload custom) — tidak ada field baru di DB.
 */
export interface BacksoundPreset {
  /** Id stabil untuk state preview & pilihan di builder. */
  id: string;
  /** Judul tampil di audio picker. */
  title: string;
  /** Nama artis/komposer (placeholder). */
  artist: string;
  /** Kategori tampil sebagai badge (mis. "Romantic Piano"). */
  category: string;
  /** URL MP3 langsung (streamable). */
  url: string;
}

const SOUNDHELIX = "https://www.soundhelix.com/examples/mp3";

export const BACKSOUND_PRESETS: BacksoundPreset[] = [
  {
    id: "romantic-piano",
    title: "Janji di Ujung Senja",
    artist: "Placeholder Studio",
    category: "Romantic Piano",
    url: `${SOUNDHELIX}/SoundHelix-Song-1.mp3`,
  },
  {
    id: "acoustic-love",
    title: "Akad dalam Pelukan Akustik",
    artist: "Placeholder Studio",
    category: "Acoustic Love",
    url: `${SOUNDHELIX}/SoundHelix-Song-2.mp3`,
  },
  {
    id: "sunda-kecapi",
    title: "Kecapi Asmara Sunda",
    artist: "Placeholder Studio",
    category: "Sunda Kecapi",
    url: `${SOUNDHELIX}/SoundHelix-Song-3.mp3`,
  },
  {
    id: "islami-instrumental",
    title: "Mahar Cahaya Iman",
    artist: "Placeholder Studio",
    category: "Islami Instrumental",
    url: `${SOUNDHELIX}/SoundHelix-Song-4.mp3`,
  },
  {
    id: "cinematic-strings",
    title: "Simfoni Dua Hati",
    artist: "Placeholder Studio",
    category: "Cinematic Strings",
    url: `${SOUNDHELIX}/SoundHelix-Song-5.mp3`,
  },
];

/** Cari preset berdasarkan URL final yang tersimpan di content. */
export function findBacksoundPreset(url: string): BacksoundPreset | undefined {
  const normalized = url.trim();
  if (normalized === "") return undefined;
  return BACKSOUND_PRESETS.find((p) => p.url === normalized);
}

/** True bila URL adalah salah satu preset bawaan (bukan upload custom). */
export function isPresetBacksoundUrl(url: string): boolean {
  return findBacksoundPreset(url) !== undefined;
}

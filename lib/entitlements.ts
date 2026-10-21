import {
  resolveTemplate,
  type InvitationContent,
  type TemplateId,
} from "./invitation";

export type Plan = "free" | "pro";

/** Satu-satunya template gratis (dasar): Aruna, default paling aman. */
export const FREE_TEMPLATE_ID: TemplateId = "aruna";
export const FREE_MAX_GALLERY = 5;
export const PRO_MAX_GALLERY = 12;

export function planOf(isPro: boolean): Plan {
  return isPro ? "pro" : "free";
}

/**
 * Daftar surel yang boleh memakai akses Pro tanpa pembayaran.
 *
 * Format: `PRO_BYPASS_EMAILS=dev@contoh.com,qa@contoh.com`
 * (pisah koma, case-insensitive, spasi diabaikan). Variabel kosong =
 * tidak ada yang boleh bypass.
 *
 * Berlaku di SEMUA environment (production termasuk) karena tujuannya
 * adalah allowlist EKSPLISIT yang bisa diaudit — bukan pintasan
 * otomatis. Konsekuensinya:
 * - JANGAN pernah memasukkan surel pelanggan nyata.
 * - Kosongkan variabel ini di production kecuali memang ada akun
 *   QA/internal yang perlu akses Pro tanpa pembayaran.
 * - Setiap pemakaian dicatat ke log (lihat bawah) supaya mudah diaudit.
 *
 * PENTING: jangan pernah menggantinya dengan pemeriksaan NODE_ENV.
 * `NODE_ENV=development` yang salah set di production akan memberi
 * akses Pro ke SEMUA pengguna (kill-switch paywall global).
 */
export function isBypassAllowed(email?: string | null): boolean {
  const raw = process.env.PRO_BYPASS_EMAILS;
  if (!raw) return false;
  const allow = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e !== "");
  if (allow.length === 0) return false;
  const normalized = email?.trim().toLowerCase();
  if (!normalized || !allow.includes(normalized)) return false;
  console.info(
    `[entitlements] bypass Pro dipakai oleh ${normalized} (PRO_BYPASS_EMAILS)`
  );
  return true;
}

/**
 * Satu-satunya penentu akses Pro di aplikasi (bypass terpusat):
 * - halaman sudah Pro, ATAU
 * - user adalah admin, ATAU
 * - surel user terdaftar di `PRO_BYPASS_EMAILS` (lihat isBypassAllowed).
 *
 * Pakai helper ini di setiap gate fitur Pro (builder plan, validasi save,
 * tombol upgrade, checkout) agar admin/bypass selalu dapat akses penuh
 * tanpa paywall. Render publik (/p/[slug]) TIDAK memakai ini karena tidak
 * ada konteks user — ia tetap mengikuti status Pro halaman itu sendiri.
 *
 * `email` wajib diisi untuk bisa menggunakan bypass allowlist; pemanggil
 * yang tidak punya konteks surel (mis. halaman publik) tidak akan pernah
 * mendapat bypass.
 */
export function hasProAccess(input: {
  isPro: boolean;
  isAdmin?: boolean;
  email?: string | null;
}): boolean {
  if (input.isPro) return true;
  if (input.isAdmin === true) return true;
  return isBypassAllowed(input.email);
}

export function maxGallery(plan: Plan): number {
  return plan === "pro" ? PRO_MAX_GALLERY : FREE_MAX_GALLERY;
}

/** Template efektif untuk render: Free selalu pakai template dasar. */
export function effectiveTemplate(
  templateType: string,
  isPro: boolean
): TemplateId {
  if (!isPro) return FREE_TEMPLATE_ID;
  return resolveTemplate(templateType);
}

/**
 * Validasi batasan paket saat menyimpan. Kembalikan pesan error
 * bila melanggar, null bila lolos.
 */
export function checkSaveEntitlements(input: {
  isPro: boolean;
  templateType: string;
  galleryCount: number;
  hasBacksound: boolean;
  hasCustomContent: boolean;
}): string | null {
  if (input.isPro) {
    if (input.galleryCount > PRO_MAX_GALLERY) {
      return `Galeri maksimal ${PRO_MAX_GALLERY} foto`;
    }
    return null;
  }
  if (resolveTemplate(input.templateType) !== FREE_TEMPLATE_ID) {
    return "Template ini khusus PRO. Upgrade untuk menggunakannya.";
  }
  if (input.galleryCount > FREE_MAX_GALLERY) {
    return `Paket Free maksimal ${FREE_MAX_GALLERY} foto galeri. Upgrade ke PRO untuk ${PRO_MAX_GALLERY} foto.`;
  }
  if (input.hasBacksound) {
    return "Backsound musik khusus PRO. Upgrade untuk mengaktifkannya.";
  }
  if (input.hasCustomContent) {
    return "Sapaan kustom & Timeline Cerita khusus PRO. Upgrade untuk menggunakannya.";
  }
  return null;
}

/**
 * Terapkan batasan paket saat render publik (defense in depth):
 * halaman Free selalu tanpa backsound, galeri dibatasi, tanpa sisa
 * konten PRO walau data di DB memilikinya — termasuk sapaan kustom,
 * pesan penutup, dan timeline cerita.
 *
 * CATATAN KEAMANAN: `content` di sini DIHARUSKAN sudah melewati
 * `toInvitationContent()` (lib/invitation.ts) — satu-satunya pintu
 * masuk data konten ke lapisan render. Fungsi itu sudah menyanitasi
 * seluruh properti URL via `safeHttpUrl()`, sehingga nilai returned
 * di sini bebas `javascript:`/`data:`. Jangan pernah memanggil
 * applyRenderEntitlements dengan objek konten mentah dari database.
 */
export function applyRenderEntitlements(
  content: InvitationContent,
  isPro: boolean
): InvitationContent {
  if (isPro) return content;
  return {
    ...content,
    backsoundUrl: "",
    galleryImages: content.galleryImages.slice(0, FREE_MAX_GALLERY),
    greeting: undefined,
    closingNote: undefined,
    stories: undefined,
  };
}

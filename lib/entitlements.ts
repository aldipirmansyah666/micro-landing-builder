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
 * True saat berjalan di development/lokal (`next dev`). Di production
 * (termasuk Cloudflare Worker hasil build) selalu false — akses Pro di
 * sana hanya lewat status Pro halaman atau role admin.
 */
export function isDevEnvironment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Satu-satunya penentu akses Pro di aplikasi (bypass terpusat):
 * - halaman sudah Pro, ATAU
 * - user adalah admin, ATAU
 * - berjalan di development/lokal.
 *
 * Pakai helper ini di setiap gate fitur Pro (builder plan, validasi save,
 * tombol upgrade, checkout) agar admin/dev selalu dapat akses penuh tanpa
 * paywall. Render publik (/p/[slug]) TIDAK memakai ini karena tidak ada
 * konteks user — ia tetap mengikuti status Pro halaman itu sendiri.
 */
export function hasProAccess(input: {
  isPro: boolean;
  isAdmin?: boolean;
}): boolean {
  if (input.isPro) return true;
  if (input.isAdmin === true) return true;
  return isDevEnvironment();
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
  return null;
}

/**
 * Terapkan batasan paket saat render publik (defense in depth):
 * halaman Free selalu tanpa backsound, galeri dibatasi, tanpa sisa
 * konten PRO walau data di DB memilikinya.
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
  };
}

import {
  resolveTemplate,
  type InvitationContent,
  type TemplateId,
} from "./invitation";

export type Plan = "free" | "pro";

/** Satu-satunya template gratis (dasar). */
export const FREE_TEMPLATE_ID: TemplateId = "minimalist";
export const FREE_MAX_GALLERY = 5;
export const PRO_MAX_GALLERY = 12;

export function planOf(isPro: boolean): Plan {
  return isPro ? "pro" : "free";
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

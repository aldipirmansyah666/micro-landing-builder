import type { InvitationContent } from "@/lib/invitation";

export interface TemplateProps {
  title: string;
  content: InvitationContent;
  guestName?: string;
  rsvpSlot?: React.ReactNode;
  /**
   * Bila true, cover langsung terbuka (isi undangan terlihat).
   * Dipakai preview builder agar foto cover langsung kelihatan
   * tanpa harus klik "Buka Undangan". Halaman publik (/p/[slug])
   * tidak mengisinya sehingga cover tetap tertutup. Default false.
   */
  defaultOpened?: boolean;
}

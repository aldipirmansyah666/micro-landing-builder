import type { InvitationContent } from "@/lib/invitation";

export interface TemplateProps {
  title: string;
  content: InvitationContent;
  guestName?: string;
  rsvpSlot?: React.ReactNode;
}

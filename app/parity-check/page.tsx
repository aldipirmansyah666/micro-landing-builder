import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { InvitationTemplate } from "@/components/templates/InvitationTemplate";
import { TEMPLATE_REGISTRY } from "@/lib/templates";
import type { InvitationContent } from "@/lib/invitation";

/**
 * Halaman fixture untuk pembuktian paritas visual antar template.
 *
 * Fungsi: merender satu template dengan data contoh yang LENGKAP dan
 * deterministik, lalu membandingkan HTML hasilnya dengan snapshot yang
 * tersimpan (`scripts/parity-snapshots/`). Dipakai
 * `scripts/check-template-parity.mjs`.
 *
 * DEMO-DATA, bukan data pengguna.
 *
 * Halaman ini HANYA merespons bila request membawa header
 * `x-parity-check: 1` — jadi tidak bisa diakses dari browser biasa
 * maupun terindeks mesin pencari, di environment mana pun.
 */
const FIXTURE: InvitationContent = {
  quote: "Terima kasih atas doa dan-harapan kalian.",
  coupleOrder: "groomFirst",
  groomFullName: "Andi Pratama",
  groomNickname: "Andi",
  groomFatherName: "Harto",
  groomMotherName: "Wulan",
  groomChildOrder: "1",
  groomInstagram: "andipratama",
  groomPhoto: "https://example.com/groom.jpg",
  brideFullName: "Sinta Dewi",
  brideNickname: "Sinta",
  brideFatherName: "Joko",
  brideMotherName: "Ratna",
  brideChildOrder: "2",
  brideInstagram: "sintadewi",
  bridePhoto: "https://example.com/bride.jpg",
  akadDate: "2026-02-14",
  akadTime: "09:00",
  akadTimezone: "WIB",
  akadVenue: "Gedung Serbaguna Jakarta",
  akadMapsUrl: "https://maps.google.com/?q=gedung",
  akadDresscode: "Formal",
  receptionDate: "2026-02-14",
  receptionTime: "11:00",
  receptionTimezone: "WIB",
  receptionVenue: "Gedung Serbaguna Jakarta",
  receptionMapsUrl: "https://maps.google.com/?q=gedung",
  receptionDresscode: "Batik",
  heroImage: "https://example.com/cover.jpg",
  galleryImages: [
    "https://example.com/g1.jpg",
    "https://example.com/g2.jpg",
  ],
  galleryVideos: ["https://example.com/video.mp4"],
  backsoundUrl: "https://example.com/audio.mp3",
  accounts: [
    { bank: "BCA", number: "1234567890", holder: "Andi Pratama", kind: "bank" },
    { bank: "BRI", number: "9876543210", holder: "Sinta Dewi", kind: "bank" },
    { bank: "GoPay", number: "081234567890", holder: "Sinta Dewi", kind: "ewallet" },
  ],
  giftAddress: "Jl. Contoh No. 1, Jakarta",
  liveStreamUrl: "https://youtube.com/live/example",
  igFilterUrl: "https://instagram.com/ar/123",
  musicRequestUrl: "https://open.spotify.com/track/example",
  greeting: "Assalamu'alaikum Wr. Wb.",
  closingNote: "Sampai jumpa di hariPertemuan.",
  stories: [
    { title: "Awal Bertemu", text: "Bertemu di kampus." },
    { title: "Lamaran", text: "Lamaran resmi." },
  ],
};

export const instant = false;

export default async function ParityCheckPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const hdrs = await headers();
  if (hdrs.get("x-parity-check") !== "1") notFound();

  const { template } = await searchParams;
  const id = template ?? "aruna";
  if (!TEMPLATE_REGISTRY.some((t) => t.id === id)) notFound();

  return (
    <InvitationTemplate
      templateType={id}
      title="Pernikahan Andi & Sinta"
      content={FIXTURE}
      guestName="Budi Santoso"
      defaultOpened={true}
      rsvpSlot={
        <div className="rounded-2xl border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-500">
          Form RSVP
        </div>
      }
    />
  );
}

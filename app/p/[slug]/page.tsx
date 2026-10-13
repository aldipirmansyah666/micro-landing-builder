import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLandingPageBySlug, getWishesBySlug } from "@/lib/db";
import { coupleNames, toInvitationContent } from "@/lib/invitation";
import {
  applyRenderEntitlements,
  effectiveTemplate,
} from "@/lib/entitlements";
import { InvitationTemplate } from "@/components/templates/InvitationTemplate";
import { GuestOpenedBeacon } from "@/components/invitation/GuestOpenedBeacon";
import { RsvpSection } from "@/components/invitation/RsvpSection";

// Halaman publik dinamis per slug: render per-request (blocking),
// karena datanya diambil dari Neon saat runtime.
export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);
  if (!page) return { title: "Halaman tidak ditemukan" };
  const content = toInvitationContent(page.content_json);
  const description =
    content.quote.slice(0, 160) || `${coupleNames(content)} — Undangan Digital`;
  return {
    title: `${page.title} — Undangan Digital`,
    description,
    openGraph: {
      title: page.title,
      description,
      images: content.heroImage ? [{ url: content.heroImage }] : undefined,
    },
  };
}

export default async function PublicLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
}) {
  const { slug } = await params;
  const { to } = await searchParams;

  const [page, wishes] = await Promise.all([
    getLandingPageBySlug(slug),
    getWishesBySlug(slug),
  ]);
  if (!page) notFound();

  const content = applyRenderEntitlements(
    toInvitationContent(page.content_json),
    page.is_pro
  );
  const guestName = typeof to === "string" && to.trim() !== "" ? to : undefined;

  return (
    <div className="flex min-h-screen flex-col font-sans antialiased">
      <main className="mx-auto w-full max-w-xl flex-1">
        {guestName && <GuestOpenedBeacon slug={slug} name={guestName} />}
        <InvitationTemplate
          title={page.title}
          templateType={effectiveTemplate(page.template_type, page.is_pro)}
          content={content}
          guestName={guestName}
          rsvpSlot={<RsvpSection slug={slug} initial={wishes} />}
        />
        {!page.is_pro && (
          <footer className="bg-white py-6 text-center text-xs text-zinc-500 dark:bg-black dark:text-zinc-500">
            Dibuat dengan{" "}
            <Link href="/" className="font-medium underline underline-offset-2">
              Micro Landing Builder
            </Link>{" "}
            · Buat halamanmu gratis
          </footer>
        )}
      </main>
    </div>
  );
}

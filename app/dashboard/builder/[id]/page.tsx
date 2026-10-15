import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getLandingPageByUserAndSlug, getUserRole } from "@/lib/db";
import { hasProAccess } from "@/lib/entitlements";
import { TEMPLATE_REGISTRY } from "@/lib/templates";
import { BuilderClient } from "./BuilderClient";

// Builder privat (auth + query Neon per-request): boleh blocking,
// opt-out dari validasi instant navigation (Next.js 16 + cacheComponents).
export const instant = false;

export default async function BuilderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ template?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const isNew = id === "new";

  // Admin & development/lokal selalu mendapat akses Pro penuh (bypass paywall).
  const role = await getUserRole(userId);
  const isAdmin = role === "admin";

  if (isNew) {
    const pro = hasProAccess({ isPro: false, isAdmin });
    // Deep-link dari landing page: ?template=blossom langsung ter-select
    // di builder (hanya id katalog valid yang diterima).
    const { template } = await searchParams;
    const initialTemplate = TEMPLATE_REGISTRY.some((t) => t.id === template)
      ? template
      : undefined;
    return (
      <BuilderClient
        mode="new"
        initial={null}
        plan={pro ? "pro" : "free"}
        initialTemplate={initialTemplate}
      />
    );
  }

  // `id` diperlakukan sebagai slug milik user yang sedang login.
  const page = await getLandingPageByUserAndSlug(userId, id);
  if (!page) notFound();

  return (
    <BuilderClient
      mode="edit"
      initial={page}
      plan={hasProAccess({ isPro: page.is_pro, isAdmin }) ? "pro" : "free"}
    />
  );
}

import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getLandingPageByUserAndSlug, getUserRole } from "@/lib/db";
import { hasProAccess } from "@/lib/entitlements";
import { BuilderClient } from "./BuilderClient";

// Builder privat (auth + query Neon per-request): boleh blocking,
// opt-out dari validasi instant navigation (Next.js 16 + cacheComponents).
export const instant = false;

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
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
    return <BuilderClient mode="new" initial={null} plan={pro ? "pro" : "free"} />;
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

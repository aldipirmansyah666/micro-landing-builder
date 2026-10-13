import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getLandingPageByUserAndSlug } from "@/lib/db";
import { BuilderClient } from "./BuilderClient";

// Builder bersifat privat: render per-request (blocking), bukan prerender statis.
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

  if (isNew) {
    return <BuilderClient mode="new" initial={null} plan="free" />;
  }

  // `id` diperlakukan sebagai slug milik user yang sedang login.
  const page = await getLandingPageByUserAndSlug(userId, id);
  if (!page) notFound();

  return (
    <BuilderClient
      mode="edit"
      initial={page}
      plan={page.is_pro ? "pro" : "free"}
    />
  );
}

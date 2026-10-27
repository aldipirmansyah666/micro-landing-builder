import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/db";
import { hasProAccess } from "@/lib/entitlements";
import { WizardDemoClient } from "./WizardDemoClient";

// Route privat (auth per-request) — opt-out dari instant navigation
// (Next.js 16 + cacheComponents), konsisten dengan builder utama.
export const instant = false;

/**
 * Halaman contoh integrasi Multi-Step Wizard.
 *
 * Route statis `/dashboard/builder/wizard` didahulukan Next.js di atas
 * dinamis `/dashboard/builder/[id]`, jadi aman berdampingan — "/wizard"
 * tidak akan tertangkap oleh segmen `[id]`.
 *
 * Untuk menggantikan builder accordion lama sepenuhnya, cukup arahkan
 * link "Buat Undangan Baru" di dashboard ke route ini, atau pindahkan
 * `<InvitationWizard />` ke dalam `BuilderClient` sebagai mode tampilan
 * alternatif (state sudah terisolasi lewat `useInvitationWizard`).
 */
export default async function WizardDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? null;
  const role = await getUserRole(userId);
  // Guard entitlement konsisten dengan builder utama (opsional untuk
  // demo — tetap dipertahankan agar konsisten & audit-able).
  hasProAccess({ isPro: false, isAdmin: role === "admin", email });

  const { template } = await searchParams;
  return <WizardDemoClient initialTemplate={template} />;
}

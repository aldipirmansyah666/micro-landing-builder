import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getLandingPageSummariesByUserId, getUserRole } from "@/lib/db";
import { hasProAccess } from "@/lib/entitlements";

/**
 * Status PRO untuk user yang sedang login.
 *
 * Dipakai oleh modal checkout untuk polling singkat setelah pembayaran
 * Midtrans (webhook bisa tiba beberapa detik setelah Snap `onSuccess`),
 * dan oleh listener `pageshow`/`visibilitychange` di layout dashboard.
 *
 * Sumber kebenaran tetap database (`landing_pages.is_pro`) + bypass
 * admin/allowlist — BUKAN `publicMetadata` Clerk.
 */
// Catatan: Next 16 + cacheComponents melarang `export const dynamic`.
// Route ini tetap dinamis karena memanggil `auth()` + query database.
export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = new URL(req.url).searchParams.get("slug")?.trim() || null;

  const [user, role, pages] = await Promise.all([
    currentUser(),
    getUserRole(userId),
    getLandingPageSummariesByUserId(userId),
  ]);

  const email = user?.emailAddresses[0]?.emailAddress ?? null;
  const isAdmin = role === "admin";

  const pagesWithPro = pages.map((page) => ({
    slug: page.slug,
    is_pro: hasProAccess({ isPro: page.is_pro, isAdmin, email }),
  }));
  const proSlugs = pagesWithPro
    .filter((page) => page.is_pro)
    .map((page) => page.slug);

  return NextResponse.json(
    {
      ok: true,
      is_admin: isAdmin,
      account_pro: isAdmin || proSlugs.length > 0,
      slug,
      // Bila `?slug=` dikirim, fokuskan jawaban ke halaman tersebut.
      is_pro: slug ? proSlugs.includes(slug) : proSlugs.length > 0,
      pro_slugs: proSlugs,
      pages: pagesWithPro,
    },
    {
      headers: {
        // Status pembayaran tidak boleh di-cache oleh browser/CDN.
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

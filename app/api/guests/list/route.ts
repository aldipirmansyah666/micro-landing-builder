import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGuestsBySlug, getLandingPageByUserAndSlug } from "@/lib/db";

/** Daftar tamu milik owner (untuk refresh client setelah tambah/hapus). */
export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const slug = new URL(req.url).searchParams.get("slug")?.trim() ?? "";
  if (!slug) {
    return NextResponse.json({ error: "Parameter slug wajib diisi" }, { status: 400 });
  }
  const page = await getLandingPageByUserAndSlug(userId, slug);
  if (!page) {
    return NextResponse.json({ error: "Landing page tidak ditemukan" }, { status: 404 });
  }
  const guests = await getGuestsBySlug(slug);
  return NextResponse.json({ ok: true, guests });
}

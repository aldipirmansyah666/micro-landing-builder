import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getGuestsBySlug,
  getLandingPageBasicByUserAndSlug,
} from "@/lib/db";

/** Daftar tamu milik owner (untuk refresh client setelah tambah/hapus). */
export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug")?.trim() ?? "";
  if (!slug) {
    return NextResponse.json({ error: "Parameter slug wajib diisi" }, { status: 400 });
  }
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit") ?? 200), 1),
    500
  );
  const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
  try {
    const page = await getLandingPageBasicByUserAndSlug(userId, slug);
    if (!page) {
      return NextResponse.json({ error: "Landing page tidak ditemukan" }, { status: 404 });
    }
    const guests = await getGuestsBySlug(slug, limit, offset);
    return NextResponse.json({ ok: true, guests });
  } catch {
    return NextResponse.json({ error: "Gagal memuat tamu" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import {
  createWish,
  getLandingPageBasicBySlug,
  getWishesBySlug,
  isUniqueViolation,
} from "@/lib/db";

const ATTENDANCE = new Set(["Hadir", "Tidak Hadir", "Masih Ragu"]);

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug")?.trim() ?? "";
  if (!slug) {
    return NextResponse.json({ error: "Parameter slug wajib diisi" }, { status: 400 });
  }
  try {
    const wishes = await getWishesBySlug(slug);
    return NextResponse.json({ ok: true, wishes });
  } catch {
    return NextResponse.json({ error: "Gagal memuat ucapan" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Body harus JSON" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const attendance =
    typeof body.attendance === "string" && ATTENDANCE.has(body.attendance)
      ? body.attendance
      : "Hadir";

  if (!slug) {
    return NextResponse.json({ error: "Slug wajib diisi" }, { status: 400 });
  }
  if (!name || name.length > 100) {
    return NextResponse.json(
      { error: "Nama wajib diisi (maks 100 karakter)" },
      { status: 400 }
    );
  }
  if (!message || message.length > 500) {
    return NextResponse.json(
      { error: "Ucapan wajib diisi (maks 500 karakter)" },
      { status: 400 }
    );
  }

  // Pre-check: slug harus merujuk halaman yang ada (hindari FK 500).
  try {
    const page = await getLandingPageBasicBySlug(slug);
    if (!page) {
      return NextResponse.json(
        { error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Gagal memverifikasi undangan" },
      { status: 500 }
    );
  }

  try {
    const wish = await createWish({
      page_slug: slug,
      name,
      message,
      attendance,
    });
    return NextResponse.json({ ok: true, wish }, { status: 201 });
  } catch (error) {
    // Balapan hapus halaman antara pre-check dan insert → FK violation.
    if (isUniqueViolation(error) || isForeignKeyViolation(error)) {
      return NextResponse.json(
        { error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Gagal menyimpan ucapan" },
      { status: 500 }
    );
  }
}

function isForeignKeyViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "23503"
  );
}

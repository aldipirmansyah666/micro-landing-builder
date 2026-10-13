import { NextResponse } from "next/server";
import { createWish, getWishesBySlug } from "@/lib/db";

const ATTENDANCE = new Set(["Hadir", "Tidak Hadir", "Masih Ragu"]);

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug")?.trim() ?? "";
  if (!slug) {
    return NextResponse.json({ error: "Parameter slug wajib diisi" }, { status: 400 });
  }
  const wishes = await getWishesBySlug(slug);
  return NextResponse.json({ ok: true, wishes });
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

  const wish = await createWish({ page_slug: slug, name, message, attendance });
  return NextResponse.json({ ok: true, wish }, { status: 201 });
}

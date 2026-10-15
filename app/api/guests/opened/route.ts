import { NextResponse } from "next/server";
import { markGuestOpened } from "@/lib/db";

const SLUG_RE = /^[a-z0-9-]{1,60}$/;

/** Beacon publik: tandai undangan telah dibuka oleh nama tamu (?to=). */
export async function POST(req: Request) {
  let slug = "";
  let name = "";
  try {
    const body = (await req.json()) as { slug?: unknown; name?: unknown };
    if (typeof body.slug === "string") slug = body.slug.trim();
    if (typeof body.name === "string") name = body.name.trim().slice(0, 100);
  } catch {
    return NextResponse.json({ error: "Body harus JSON" }, { status: 400 });
  }
  if (!slug || !name) {
    return NextResponse.json({ error: "slug dan name wajib diisi" }, { status: 400 });
  }
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "slug tidak valid" }, { status: 400 });
  }
  try {
    await markGuestOpened(slug, name);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal mencatat status dibuka" },
      { status: 500 }
    );
  }
}

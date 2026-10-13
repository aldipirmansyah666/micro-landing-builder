import { NextResponse } from "next/server";
import { markGuestOpened } from "@/lib/db";

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
  await markGuestOpened(slug, name);
  return NextResponse.json({ ok: true });
}

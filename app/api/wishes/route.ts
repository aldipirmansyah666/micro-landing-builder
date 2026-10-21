import { NextResponse } from "next/server";
import {
  createWish,
  getLandingPageBasicBySlug,
  getWishesBySlug,
  isUniqueViolation,
} from "@/lib/db";

const ATTENDANCE = new Set(["Hadir", "Tidak Hadir", "Masih Ragu"]);

// Rate-limit sederhana per IP+slug: maks 5 ucapan per 10 menit.
// Best-effort in-memory (reset saat instance restart / multi-instance);
// untuk skala besar ganti dengan store persisten (mis. Upstash Ratelimit).
const WISH_WINDOW_MS = 10 * 60 * 1000;
const WISH_MAX_PER_WINDOW = 5;
const wishHits = new Map<string, number[]>();

function wishRateLimitOk(key: string): boolean {
  const now = Date.now();
  const recent = (wishHits.get(key) ?? []).filter((t) => now - t < WISH_WINDOW_MS);
  if (recent.length >= WISH_MAX_PER_WINDOW) {
    wishHits.set(key, recent);
    return false;
  }
  recent.push(now);
  wishHits.set(key, recent);
  // Bersihkan entri basi sesekali agar Map tidak tumbuh tanpa batas.
  if (wishHits.size > 5000) {
    for (const [k, v] of wishHits) {
      if (v.length === 0 || now - v[v.length - 1]! >= WISH_WINDOW_MS) wishHits.delete(k);
    }
  }
  return true;
}

/**
 * IP klien dari header yang diisi INFRASTRUKTUR, bukan oleh klien.
 *
 * Kenapa `x-forwarded-for` mentah tidak boleh dipakai: klien bebas
 * menyisipkan nilai apa pun di header itu, dan elemen PERTAMA adalah yang
 * paling mudah dipalsukan (proxy biasanya menambahkan IP asli di akhir).
 * Mengambil elemen pertama membuat rate limit bisa dilewati dengan
 * memutar-mutar IP palsu pada setiap request.
 *
 * Header tepercaya:
 * - `cf-connecting-ip` : Cloudflare Workers/Pages — diisi edge, tidak bisa
 *   disetel klien.
 * - `x-real-ip`         : Vercel dan sebagian reverse proxy — ditulis
 *   ulang oleh platform dengan IP klien asli.
 *
 * Catatan: bila deployment tidak menyediakan salah satu header di atas,
 * IP tidak bisa ditentukan dengan trustworthy, sehingga rate limit di
 * sisi aplikasi tidak sepenuhnya andal. Untuk produksi, pindahkan ke
 * store persisten (mis. Upstash / Redis) dengan counter per-kunci.
 */
function clientIp(req: Request): string {
  const cfConnectingIp = req.headers.get("cf-connecting-ip")?.trim();
  if (cfConnectingIp) return cfConnectingIp;
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  // Tidak ada header tepercaya → kunci bersama. Lebih ketat (bukan lebih longgar).
  return "unknown";
}

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

  // Honeypot anti-bot: field tersembunyi yang hanya diisi bot.
  // Tolak diam-diam sebagai sukses palsu agar bot tidak belajar.
  if (typeof body.website_address === "string" && body.website_address.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

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

  if (!wishRateLimitOk(`${clientIp(req)}:${slug}`)) {
    return NextResponse.json(
      { error: "Terlalu banyak ucapan. Coba lagi beberapa menit lagi." },
      { status: 429 }
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

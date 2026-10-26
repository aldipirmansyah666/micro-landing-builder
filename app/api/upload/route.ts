import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  isSupabaseStorageConfigured,
  uploadToSupabaseStorage,
  UPLOADS_BUCKET,
} from "@/lib/supabase";
import { consumeRateLimit } from "@/lib/rate-limit";
import { detectUploadType, isMimeCompatible } from "@/lib/upload-validation";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = await consumeRateLimit({
    key: `upload:${userId}`,
    limit: 30,
    windowSeconds: 10 * 60,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak unggahan. Coba lagi beberapa menit lagi." },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Body harus multipart/form-data" },
      { status: 400 }
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Field 'file' wajib diisi" },
      { status: 400 }
    );
  }
  if (file.size === 0) {
    return NextResponse.json(
      { error: "File kosong" },
      { status: 413 }
    );
  }
  if (file.type === "image/svg+xml") {
    return NextResponse.json({ error: "SVG tidak diizinkan" }, { status: 400 });
  }

  const header = Buffer.from(await file.slice(0, 64).arrayBuffer());
  const detected = detectUploadType(header);
  if (!detected) {
    return NextResponse.json(
      { error: "Isi file tidak dikenali sebagai gambar, audio, atau video" },
      { status: 415 }
    );
  }
  if (!isMimeCompatible(file.type, detected)) {
    return NextResponse.json(
      { error: "Tipe file tidak sesuai dengan isi file" },
      { status: 415 }
    );
  }
  if (file.size > detected.maxBytes) {
    return NextResponse.json(
      {
        error: `Ukuran file maks ${Math.round(detected.maxBytes / 1024 / 1024)}MB`,
      },
      { status: 413 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    // 1) Supabase Storage (bucket publik `uploads`) — kembalikan URL publik
    // resmi via getPublicUrl yang langsung bisa dipakai <img>/preview.
    // NOTE: folder cukup userId saja (tanpa awalan "uploads/") karena nama
    // bucket sudah menjadi prefix URL — awalan ganda menghasilkan
    // /uploads/uploads/... yang 404.
    if (isSupabaseStorageConfigured()) {
      const result = await uploadToSupabaseStorage({
        buffer,
        contentType: detected.mime,
        folder: userId,
      });
      return NextResponse.json({ ok: true, ...result }, { status: 201 });
    }

    // 2) Development lokal tanpa Supabase: simpan ke public/uploads/,
    // kembalikan URL ABSOLUT agar lolos validateContentUrls() di save-route
    // (yang mewajibkan http(s) — path relatif selalu ditolak).
    // (JANGAN dipakai di production — filesystem Vercel ephemeral dan
    // tidak dibagikan antar instance; di production wajib Supabase.)
    if (process.env.NODE_ENV === "development") {
      const { mkdir, writeFile } = await import("node:fs/promises");
      const { join } = await import("node:path");
      const { randomUUID } = await import("node:crypto");
      const dir = join(process.cwd(), "public", "uploads");
      await mkdir(dir, { recursive: true });
      const filename = `${randomUUID()}.${detected.ext}`;
      await writeFile(join(dir, filename), buffer);
      const publicUrl = `${new URL(req.url).origin}/uploads/${filename}`;
      return NextResponse.json(
        {
          ok: true,
          key: `uploads/${filename}`,
          url: publicUrl,
          contentType: detected.mime,
          size: buffer.length,
        },
        { status: 201 }
      );
    }

    // 3) Production tanpa Supabase: storage memang belum dikonfigurasi.
    //
    // KEAMANAN: nama variabel lingkungan & nama bucket TIDAK boleh
    // diekspos ke klien — pesan seperti "set SUPABASE_SERVICE_ROLE_KEY"
    // memetakan infrastruktur internal bagi penyerang. Detail konfigurasi
    // hanya ditulis ke log server; klien menerima pesan generik.
    console.error("[upload] storage belum dikonfigurasi", {
      hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      bucket: UPLOADS_BUCKET,
      nodeEnv: process.env.NODE_ENV,
    });
    return NextResponse.json(
      {
        error:
          "Layanan penyimpanan sedang tidak tersedia. Silakan coba lagi nanti.",
      },
      { status: 501 }
    );
  } catch (error) {
    // Detail (pesan driver Supabase/FS, path server) → log server saja.
    console.error("[upload] gagal mengunggah file", error);
    return NextResponse.json(
      {
        error: "Gagal mengunggah file. Silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}

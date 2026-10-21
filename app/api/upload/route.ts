import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  extensionForMimeType,
  isSupabaseStorageConfigured,
  uploadToSupabaseStorage,
  UPLOADS_BUCKET,
} from "@/lib/supabase";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  const isImage = file.type.startsWith("image/");
  const isAudio = file.type.startsWith("audio/");
  if (!isImage && !isAudio) {
    return NextResponse.json(
      { error: "Hanya file gambar atau audio yang diizinkan" },
      { status: 400 }
    );
  }
  const maxSize = isAudio ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size === 0 || file.size > maxSize) {
    return NextResponse.json(
      { error: `Ukuran file maks ${isAudio ? "10MB" : "5MB"}` },
      { status: 413 }
    );
  }
  // Tolak SVG (bisa berisi script) walau lolos prefix image/.
  if (file.type === "image/svg+xml") {
    return NextResponse.json({ error: "SVG tidak diizinkan" }, { status: 400 });
  }
  if (!extensionForMimeType(file.type)) {
    return NextResponse.json(
      { error: `Tipe file tidak didukung: ${file.type}` },
      { status: 400 }
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
        contentType: file.type,
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
      const ext = extensionForMimeType(file.type) ?? "bin";
      const { mkdir, writeFile } = await import("node:fs/promises");
      const { join } = await import("node:path");
      const { randomUUID } = await import("node:crypto");
      const dir = join(process.cwd(), "public", "uploads");
      await mkdir(dir, { recursive: true });
      const filename = `${randomUUID()}.${ext}`;
      await writeFile(join(dir, filename), buffer);
      const publicUrl = `${new URL(req.url).origin}/uploads/${filename}`;
      return NextResponse.json(
        {
          ok: true,
          key: `uploads/${filename}`,
          url: publicUrl,
          contentType: file.type,
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

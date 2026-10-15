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
    // kembalikan URL relatif yang valid (/uploads/nama-file.ext).
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
      return NextResponse.json(
        {
          ok: true,
          key: `uploads/${filename}`,
          url: `/uploads/${filename}`,
          contentType: file.type,
          size: buffer.length,
        },
        { status: 201 }
      );
    }

    // 3) Production tanpa Supabase: storage memang belum dikonfigurasi.
    return NextResponse.json(
      {
        error:
          `Storage belum dikonfigurasi (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY + bucket publik '${UPLOADS_BUCKET}')`,
      },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Gagal mengunggah file",
      },
      { status: 500 }
    );
  }
}

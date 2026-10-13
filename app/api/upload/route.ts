import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { uploadToR2 } from "@/lib/r2";

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

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToR2({
      buffer,
      contentType: file.type,
      folder: `uploads/${userId}`,
    });
    return NextResponse.json({ ok: true, ...result }, { status: 201 });
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

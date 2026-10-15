import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Nama bucket publik untuk foto cover/galeri + audio backsound. */
export const UPLOADS_BUCKET = "uploads";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} belum di-set. Tambahkan kredensial Supabase ke .env.local`
    );
  }
  return value;
}

let serviceClient: SupabaseClient | null = null;

/**
 * Client Supabase server-side (service_role, bypass RLS).
 * HANYA dipakai di route handler / server action — jangan expose ke client.
 */
export function getSupabaseServiceClient(): SupabaseClient {
  if (!serviceClient) {
    serviceClient = createClient(
      requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
      requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return serviceClient;
}

/** True bila kredensial Supabase Storage terisi. */
export function isSupabaseStorageConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "audio/mpeg": "mp3",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
  "audio/x-m4a": "m4a",
  "audio/mp4": "m4a",
};

/** Ekstensi file untuk MIME yang didukung, undefined bila tak didukung. */
export function extensionForMimeType(mime: string): string | undefined {
  return EXT_BY_MIME[mime];
}

export interface UploadToSupabaseInput {
  buffer: Buffer | Uint8Array;
  contentType: string;
  /**
   * Folder prefix DI DALAM bucket, mis. `<userId>`.
   * Jangan sertakan nama bucket ("uploads/") — bucket sudah menjadi
   * prefix URL publik, awalan itu menghasilkan /uploads/uploads/... (404).
   */
  folder?: string;
}

export interface UploadToSupabaseResult {
  key: string;
  url: string;
  contentType: string;
  size: number;
}

/**
 * Unggah buffer ke Supabase Storage bucket `uploads` dan kembalikan
 * URL publik resmi via getPublicUrl. Bucket harus publik (lihat
 * supabase/schema.sql bagian STORAGE) agar <img> bisa memuatnya.
 */
export async function uploadToSupabaseStorage(
  input: UploadToSupabaseInput
): Promise<UploadToSupabaseResult> {
  const ext = EXT_BY_MIME[input.contentType];
  if (!ext) {
    throw new Error(`Tipe file tidak didukung: ${input.contentType}`);
  }

  const folder = (input.folder ?? "").replace(/^\/+|\/+$/g, "");
  const key = folder ? `${folder}/${randomUUID()}.${ext}` : `${randomUUID()}.${ext}`;
  const body = Buffer.from(input.buffer);

  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.storage
    .from(UPLOADS_BUCKET)
    .upload(key, body, {
      contentType: input.contentType,
      upsert: false,
    });
  if (error) throw new Error(`Gagal mengunggah ke storage: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from(UPLOADS_BUCKET).getPublicUrl(key);

  return { key, url: publicUrl, contentType: input.contentType, size: body.length };
}

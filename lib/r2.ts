import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} belum di-set. Tambahkan kredensial Cloudflare R2 ke .env.local`
    );
  }
  return value;
}

let client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: requiredEnv("R2_ENDPOINT"),
      credentials: {
        accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
        secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
      },
    });
  }
  return client;
}

export function getR2Bucket(): string {
  return requiredEnv("R2_BUCKET_NAME");
}

/**
 * URL publik untuk sebuah object key. Set R2_PUBLIC_BASE_URL ke custom
 * domain / r2.dev bucket agar file bisa diakses publik. Tanpa itu,
 * fallback ke URL endpoint (butuh bucket public / token).
 */
export function buildPublicUrl(key: string): string {
  const base = process.env.R2_PUBLIC_BASE_URL;
  if (base) return `${base.replace(/\/$/, "")}/${key}`;
  return `${requiredEnv("R2_ENDPOINT")}/${getR2Bucket()}/${key}`;
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

export interface UploadToR2Input {
  buffer: Buffer | Uint8Array;
  contentType: string;
  /** Folder prefix di bucket, mis. `uploads/<userId>` */
  folder?: string;
}

export interface UploadToR2Result {
  key: string;
  url: string;
  contentType: string;
  size: number;
}

export async function uploadToR2(
  input: UploadToR2Input
): Promise<UploadToR2Result> {
  const ext = EXT_BY_MIME[input.contentType];
  if (!ext) {
    throw new Error(`Tipe file tidak didukung: ${input.contentType}`);
  }

  const folder = (input.folder ?? "uploads").replace(/^\/+|\/+$/g, "");
  const key = `${folder}/${randomUUID()}.${ext}`;
  const body = Buffer.from(input.buffer);

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getR2Bucket(),
      Key: key,
      Body: body,
      ContentType: input.contentType,
    })
  );

  return {
    key,
    url: buildPublicUrl(key),
    contentType: input.contentType,
    size: body.length,
  };
}

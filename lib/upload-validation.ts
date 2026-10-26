export type UploadKind = "image" | "audio" | "video";

export interface DetectedUploadType {
  mime: string;
  ext: string;
  kind: UploadKind;
  maxBytes: number;
}

const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const AUDIO_MAX_BYTES = 10 * 1024 * 1024;
const VIDEO_MAX_BYTES = 50 * 1024 * 1024;

function ascii(buffer: Uint8Array, offset: number, length: number): string {
  if (buffer.length < offset + length) return "";
  return String.fromCharCode(...buffer.subarray(offset, offset + length));
}

function startsWith(buffer: Uint8Array, signature: number[], offset = 0): boolean {
  if (buffer.length < offset + signature.length) return false;
  return signature.every((byte, index) => buffer[offset + index] === byte);
}

function isMp3(buffer: Uint8Array): boolean {
  if (ascii(buffer, 0, 3) === "ID3") return true;
  if (buffer.length < 4 || buffer[0] !== 0xff) return false;
  const version = (buffer[1]! >> 3) & 0x03;
  const layer = (buffer[1]! >> 1) & 0x03;
  return version !== 0x01 && layer !== 0x00;
}

function isoTemplate(buffer: Uint8Array): string | null {
  if (ascii(buffer, 4, 4) !== "ftyp") return null;
  const brand = ascii(buffer, 8, 4);
  if (!brand) return null;
  return brand;
}

const IMAGE: Omit<DetectedUploadType, "mime" | "ext"> = {
  kind: "image",
  maxBytes: IMAGE_MAX_BYTES,
};
const AUDIO: Omit<DetectedUploadType, "mime" | "ext"> = {
  kind: "audio",
  maxBytes: AUDIO_MAX_BYTES,
};
const VIDEO: Omit<DetectedUploadType, "mime" | "ext"> = {
  kind: "video",
  maxBytes: VIDEO_MAX_BYTES,
};

export function detectUploadType(
  header: Uint8Array
): DetectedUploadType | null {
  if (startsWith(header, [0xff, 0xd8, 0xff])) {
    return { ...IMAGE, mime: "image/jpeg", ext: "jpg" };
  }
  if (startsWith(header, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { ...IMAGE, mime: "image/png", ext: "png" };
  }
  if (ascii(header, 0, 6) === "GIF87a" || ascii(header, 0, 6) === "GIF89a") {
    return { ...IMAGE, mime: "image/gif", ext: "gif" };
  }
  if (ascii(header, 0, 4) === "RIFF") {
    const riffType = ascii(header, 8, 4);
    if (riffType === "WEBP") {
      return { ...IMAGE, mime: "image/webp", ext: "webp" };
    }
    if (riffType === "WAVE") {
      return { ...AUDIO, mime: "audio/wav", ext: "wav" };
    }
  }
  if (ascii(header, 0, 4) === "OggS") {
    return { ...AUDIO, mime: "audio/ogg", ext: "ogg" };
  }
  if (isMp3(header)) {
    return { ...AUDIO, mime: "audio/mpeg", ext: "mp3" };
  }
  if (startsWith(header, [0x1a, 0x45, 0xdf, 0xa3])) {
    return { ...VIDEO, mime: "video/webm", ext: "webm" };
  }

  const brand = isoTemplate(header);
  if (brand) {
    if (brand === "qt  ") {
      return { ...VIDEO, mime: "video/quicktime", ext: "mov" };
    }
    if (brand === "M4A " || brand === "M4B " || brand === "M4P ") {
      return { ...AUDIO, mime: "audio/mp4", ext: "m4a" };
    }
    const mp4Brands = new Set([
      "isom",
      "iso2",
      "iso4",
      "iso5",
      "iso6",
      "mp41",
      "mp42",
      "avc1",
      "dash",
      "MSNV",
    ]);
    if (mp4Brands.has(brand)) {
      return { ...VIDEO, mime: "video/mp4", ext: "mp4" };
    }
  }

  return null;
}

export function isMimeCompatible(
  declared: string,
  detected: DetectedUploadType
): boolean {
  if (declared === detected.mime) return true;
  if (
    detected.mime === "audio/mp4" &&
    (declared === "audio/x-m4a" || declared === "audio/mp4")
  ) {
    return true;
  }
  return false;
}

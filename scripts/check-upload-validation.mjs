import assert from "node:assert/strict";
import {
  detectUploadType,
  isMimeCompatible,
} from "../lib/upload-validation.ts";

const cases = [
  ["jpeg", [0xff, 0xd8, 0xff, 0xe0], "image/jpeg", "image/jpeg"],
  ["png", [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], "image/png", "image/png"],
  ["gif", "GIF89a", "image/gif", "image/gif"],
  ["webp", "RIFF????WEBPVP8 ", "image/webp", "image/webp"],
  ["mp3", "ID3\u0004\u0000\u0000\u0000", "audio/mpeg", "audio/mpeg"],
  ["ogg", "OggS\u0000\u0002\u0000\u0000", "audio/ogg", "audio/ogg"],
  ["wav", "RIFF????WAVEfmt ", "audio/wav", "audio/wav"],
  ["m4a", [0, 0, 0, 0x20, 0x66, 0x74, 0x79, 0x70, 0x4d, 0x34, 0x41, 0x20], "audio/x-m4a", "audio/mp4"],
  ["mp4", [0, 0, 0, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d], "video/mp4", "video/mp4"],
  ["mov", [0, 0, 0, 0x20, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20], "video/quicktime", "video/quicktime"],
  ["webm", [0x1a, 0x45, 0xdf, 0xa3], "video/webm", "video/webm"],
];

for (const [name, header, declared, expected] of cases) {
  const detected = detectUploadType(Buffer.from(header));
  assert.equal(detected?.mime, expected, `${name}: MIME terdeteksi salah`);
  assert.ok(
    isMimeCompatible(declared, detected),
    `${name}: MIME deklarasi seharusnya kompatibel`
  );
}

const jpeg = detectUploadType(Buffer.from([0xff, 0xd8, 0xff, 0xe0]));
assert.ok(jpeg);
assert.equal(
  isMimeCompatible("image/png", jpeg),
  false,
  "MIME spoof seharusnya ditolak"
);
assert.equal(
  detectUploadType(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg">')),
  null,
  "SVG seharusnya ditolak"
);

console.log(`OK    ${cases.length} tipe upload + 2 kasus penolakan`);

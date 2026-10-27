"use client";

import { Button, Field, Input } from "@/design-system/primitives";
import type { InvitationContent } from "@/lib/invitation";
import { MAX_GALLERY_VIDEOS } from "@/lib/invitation";
import { MAX_GALLERY_IMAGES } from "@/lib/validation/invitation";

/**
 * Langkah 5: media (foto sampul, galeri foto/video, backsound).
 *
 * CATATAN INTEGRASI: field di bawah menerima URL (mis. hasil upload ke
 * Supabase Storage lewat `POST /api/upload` yang sudah ada di codebase).
 * Widget upload drag-and-drop bisa dicolokkan kemudian tanpa mengubah
 * bentuk state — cukup panggil endpoint itu lalu `patch({ heroImage: url })`.
 */
export function MediaStep({
  data,
  onChange,
}: {
  data: InvitationContent;
  onChange: (patch: Partial<InvitationContent>) => void;
}) {
  const images = data.galleryImages;
  const videos = data.galleryVideos;

  return (
    <div className="flex flex-col gap-5">
      <Field label="URL Foto Sampul (Cover)" htmlFor="heroImage">
        <Input
          id="heroImage"
          value={data.heroImage}
          maxLength={500}
          placeholder="https://... (hasil upload)"
          onChange={(e) => onChange({ heroImage: e.target.value })}
        />
      </Field>

      <Field label="URL Backsound (MP3)" htmlFor="backsoundUrl">
        <Input
          id="backsoundUrl"
          value={data.backsoundUrl}
          maxLength={500}
          placeholder="https://... (opsional)"
          onChange={(e) => onChange({ backsoundUrl: e.target.value })}
        />
      </Field>

      {/* Galeri Foto */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Galeri Foto (maks {MAX_GALLERY_IMAGES})
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={images.length >= MAX_GALLERY_IMAGES}
            onClick={() => onChange({ galleryImages: [...images, ""] })}
          >
            + Tambah Foto
          </Button>
        </div>
        {images.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={url}
              maxLength={500}
              placeholder="https://..."
              onChange={(e) => {
                const next = [...images];
                next[index] = e.target.value;
                onChange({ galleryImages: next });
              }}
            />
            <Button
              variant="danger"
              size="sm"
              onClick={() =>
                onChange({ galleryImages: images.filter((_, i) => i !== index) })
              }
            >
              Hapus
            </Button>
          </div>
        ))}
      </div>

      {/* Galeri Video */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Galeri Video (maks {MAX_GALLERY_VIDEOS})
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={videos.length >= MAX_GALLERY_VIDEOS}
            onClick={() => onChange({ galleryVideos: [...videos, ""] })}
          >
            + Tambah Video
          </Button>
        </div>
        {videos.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={url}
              maxLength={500}
              placeholder="https://..."
              onChange={(e) => {
                const next = [...videos];
                next[index] = e.target.value;
                onChange({ galleryVideos: next });
              }}
            />
            <Button
              variant="danger"
              size="sm"
              onClick={() =>
                onChange({ galleryVideos: videos.filter((_, i) => i !== index) })
              }
            >
              Hapus
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

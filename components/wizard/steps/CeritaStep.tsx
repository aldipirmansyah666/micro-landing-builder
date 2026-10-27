"use client";

import { Button, Field, Input, Textarea } from "@/design-system/primitives";
import type { InvitationContent, StoryEntry } from "@/lib/invitation";
import { MAX_STORIES } from "@/lib/invitation";

/** Langkah 4: sapaan pembuka, pesan penutup, dan love story (repeater). */
export function CeritaStep({
  data,
  onChange,
}: {
  data: InvitationContent;
  onChange: (patch: Partial<InvitationContent>) => void;
}) {
  const stories = data.stories ?? [];

  function commit(next: StoryEntry[]) {
    onChange({ stories: next.length > 0 ? next : undefined });
  }

  function updateStory(index: number, patch: Partial<StoryEntry>) {
    commit(stories.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  return (
    <div className="flex flex-col gap-5">
      <Field
        label="Sapaan Pembuka (opsional)"
        htmlFor="greeting"
        hint="Kosongkan untuk memakai salam bawaan template."
      >
        <Textarea
          id="greeting"
          rows={2}
          maxLength={1000}
          value={data.greeting ?? ""}
          onChange={(e) => onChange({ greeting: e.target.value })}
        />
      </Field>

      <Field
        label="Pesan Penutup (opsional)"
        htmlFor="closingNote"
        hint="Ditampilkan di bagian bawah undangan."
      >
        <Textarea
          id="closingNote"
          rows={2}
          maxLength={1000}
          value={data.closingNote ?? ""}
          onChange={(e) => onChange({ closingNote: e.target.value })}
        />
      </Field>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Love Story (maks {MAX_STORIES})
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              commit([...stories, { title: "", text: "", dateLabel: "" }])
            }
            disabled={stories.length >= MAX_STORIES}
          >
            + Tambah Cerita
          </Button>
        </div>

        {stories.map((story, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500">
                Cerita {index + 1}
              </span>
              <Button
                variant="danger"
                size="sm"
                onClick={() =>
                  commit(stories.filter((_, i) => i !== index))
                }
              >
                Hapus
              </Button>
            </div>
            <Field label="Judul" htmlFor={`story-title-${index}`}>
              <Input
                id={`story-title-${index}`}
                value={story.title}
                maxLength={80}
                onChange={(e) => updateStory(index, { title: e.target.value })}
              />
            </Field>
            <Field label="Tanggal / Tahun (opsional)" htmlFor={`story-date-${index}`}>
              <Input
                id={`story-date-${index}`}
                value={story.dateLabel ?? ""}
                maxLength={30}
                placeholder="2019 atau 12 Feb 2020"
                onChange={(e) => updateStory(index, { dateLabel: e.target.value })}
              />
            </Field>
            <Field label="Cerita" htmlFor={`story-text-${index}`}>
              <Textarea
                id={`story-text-${index}`}
                rows={3}
                maxLength={1000}
                value={story.text}
                onChange={(e) => updateStory(index, { text: e.target.value })}
              />
            </Field>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { Button, Field, Input, Select } from "@/design-system/primitives";
import { TIMEZONE_OPTIONS } from "@/lib/invitation";
import type { InvitationContent } from "@/lib/invitation";
import type { WeddingEventEntry } from "@/lib/invitation-events";
import { MAX_EVENTS } from "@/lib/invitation-events";
import {
  createEmptyEvent,
  withDerivedDayLabels,
} from "@/lib/wizard/wizardMachine";

const KIND_OPTIONS: { value: WeddingEventEntry["kind"]; label: string }[] = [
  { value: "akad", label: "Akad / Pemberkatan" },
  { value: "reception", label: "Resepsi" },
  { value: "lainnya", label: "Lainnya" },
];

/**
 * Langkah 3: manajemen acara dinamis — pengguna bisa menambah / menghapus
 * baris acara (Akad, Resepsi, Ngunduh Mantu, dsb., maksimal MAX_EVENTS),
 * dan memilih satu acara utama sebagai acuan countdown timer.
 */
export function AcaraStep({
  data,
  onChange,
}: {
  data: InvitationContent;
  onChange: (patch: Partial<InvitationContent>) => void;
}) {
  const events = data.events ?? [];

  function commit(next: WeddingEventEntry[]) {
    onChange({ events: withDerivedDayLabels(next) });
  }

  function updateEvent(id: string, patch: Partial<WeddingEventEntry>) {
    commit(events.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function addEvent() {
    if (events.length >= MAX_EVENTS) return;
    const first = createEmptyEvent();
    // Acara pertama otomatis jadi yang utama (countdown), sisanya tidak.
    commit([...events, { ...first, isPrimary: events.length === 0 }]);
  }

  function removeEvent(id: string) {
    const next = events.filter((e) => e.id !== id);
    // Pastikan selalu ada tepat satu acara utama (yang pertama tersisa).
    if (next.length > 0 && !next.some((e) => e.isPrimary)) {
      next[0] = { ...next[0], isPrimary: true };
    }
    commit(next);
  }

  return (
    <div className="flex flex-col gap-4">
      {events.length === 0 && (
        <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Belum ada acara. Tambahkan minimal satu — mis. Akad Nikah.
        </p>
      )}

      {events.map((event, index) => (
        <fieldset
          key={event.id}
          className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
        >
          <div className="flex items-center justify-between gap-2">
            <legend className="px-1 text-sm font-semibold">
              Acara {index + 1}
            </legend>
            {events.length > 1 && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeEvent(event.id)}
              >
                Hapus
              </Button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Jenis Acara" htmlFor={`kind-${event.id}`}>
              <Select
                id={`kind-${event.id}`}
                value={event.kind}
                onChange={(e) =>
                  updateEvent(event.id, {
                    kind: e.target.value as WeddingEventEntry["kind"],
                  })
                }
              >
                {KIND_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Nama Acara" htmlFor={`title-${event.id}`}>
              <Input
                id={`title-${event.id}`}
                value={event.title}
                maxLength={60}
                placeholder="Akad Nikah"
                onChange={(e) => updateEvent(event.id, { title: e.target.value })}
              />
            </Field>
            <Field label="Tanggal" htmlFor={`date-${event.id}`}>
              <Input
                id={`date-${event.id}`}
                type="date"
                value={event.date}
                onChange={(e) => updateEvent(event.id, { date: e.target.value })}
              />
            </Field>
            <Field label="Jam" htmlFor={`time-${event.id}`}>
              <Input
                id={`time-${event.id}`}
                type="time"
                value={event.time}
                onChange={(e) => updateEvent(event.id, { time: e.target.value })}
              />
            </Field>
            <Field label="Zona Waktu" htmlFor={`tz-${event.id}`}>
              <Select
                id={`tz-${event.id}`}
                value={event.timezone}
                onChange={(e) =>
                  updateEvent(event.id, {
                    timezone: e.target.value as WeddingEventEntry["timezone"],
                  })
                }
              >
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Lokasi / Venue" htmlFor={`venue-${event.id}`}>
              <Input
                id={`venue-${event.id}`}
                value={event.venue}
                maxLength={150}
                onChange={(e) => updateEvent(event.id, { venue: e.target.value })}
              />
            </Field>
            <Field
              label="Alamat Lengkap"
              htmlFor={`address-${event.id}`}
              className="sm:col-span-2"
            >
              <Input
                id={`address-${event.id}`}
                value={event.address}
                maxLength={300}
                onChange={(e) => updateEvent(event.id, { address: e.target.value })}
              />
            </Field>
            <Field
              label="Link Google Maps"
              htmlFor={`maps-${event.id}`}
              className="sm:col-span-2"
            >
              <Input
                id={`maps-${event.id}`}
                value={event.mapsUrl}
                maxLength={500}
                placeholder="https://maps.google.com/..."
                onChange={(e) => updateEvent(event.id, { mapsUrl: e.target.value })}
              />
            </Field>
            <Field label="Dresscode" htmlFor={`dresscode-${event.id}`}>
              <Input
                id={`dresscode-${event.id}`}
                value={event.dresscode}
                maxLength={120}
                onChange={(e) =>
                  updateEvent(event.id, { dresscode: e.target.value })
                }
              />
            </Field>
            <div className="flex items-end pb-2.5">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="primaryEvent"
                  checked={event.isPrimary}
                  onChange={() =>
                    commit(
                      events.map((e) => ({
                        ...e,
                        isPrimary: e.id === event.id,
                      }))
                    )
                  }
                />
                Jadikan acara utama (countdown)
              </label>
            </div>
          </div>
        </fieldset>
      ))}

      <Button
        variant="secondary"
        onClick={addEvent}
        disabled={events.length >= MAX_EVENTS}
      >
        + Tambah Acara{events.length >= MAX_EVENTS ? ` (maks ${MAX_EVENTS})` : ""}
      </Button>
    </div>
  );
}

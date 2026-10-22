import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  createLandingPage,
  getLandingPageBasicByUserAndSlug,
  getUserRole,
  isUniqueViolation,
  setLandingPageProBySlug,
  updateLandingPage,
  upsertUser,
} from "@/lib/db";
import { checkSaveEntitlements, hasProAccess } from "@/lib/entitlements";
import {
  ALL_TEMPLATE_IDS,
  LEGACY_TEMPLATE_ALIASES,
  MAX_CLOSING_NOTE_LEN,
  MAX_GREETING_LEN,
  MAX_STORIES,
  MAX_STORY_TEXT_LEN,
  MAX_STORY_TITLE_LEN,
  resolveTemplate,
  safeHttpUrl,
  toInvitationContent,
} from "@/lib/invitation";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Diturunkan dari sumber kanonis (seluruh id katalog + lawas + alias)
// agar penambahan template baru otomatis ikut tersimpan — tidak ada lagi
// allowlist hardcoded yang menolak template baru dengan 400.
const TEMPLATE_ALLOWLIST = new Set<string>([
  ...ALL_TEMPLATE_IDS,
  ...Object.keys(LEGACY_TEMPLATE_ALIASES),
]);

const MAX_CONTENT_BYTES = 512 * 1024; // 512KB
const MAX_GALLERY_IMAGES = 12;

// Key content_json yang berisi URL/file — wajib http(s) bila diisi,
// untuk mencegah stored javascript:/data: URL yang dieksekusi saat diklik.
const URL_KEYS = [
  "backsoundUrl",
  "mapsUrl",
  "akadMapsUrl",
  "receptionMapsUrl",
  "heroImage",
  "imageUrl",
  "coverImageUrl",
];
const URL_ARRAY_KEYS = ["galleryImages", "galleryUrls"];

interface SaveBody {
  slug?: unknown;
  title?: unknown;
  template_type?: unknown;
  content_json?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * True bila URL aman dipakai di href/src (hanya http/https).
 *
 * Memakai `safeHttpUrl` dari lib/invitation — helper yang sama dengan
 * yang dipakai saat render — sehingga aturan "hanya http(s)" tidak
 * bisa berbeda antara jalur tulis dan jalur baca.
 */
function isHttpUrl(value: string): boolean {
  return safeHttpUrl(value) !== "";
}

/** Kembalikan pesan error bila ada URL berbahaya di content, null bila aman. */
function validateContentUrls(content: Record<string, unknown>): string | null {

  for (const key of URL_KEYS) {
    const v = content[key];
    if (typeof v === "string" && v.trim() !== "" && !isHttpUrl(v.trim())) {
      return `Field '${key}' harus berupa URL http(s) yang valid`;
    }
  }
  for (const key of URL_ARRAY_KEYS) {
    const v = content[key];
    if (v === undefined) continue;
    if (
      !Array.isArray(v) ||
      v.some((u) => typeof u !== "string" || (u.trim() !== "" && !isHttpUrl(u.trim())))
    ) {
      return `Field '${key}' harus berupa array URL http(s) yang valid`;
    }
  }
  const gallery = content.galleryImages ?? content.galleryUrls;
  if (Array.isArray(gallery) && gallery.length > MAX_GALLERY_IMAGES) {
    return `Maksimal ${MAX_GALLERY_IMAGES} foto galeri`;
  }
  return null;
}

/**
 * Batas Content Enhancement v1 (sapaan, penutup, cerita). Key absen =
 * data lama (lolos); key ada tapi melampaui batas = 400 dengan pesan jelas.
 */
function validateContentLimits(content: Record<string, unknown>): string | null {
  const greeting = content.greeting;
  if (greeting !== undefined && (typeof greeting !== "string" || greeting.length > MAX_GREETING_LEN)) {
    return `Sapaan pembuka maksimal ${MAX_GREETING_LEN} karakter`;
  }
  const closingNote = content.closingNote;
  if (closingNote !== undefined && (typeof closingNote !== "string" || closingNote.length > MAX_CLOSING_NOTE_LEN)) {
    return `Pesan penutup maksimal ${MAX_CLOSING_NOTE_LEN} karakter`;
  }
  const stories = content.stories;
  if (stories === undefined) return null;
  if (!Array.isArray(stories)) return "Cerita harus berupa daftar";
  if (stories.length > MAX_STORIES) return `Maksimal ${MAX_STORIES} cerita`;
  for (let i = 0; i < stories.length; i++) {
    const e = stories[i];
    if (!e || typeof e !== "object" || Array.isArray(e)) {
      return `Cerita ke-${i + 1} tidak valid`;
    }
    const { title, text } = e as Record<string, unknown>;
    if (typeof title !== "string" || typeof text !== "string") {
      return `Cerita ke-${i + 1} harus punya judul dan isi teks`;
    }
    if (title.length > MAX_STORY_TITLE_LEN) {
      return `Judul cerita ke-${i + 1} maksimal ${MAX_STORY_TITLE_LEN} karakter`;
    }
    if (text.length > MAX_STORY_TEXT_LEN) {
      return `Isi cerita ke-${i + 1} maksimal ${MAX_STORY_TEXT_LEN} karakter`;
    }
  }
  return null;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SaveBody;
  try {
    body = (await req.json()) as SaveBody;
  } catch {
    return NextResponse.json({ error: "Body harus JSON" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const rawTemplateType =
    typeof body.template_type === "string" && body.template_type.trim() !== ""
      ? body.template_type.trim()
      : "minimalist";
  const contentJson = isRecord(body.content_json) ? body.content_json : null;

  if (!SLUG_RE.test(slug) || slug.length > 60) {
    return NextResponse.json(
      {
        error:
          "Slug tidak valid (huruf kecil, angka, strip; maks 60 karakter)",
      },
      { status: 400 }
    );
  }
  if (!title || title.length > 120) {
    return NextResponse.json(
      { error: "Judul wajib diisi (maks 120 karakter)" },
      { status: 400 }
    );
  }
  if (!contentJson) {
    return NextResponse.json(
      { error: "content_json wajib berupa object" },
      { status: 400 }
    );
  }
  if (!TEMPLATE_ALLOWLIST.has(rawTemplateType.trim().toLowerCase())) {
    return NextResponse.json(
      { error: "template_type tidak dikenal" },
      { status: 400 }
    );
  }
  // Simpan SELALU dalam bentuk kanonis agar pembaca publik (/p/[slug])
  // yang memakai resolveTemplate yang sama pasti merender template yang
  // dipilih di builder — tidak ada lagi mismatch "Minimal" vs "minimalist".
  const templateType = resolveTemplate(rawTemplateType);
  if (JSON.stringify(contentJson).length > MAX_CONTENT_BYTES) {
    return NextResponse.json(
      { error: "Konten terlalu besar (maks 512KB)" },
      { status: 400 }
    );
  }
  const urlError = validateContentUrls(contentJson);
  if (urlError) {
    return NextResponse.json({ error: urlError }, { status: 400 });
  }
  const contentError = validateContentLimits(contentJson);
  if (contentError) {
    return NextResponse.json({ error: contentError }, { status: 400 });
  }

  // Pastikan baris user ada (FK landing_pages.user_id -> users.clerk_id)
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? null;
  if (email) {
    await upsertUser({ id: userId, clerk_id: userId, email });
  }

  // Hanya butuh `is_pro` (untuk gate entitlement) — pakai query ringan
  // tanpa `content_json` (bisa 512 KB) supaya tidak menarik JSONB yang
  // justru sedang dikirim ulang oleh request ini.
  const existing = await getLandingPageBasicByUserAndSlug(userId, slug);

  // Entitlement: halaman baru selalu Free; update mengikuti status saat ini.
  // Admin & surel yang terdaftar di PRO_BYPASS_EMAILS selalu lolos sebagai
  // Pro (bypass paywall). Perhatikan: surel diambil dari Clerk (authoritative),
  // bukan dari body request.
  const role = await getUserRole(userId);
  const isProPage = existing?.is_pro ?? false;
  const proAccess = hasProAccess({
    isPro: isProPage,
    isAdmin: role === "admin",
    email,
  });
  /**
   * Dokumen kanonik hasil normalisasi.
   *
   * Dipakai DUA hal sekaligus:
   * 1. Validasi entitlement (gallery, backsound, sapaan/cerita).
   * 2. YANG DISIMPAN ke `content_json`.
   *
   * Penting: yang disimpan adalah `normalized`, BUKAN `contentJson` mentah.
   * Kalau payload mentah yang disimpan, key asing (mis. `foo`) dan key
   * legacy (`description`, `galleryUrls`, `imageUrl`, …) akan menumpuk
   * permanen di database — tidak pernah dibersihkan, dan tidak pernah
   * divalidasi karena validasi berjalan terhadap bentuk normalisasi.
   * Dengan menyimpan `normalized`, isi database selalu berbentuk
   * `InvitationContent` yang valid, dan pembaca halaman publik tidak
   * perlu migrasi manual.
   *
   * Konsekuensi yang disengaja: field di luar `InvitationContent`
   * dibuang saat disimpan. Format lama tetap bermigrasi otomatis
   * karena `toInvitationContent()` memetakan `description`→`quote`,
   * `date`→`akadDate`/`receptionDate`, `location`→`…Venue`,
   * `mapsUrl`→`…MapsUrl`, `imageUrl`/`coverImageUrl`→`heroImage`, dan
   * `galleryUrls`→`galleryImages`.
   */
  const normalized = toInvitationContent(contentJson);
  const entitlementError = checkSaveEntitlements({
    isPro: proAccess,
    templateType,
    galleryCount: normalized.galleryImages.length,
    hasBacksound: normalized.backsoundUrl.trim() !== "",
    hasCustomContent:
      normalized.greeting !== undefined ||
      normalized.closingNote !== undefined ||
      normalized.stories !== undefined,
  });
  if (entitlementError) {
    return NextResponse.json({ error: entitlementError }, { status: 403 });
  }

  /**
   * Admin / surel PRO_BYPASS_EMAILS mendapat akses Pro TANPA pembayaran.
   * Kalau akses itu hanya hidup di memori (hasil hasProAccess), kolom
   * `is_pro` di DB tetap false — sehingga render publik /p/[slug] yang
   * membaca `page.is_pro` tetap merender versi Free, dashboard
   * menampilkan badge Pro, dan checkout menjawab "alreadyPro". Ketiga
   * itu tidak konsisten.
   *
   * Diperbaiki dengan menyelaraskan model datanya: begitu akses Pro
   * diberikan lewat admin/bypass, `is_pro = true` ikut dipersistkan pada
   * baris halaman tersebut. Render publik, dashboard, dan DB lalu
   * memakai satu sumber kebenaran.
   *
   * Catatan: `proAccess` true HANYA lewat bypass/admin bila halaman ini
   * belum Pro (`isProPage` false). Kalau halamannya sudah Pro, tidak ada
   * penulisan tambahan yang perlu dilakukan.
   */
  const needsProPersist = proAccess && !isProPage;

  if (existing) {
    const updated = await updateLandingPage(userId, slug, {
      title,
      template_type: templateType,
      contentJson: normalized,
    });
    if (!updated) {
      return NextResponse.json(
        { error: "Landing page tidak ditemukan" },
        { status: 404 }
      );
    }
    let page = updated;
    if (needsProPersist) {
      await setLandingPageProBySlug(slug, true);
      page = { ...updated, is_pro: true };
    }
    return NextResponse.json({ ok: true, created: false, page });
  }

  try {
    let created = await createLandingPage({
      user_id: userId,
      title,
      slug,
      template_type: templateType,
      content_json: normalized,
    });
    if (needsProPersist) {
      await setLandingPageProBySlug(slug, true);
      created = { ...created, is_pro: true };
    }
    return NextResponse.json(
      { ok: true, created: true, page: created },
      { status: 201 }
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { error: "Slug sudah dipakai, pilih slug lain" },
        { status: 409 }
      );
    }
    throw error;
  }
}

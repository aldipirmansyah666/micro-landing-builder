import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { ZodError } from "zod";
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
  resolveTemplate,
  toInvitationContent,
} from "@/lib/invitation";
import { InvitationContentSchema } from "@/lib/validation/invitation";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Diturunkan dari sumber kanonis (seluruh id katalog + lawas + alias)
// agar penambahan template baru otomatis ikut tersimpan — tidak ada lagi
// allowlist hardcoded yang menolak template baru dengan 400.
const TEMPLATE_ALLOWLIST = new Set<string>([
  ...ALL_TEMPLATE_IDS,
  ...Object.keys(LEGACY_TEMPLATE_ALIASES),
]);

const MAX_CONTENT_BYTES = 512 * 1024; // 512KB

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
 * Format ZodError jadi satu string pesan yang mudah dibaca manusia
 * (bukan JSON mentah yang sulit dipahami pengguna akhir).
 */
function formatZodError(error: ZodError): string {
  const detail = error.issues
    .map((i) => {
      const path = i.path.length > 0 ? i.path.map(String).join(".") : "(root)";
      return `${path}: ${i.message}`;
    })
    .join("; ");
  return `Konten tidak valid — ${detail}`;
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

  /**
   * 1. Normalisasi dulu lewat `toInvitationContent` — choke point yang
   *    sama dengan jalur baca (halaman publik / preview builder). Ini
   *    memetakan key legacy (`description`→`quote`, `date`→`akadDate`,
   *    `galleryUrls`→`galleryImages`, dst.) DAN menyANITASI seluruh URL
   *    via `safeHttpUrl()` (hanya http/https; `javascript:`/`data:` dibuang).
   *
   * 2. Baru divalidasi strukturnya dengan `InvitationContentSchema.safeParse`
   *    — format tanggal/jam, enum zona waktu, batas array, panjang string,
   *    dan format nomor rekening semuanya diperiksa di satu tempat.
   *
   * Karena sanitasi URL sudah terjadi di langkah 1, URL berbahaya tidak
   * pernah mencapai storage — ia dikosongkan lebih dulu, bukan disimpan.
   * Ini defense-in-depth: bahkan bila validasi Zod dilewati di masa
   * depan, jalur baca (`toInvitationContent`) tetap menyaring.
   */
  const normalized = toInvitationContent(contentJson);
  const parsed = InvitationContentSchema.safeParse(normalized);
  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 }
    );
  }
  // Hanya objek yang sudah lolos Zod yang boleh disentuh penyimpanan.
  // `parsed.data` dijamin lengkap (field opsional terisi default) dan
  // bebas key asing (z.object membuang key yang tidak dideklarasikan).
  const validated = parsed.data;

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
  const entitlementError = checkSaveEntitlements({
    isPro: proAccess,
    templateType,
    galleryCount: validated.galleryImages.length,
    hasBacksound: validated.backsoundUrl.trim() !== "",
    hasCustomContent:
      validated.greeting !== undefined ||
      validated.closingNote !== undefined ||
      validated.stories !== undefined,
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
   * diberikan lewat admin/bypass, `is_pro = true` ikut dipersistikan pada
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
      contentJson: validated,
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
      content_json: validated,
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

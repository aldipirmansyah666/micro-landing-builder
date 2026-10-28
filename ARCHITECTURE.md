# NikahYuk — Arsitektur & Workflow

Dokumen ringkas arsitektur project: alur user, sistem freemium, dan alur upgrade PRO.

**Stack singkat:** Next.js 16 (App Router, `proxy.ts` = Clerk middleware) · TypeScript + Zod · PostgreSQL (Supabase/Neon, akses **postgres.js raw SQL**, RLS mati — otorisasi di lapisan app) · Clerk (auth email) · Supabase Storage (bucket `uploads`) · Midtrans Snap (pembayaran).

> Catatan: yang mengirim webhook adalah **Midtrans** (bukan Supabase) — webhook itu menulis ke tabel Postgres `landing_pages.is_pro`.

---

## 1. Alur Utama (User Journey)

```
Sign-up/Sign-in (Clerk)
   ↓  proxy.ts → clerkMiddleware guard /dashboard, /api
Dashboard /dashboard
   ↓  "Buat Undangan Baru" → /dashboard/builder/new
Editor (wizard 7 langkah atau editor bebas)
   ↓  Simpan → POST /api/pages/save → baris landing_pages (is_pro=false, Free)
   ↓  (opsional) Upgrade PRO
   ↓  Simpan ulang dengan template PRO / fitur PRO
Halaman publik /p/<slug>  ← siap dibagikan (URL langsung hidup)
```

| Tahap | File | Catatan |
|---|---|---|
| Auth | `proxy.ts`, `app/(auth)/sign-in\|sign-up` | Middleware hanya meneruskan; cek sesi ada di tiap route/halaman (`auth()`) |
| Draf baru | `app/(auth)/dashboard/builder/[id]/page.tsx` → `BuilderClient.tsx` | Mode `new` vs `edit`; slug dibuat saat **pertama kali disimpan** (`savedSlug`) |
| Validasi simpan | `app/api/pages/save/route.ts` | 5 langkah: auth → validasi dasar (slug/judul/template/512KB) → **`toInvitationContent()`** (sanitasi URL + migrasi key legacy) → **Zod** `InvitationContentSchema` → **entitlement check** → INSERT/UPDATE. Simpan ulang = upsert (slug unik, 409 bila bentrok) |
| Data konten | `lib/invitation.ts` (`toInvitationContent`) | **Satu choke point** baca/tulis — semua pembaca (DB, draft localStorage, halaman publik) wajib lewat sini |
| Publish | *tidak ada tombol terpisah* | Halaman **otomatis publik** begitu baris ada di `landing_pages` — `/p/[slug]` langsung bisa dibuka; `is_pro` menentukan versi yang dirender |
| Halaman publik | `app/(public)/p/[slug]/page.tsx` | `getLandingPageBySlug` → `toInvitationContent` → **`applyRenderEntitlements(content, is_pro)`** → `effectiveTemplate()` → render template |
| Upload media | `app/api/upload/route.ts` → Supabase Storage bucket `uploads` (public read) | |

---

## 2. Alur Freemium & Pembatasan Fitur

**Satu sumber kebenaran:** kolom `landing_pages.is_pro` (boolean) + override `hasProAccess()` untuk admin/allowlist.

**Pembatasan ditekan di 3 lapis** (`lib/entitlements.ts`):

| Lapis | Fungsi | Kapan jalan |
|---|---|---|
| **1. Simpan** (gate utama) | `checkSaveEntitlements()` → `403` + pesan | `save/route.ts`: template ≠ `aruna`, galeri > 5, backsound, atau konten PRO (greeting/closing/stories) saat status Free |
| **2. Render publik** (defense-in-depth) | `applyRenderEntitlements()` | `/p/[slug]`: paksa `backsoundUrl=""`, potong galeri ke 5, buang `greeting/closingNote/stories` — walau DB punya data PRO |
| **3. Template efektif** | `effectiveTemplate()` | Free **selalu** dirender sebagai **Aruna** (`FREE_TEMPLATE_ID`), apa pun `template_type` di DB |

**Konstanta:** `FREE_TEMPLATE_ID = "aruna"` · galeri Free 5 / PRO 12 · `Plan = "free" | "pro"`.

**Override (bukan paywall otomatis):** `hasProAccess({isPro, isAdmin, email})` — halaman sudah PRO **atau** role `admin` **atau** email di `PRO_BYPASS_EMAILS`. Bila bypass dipakai, save-route **persist `is_pro = true` ke DB** agar dashboard, render publik, dan checkout (`alreadyPro`) konsisten.

**Di UI (builder):** `isPro = plan === "pro"` → panel Love Story/Backsound diganti kartu terkunci + `UpgradeProButton`; dropdown template menandai `• PRO`; memilih template PRO memicu **`ProTemplateInfoModal`** (preview tetap jalan, simpan/publish yang diblokir — "preview bebas, simpan butuh PRO").

---

## 3. Alur Upgrade & Pembayaran (Midtrans)

```
[Modal] "Upgrade Sekarang (Rp 49.000)"
   ↓ POST /api/checkout/pro  {slug}
   1. auth Clerk → cek halaman milik user → sudah PRO? → alreadyPro
   2. amount = env PRO_PRICE_IDR · provider = MIDTRANS_SERVER_KEY ? midtrans : xendit
   3. INSERT orders (status='pending')  ← otoritatif utk webhook
   4. POST Snap /snap/v1/transactions → { token, redirect_url }
   ↓ respons { order_id, snap_token, client_key, payment_url }
[Browser] loadSnap.js → snap.pay(token)  (fallback: buka redirect_url di tab baru)
   ↓ user bayar (VA/QRIS/Kartu)
Midtrans → onSuccess/onPending callback
   ↓ polling /api/user?slug= (6×1,5s) + router.refresh()  [feedback UI]
Midtrans → POST /api/webhook/payment  (atau alias /api/webhooks/midtrans)
```

**Backend (`app/api/checkout/pro/route.ts`):**

- `GET` = info harga/provider/client_key untuk modal (tanpa login).
- `POST` = `order_id` = `ORDER-<userId>-<timestamp>` · `gross_amount` number bulat · email dari Clerk · Basic auth `base64(key+":")` · fail-fast key sandbox/produksi salah · **origin redirect dari env** (`NEXT_PUBLIC_APP_URL`), bukan header Host.
- `callbacks.finish = /dashboard?upgraded=<slug>` (konsisten dengan Xendit).

**Webhook (`app/api/webhook/payment/route.ts` — kanonis; alias `app/api/webhooks/midtrans/route.ts` hanya menerus):**

1. Verifikasi `signature_key` SHA-512 = sha512(order_id + status_code + gross_amount + serverKey), **fail-closed** 401.
2. `capture` hanya dihitung bila `fraud_status = accept`.
3. Status **bukan** bayar (`pending/cancel/expire/deny`) → **dicatat ke `orders.status`** (`recordOrderStatus`, baris `paid` tak bisa diturunkan) lalu diakui `200 {ok, ignored}` → retry berhenti.
4. Status **`settlement`/`capture`** →:
   - Slug diambil **hanya dari `orders.page_slug`** (catatan checkout) — `custom_field1`/`metadata` sengaja diabaikan (tidak ditandatangani = vektor manipulasi).
   - Cek nominal ≥ `PRO_PRICE_IDR` (fail-closed 503 / underpay 402).
   - `upsertPaidOrder()` (idempoten ON CONFLICT) → **`setLandingPageProBySlug(slug, true)`** → `landing_pages.is_pro = true`.
   - Gagal upgrade → **500** agar Midtrans retry (idempoten).

**Feedback pasca-bayar:** redirect `?upgraded=<slug>` → `dashboard/page.tsx` (validasi slug milik user) → **`UpgradedBanner`** polling `/api/user` → sukses: hijau + "Buka Editor" + sync Clerk/router; belum sampai: "Sedang diproses" + tombol muat ulang. Pendukung: `useProStatus` (polling), `ProStatusSync` (bfcache/visibility), dan bila Snap `onSuccess` → modal sendiri polling 12 detik lalu `activated` → tutup.

---

## Peta File Cepat

```
proxy.ts                          Clerk middleware
lib/invitation.ts                 Model konten + toInvitationContent (choke point)
lib/validation/invitation.ts      Zod schema (draft & strict)
lib/entitlements.ts               Free/PRO: checkSave, applyRender, hasProAccess
lib/db.ts                         postgres.js: pages, orders (createPending/upsertPaid/recordOrderStatus)
lib/templates.ts                  Registry 18 template katalog + legacy

app/api/pages/save/route.ts       Simpan draf/konten + gate entitlement
app/api/checkout/pro/route.ts     Order + token Midtrans Snap
app/api/webhook/payment/route.ts  Verifikasi signature → is_pro=true (+alias webhooks/midtrans)
app/api/user/route.ts             Status PRO untuk polling UI

app/(auth)/dashboard/…            Dashboard + BuilderClient (editor + modal PRO)
components/billing/               useProCheckout, UpgradeProModal, UpgradedBanner, ProStatusSync
app/(public)/p/[slug]/page.tsx    Halaman publik (entitlement saat render)
supabase/schema.sql               Skema DB (users, landing_pages, orders, wishes, guests)
```

---

## Env Wajib (ringkas)

Lihat `.env.example` untuk daftar lengkap. Yang menentukan alur di atas:

- `PRO_PRICE_IDR` — nominal upgrade (wajib; tanpa ini checkout 501 & webhook tolak 503, fail-closed).
- `MIDTRANS_SERVER_KEY` + `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` — provider aktif; `MIDTRANS_IS_PRODUCTION=true/false` menentukan sandbox/produksi.
- `NEXT_PUBLIC_APP_URL` / `APP_URL` — origin tepercaya redirect pembayaran.
- `XENDIT_SECRET_KEY` + `XENDIT_CALLBACK_TOKEN` — fallback provider kedua.
- `PRO_BYPASS_EMAILS` — allowlist akses PRO tanpa bayar (kosongkan di production).

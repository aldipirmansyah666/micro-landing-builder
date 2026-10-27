import type { NextConfig } from "next";

/**
 * Host frontend API Clerk, diturunkan dari publishable key.
 *
 * Format publishable key: `pk_{test|live}_{base64("<frontendApi>$")}`
 * contoh → base64("example.clerk.accounts.dev$")
 *
 * CSP wajib mengizinkan host ini: Clerk memuat `clerk.browser.js` dari
 * host tersebut saat runtime, jadi tanpa host yang tepat seluruh
 * halaman /sign-in dan /sign-up tidak akan ter-hydrate.
 *
 * Dikembalikan `null` bila env tidak tersedia (mis. build tanpa env) —
 * CSP lalu memakai host cadangan.
 */
function clerkFrontendApiHost(): string | null {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  if (!pk) return null;
  const parts = pk.split("_");
  if (parts.length < 3) return null;
  try {
    const decoded = Buffer.from(parts.slice(2).join("_"), "base64").toString(
      "utf8"
    );
    const host = decoded.split("$")[0]?.trim();
    return host || null;
  } catch {
    return null;
  }
}

const isDev = process.env.NODE_ENV !== "production";

/** Host yang boleh memuat/mengakses script Clerk (UI, telemetry, avatar). */
const CLERK_HOSTS = [
  clerkFrontendApiHost(),
  "clerk.com",
  "*.clerk.com",
  "*.clerk.accounts.dev",
  "clerk-telemetry.com",
  "img.clerk.com",
].filter((h): h is string => !!h);

/** Supabase Storage — bucket publik `uploads` (foto cover, galeri, audio). */
const SUPABASE_HOSTS = ["*.supabase.co", "*.supabase.in"];

/** Payment gateway (dipanggil dari server; diizinkan agar embed Snap mungkin). */
const PAYMENT_HOSTS = [
  "app.midtrans.com",
  "app.sandbox.midtrans.com",
  "api.xendit.co",
];

/** Cloudflare Turnstile — CAPTCHA anti-bot yang dipakai Clerk saat sign-up. */
const CAPTCHA_HOSTS = ["challenges.cloudflare.com"];

/**
 * Embed iframe pihak ketiga yang diizinkan di halaman undangan:
 * - Google Maps Embed (`google.com/maps/embed?pb=...` / `maps.google.com`)
 *   dipakai tombol & preview lokasi acara.
 * - YouTube / YouTube-nocookie dipakai pemutar musik & video undangan
 *   (privacy-enhanced mode `youtube-nocookie.com` diprioritaskan bila
 *   tersedia).
 *
 * Sengaja dibatasi host eksplisit (dengan skema https) — bukan wildcard
 * `https:` — agar CSP tetap menjadi allowlist ketat: hanya iframe yang
 * memang dibutuhkan tema undangan yang boleh dimuat.
 */
const EMBED_FRAME_HOSTS = [
  "https://www.google.com",
  "https://maps.google.com",
  "https://www.youtube.com",
  "https://www.youtube-nocookie.com",
];

/**
 * Content-Security-Policy.
 *
 * CATATAN PENTING soal `script-src 'unsafe-inline'`:
 * Next.js App Router menyuntik `<script>` inline (RSC payload + hydration)
 * dan aplikasi memakai React inline style (`style={{...}}`). Tanpa
 * 'unsafe-inline' hydration gagal total. Konsekuensinya: CSP ini
 * memblokir skrip eksternal, plugin, clickjacking, dan base-tag hijack,
 * TETAPI belum memblokir URL `javascript:` pada `href`.
 *
 * Untuk menutup celah `javascript:` secara penuh, lanjutkan ke CSP
 * berbasis nonce di `middleware.ts` (nonce per-request + 'strict-dynamic')
 * — lihat catatan di bagian bawah file ini.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // 'unsafe-eval' hanya untuk dev (Turbopack/webpack HMR).
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${[
    ...CLERK_HOSTS,
    ...CAPTCHA_HOSTS,
    ...PAYMENT_HOSTS,
  ].join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  // Pengguna boleh menempel URL foto/backsound sendiri dari host mana pun
  // (lihat safeHttpUrl di lib/invitation.ts) — makanya host-wide https:
  // diizinkan, bukan hanya Supabase.
  "img-src 'self' blob: data: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${[
    ...SUPABASE_HOSTS,
    ...CLERK_HOSTS,
    ...PAYMENT_HOSTS,
    ...CAPTCHA_HOSTS,
  ].join(" ")}`,
  `frame-src 'self' ${[
    ...PAYMENT_HOSTS,
    ...CAPTCHA_HOSTS,
    ...EMBED_FRAME_HOSTS,
    "*.clerk.accounts.dev",
  ].join(" ")}`,
  // Cegah plugin/embed (flash, pdf, java) & base-tag hijacking.
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Anti-clickjacking (lapis kedua setelah X-Frame-Options).
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  // Cegah browser menebak-nebak tipe konten (MIME sniffing) — penting
  // karena bucket Storage melayani file user.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Anti-clickjacking: halaman dashboard/builder tidak boleh di-embed
  // situs lain (SAMEORIGIN masih mengizinkan embed oleh dirinya sendiri).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Jangan kirim path + query lengkap ke origin lain. Query `?to=Nama`
  // pada halaman undangan memuat identitas tamu — referrer penuh ke
  // host pihak ketiga (mis. CDN foto) harus dihindari.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Matikan API perangkat yang tidak dipakai (kamera/mic/geolokasi).
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  images: {
    // Gambar undangan berasal dari Supabase Storage publik (atau URL tempel
    // user) dan di-render via <img> biasa (SafeImg). remotePatterns di bawah
    // mengizinkan host Supabase bila suatu saat ada komponen yang memakai
    // next/image.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

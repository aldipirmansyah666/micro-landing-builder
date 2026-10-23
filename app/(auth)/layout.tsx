import { Suspense, type ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ProStatusSync } from "@/components/billing/ProStatusSync";

/**
 * Layout untuk area yang MEMBUTUHKAN autentikasi Clerk.
 *
 * Berisi `<ClerkProvider>` yang SENGaja dipindahkan keluar dari root
 * layout. Dengan begitu halaman publik (`app/(public)/*`) — terutama
 * halaman tamu `/p/[slug]` — tidak ikut menarik runtime Clerk client
 * (±170 KB) ke bundle first-load-nya.
 *
 * Semua rute di bawah sini memakai UI Clerk (`<SignIn>`, `<SignUp>`,
 * `<UserButton>`) atau butuh sesi aktif, jadi provider wajib ada di
 * scope paling kecil yang membutuhkannya.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      {/* `usePathname()` hanya tersedia saat runtime — Suspense mencegah
          halaman auth (sign-in/sign-up) gagal di-prerender. */}
      <Suspense fallback={null}>
        <ProStatusSync />
      </Suspense>
      {children}
    </ClerkProvider>
  );
}

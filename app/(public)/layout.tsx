import type { ReactNode } from "react";

/**
 * Layout untuk area PUBLIK (landing page + halaman undangan tamu).
 *
 * SENGAJA TIDAK memuat `<ClerkProvider>`.
 *
 * Almondanan: halaman undangan `/p/[slug]` dibuka setiap tamu, sering di
 * perangkat seluler dengan koneksi lambat. `<ClerkProvider>` menarik
 * runtime Clerk client (±170 KB) ke bundle first-load setiap rute di
 * bawah layout ini — padahal Halaman tamu tidak memakai satu pun
 * komponen Clerk. Dengan memisahkannya, rute publik hanya memuat
 * React + Next runtime + chunk template yang dipakai (±19 KB gzip).
 *
 * Route handler di `app/api/*` TIDAK diletakkan di grup ini: route
 * handler tidak memakai layout sama sekali, dan webhook pembayaran
 * tidak boleh berada di bawah ClerkProvider.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

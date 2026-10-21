import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NikahYuk — Buat Undangan Digital Pernikahan Mewah & Elegan",
  description:
    "Platform pembuat undangan digital pernikahan otomatis dengan 18+ pilihan template premium, musik latar, RSVP real-time, galeri foto, dan lokasi Google Maps.",
};

/**
 * Root layout — HANYA membawa hal yang benar-benar global:
 * tag HTML, font, dan stylesheet global.
 *
 * `<ClerkProvider>` SENGAJA TIDAK ada di sini. Provider itu memuat
 * runtime Clerk client (±170 KB) ke bundle first-load SETIAP rute di
 * bawahnya — termasuk halaman tamu `/p/[slug]` yang sama sekali tidak
 * memakai Clerk.
 *
 * Provider dipindah ke scope paling sempit yang membutuhkannya:
 * - `app/(auth)/layout.tsx` → sign-in, sign-up, dashboard, admin
 * - `app/(public)/layout.tsx` → landing page & halaman tamu (tanpa Clerk)
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

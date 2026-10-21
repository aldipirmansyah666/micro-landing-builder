"use client";

import { useEffect } from "react";

/**
 * Error boundary paling atas (render menggantikan seluruh root layout).
 *
 * KEAMANAN: pesan error mentah (message/stack) TIDAK pernah dirender ke
 * pengguna — isinya bisa membocorkan path server, nama host, query SQL,
 * atau struktur internal aplikasi. Yang ditampilkan ke pengguna hanya
 * pesan generik + kode referensi (`error.digest`) yang cocok dengan log
 * server, sehingga tim bisa melacak insiden tanpa membuka detail sistem
 * ke publik.
 *
 * Detail lengkap tetap masuk ke log server (Vercel/Cloudflare logs).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log server-side saja — satu-satunya tempat detail error terekspos.
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="id">
      <body>
        <div
          style={{
            margin: "0 auto",
            maxWidth: 480,
            minHeight: "50vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 32,
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h2>Terjadi kesalahan sistem</h2>
          <p style={{ fontSize: 14, opacity: 0.7 }}>
            Silakan muat ulang halaman. Jika masalah berlanjut, hubungi admin
            {error?.digest ? ` dan sebutkan kode ${error.digest}` : "."}
          </p>
          <button onClick={() => reset()}>Coba lagi</button>
        </div>
      </body>
    </html>
  );
}

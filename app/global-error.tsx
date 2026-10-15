"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
            {error?.message || "Silakan muat ulang halaman."}
          </p>
          <button onClick={() => reset()}>Coba lagi</button>
        </div>
      </body>
    </html>
  );
}

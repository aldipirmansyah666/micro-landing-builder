import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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

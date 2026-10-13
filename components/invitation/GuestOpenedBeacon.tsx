"use client";

import { useEffect } from "react";

/** Fire-and-forget: catat pembuka undangan berdasarkan ?to= (sekali per mount). */
export function GuestOpenedBeacon({ slug, name }: { slug: string; name: string }) {
  useEffect(() => {
    if (!slug || !name) return;
    fetch("/api/guests/opened", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, name }),
    }).catch(() => {});
  }, [slug, name]);
  return null;
}

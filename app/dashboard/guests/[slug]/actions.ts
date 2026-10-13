"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  addGuest,
  deleteGuestById,
  deleteWishById,
  getLandingPageByUserAndSlug,
} from "@/lib/db";

async function requireOwner(userId: string | null, slug: string) {
  if (!userId) throw new Error("Unauthorized: silakan login terlebih dahulu");
  const page = await getLandingPageByUserAndSlug(userId, slug);
  if (!page) throw new Error("Landing page tidak ditemukan");
  return page;
}

export async function addGuestAction(slug: string, name: string, phone: string) {
  const { userId } = await auth();
  await requireOwner(userId, slug);
  const cleanName = name.trim().slice(0, 100);
  if (!cleanName) throw new Error("Nama tamu wajib diisi");
  await addGuest({ page_slug: slug, name: cleanName, phone: phone.trim().slice(0, 30) });
  revalidatePath(`/dashboard/guests/${slug}`);
}

export async function deleteGuestAction(slug: string, id: number) {
  const { userId } = await auth();
  await requireOwner(userId, slug);
  const ok = await deleteGuestById(id, slug);
  if (!ok) throw new Error("Tamu tidak ditemukan");
  revalidatePath(`/dashboard/guests/${slug}`);
}

export async function deleteWishAction(slug: string, id: number) {
  const { userId } = await auth();
  await requireOwner(userId, slug);
  const ok = await deleteWishById(id, slug);
  if (!ok) throw new Error("Ucapan tidak ditemukan");
  revalidatePath(`/dashboard/guests/${slug}`);
}

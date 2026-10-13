"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deleteLandingPage } from "@/lib/db";

export async function deleteLandingPageAction(slug: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized: silakan login terlebih dahulu");

  const deleted = await deleteLandingPage(userId, slug);
  if (!deleted) throw new Error("Landing page tidak ditemukan");

  revalidatePath("/dashboard");
}

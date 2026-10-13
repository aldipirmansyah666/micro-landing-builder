"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isAdmin, toggleProStatus } from "@/lib/db";

export async function toggleProAction(slug: string, isPro: boolean) {
  const { userId } = await auth();
  if (!userId || !(await isAdmin(userId))) {
    throw new Error("Forbidden: hanya admin yang bisa mengubah status Pro");
  }

  const ok = await toggleProStatus(slug, isPro);
  if (!ok) throw new Error("Landing page tidak ditemukan");

  revalidatePath("/admin");
}

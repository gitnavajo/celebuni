"use server";

import { redirect } from "next/navigation";

export async function searchAction(formData: FormData) {
  const q = String(formData.get("q") ?? "").trim();
  if (!q) return;
  redirect(`/search/${encodeURIComponent(q)}`);
}


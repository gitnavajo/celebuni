"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";

function requiredString(fd: FormData, key: string) {
  const v = String(fd.get(key) ?? "").trim();
  if (!v) throw new Error(`Missing ${key}`);
  return v;
}

export async function createPostAction(formData: FormData) {
  // MVP placeholder: with current RLS, this will fail for anon.
  // Once admin write policies exist, this action can be enabled.
  const title = requiredString(formData, "title");
  const slug = requiredString(formData, "slug");
  const content = requiredString(formData, "content");
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const author = String(formData.get("author") ?? "").trim() || null;

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("blog_posts").insert({
    title,
    slug,
    content,
    excerpt,
    author,
    published_at: new Date().toISOString(),
  });

  if (error) {
    // Keep it simple for MVP: redirect back with a query flag.
    redirect(`/blog/admin?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/blog/${encodeURIComponent(slug)}`);
}


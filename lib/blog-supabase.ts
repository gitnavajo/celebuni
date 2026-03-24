import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type BlogRow = Database["public"]["Tables"]["blog_posts"]["Row"];

function minutesToRead(markdown: string) {
  const words = (markdown || "")
    .replace(/[`*_>#\-\n\r]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const getBlogPosts = cache(async () => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw error;

  const posts = (data ?? []) as BlogRow[];
  return posts.map((p) => ({
    ...p,
    readTimeMinutes: minutesToRead(p.content),
  }));
});

export const getBlogPostBySlug = cache(async (slug: string) => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const post = data as BlogRow;
  return {
    ...post,
    readTimeMinutes: minutesToRead(post.content),
  };
});


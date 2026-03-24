import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type { BlogFrontmatter, BlogPost, BlogPostSummary } from "@/types/blog";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

function safeReadDir(dir: string) {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

export function getAllPostSlugs() {
  return safeReadDir(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllPosts(): BlogPostSummary[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map((slug) => {
      const fullPath = path.join(POSTS_DIR, `${slug}.md`);
      const raw = fs.readFileSync(fullPath, "utf8");
      const parsed = matter(raw);
      const fm = parsed.data as Partial<BlogFrontmatter>;
      if (!fm.title || !fm.date) return null;
      const post: BlogPostSummary = {
        slug,
        title: String(fm.title),
        date: String(fm.date),
        ...(fm.excerpt ? { excerpt: String(fm.excerpt) } : {}),
      };
      return post;
    })
    .filter((p): p is BlogPostSummary => Boolean(p));

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf8");
  const parsed = matter(raw);
  const fm = parsed.data as Partial<BlogFrontmatter>;
  if (!fm.title || !fm.date) return null;

  const processed = await remark().use(html).process(parsed.content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: String(fm.title),
    date: String(fm.date),
    excerpt: fm.excerpt ? String(fm.excerpt) : undefined,
    contentHtml,
  };
}


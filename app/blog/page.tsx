import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts } from "@/lib/blog-supabase";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog",
  description: "Evergreen guides for fan mail, conventions, and celebrity fandom.",
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Blog
        </h1>
        <div className="flex items-center gap-4">
          <Link href="/blog/admin" className="text-sm text-white/70 hover:text-white">
            Admin (MVP)
          </Link>
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            Back to search
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`}>
            <Card className="bg-white/5 p-5 transition hover:bg-white/10">
              <div className="flex items-center justify-between gap-3">
                <div className="text-base font-medium text-white">{p.title}</div>
                <Badge className="bg-white/10 text-white/80">
                  {formatDate(p.published_at ?? p.created_at)}
                </Badge>
              </div>
              {p.excerpt ? (
                <div className="mt-2 text-sm text-white/70">{p.excerpt}</div>
              ) : null}
              <div className="mt-3 text-xs text-white/50">
                {p.readTimeMinutes} min read
              </div>
            </Card>
          </Link>
        ))}

        {!posts.length ? (
          <Card className="bg-white/5 p-5">
            <div className="text-sm text-white/70">
              No posts yet. Seed posts in Supabase or add them via the admin placeholder.
            </div>
          </Card>
        ) : null}
      </div>
    </main>
  );
}


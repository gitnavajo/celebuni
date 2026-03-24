import Link from "next/link";
import { getBlogPosts } from "@/lib/blog-supabase";
import { BlogCard } from "@/components/ui/blog-card";
import { Starfield } from "@/components/ui/starfield";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog",
  description: "Evergreen guides for fan mail, conventions, and celebrity fandom.",
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Starfield />

      <main className="relative z-10">
        {/* Header Section */}
        <header className="border-b border-white/10 bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl text-balance">
              Cosmic Blog
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/70 leading-relaxed">
              Evergreen guides for fan mail, conventions, and celebrity fandom.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Link href="/blog/admin" className="text-sm text-white/50 hover:text-white">
                Admin (MVP)
              </Link>
              <Link href="/" className="text-sm text-white/50 hover:text-white">
                Back to search
              </Link>
            </div>
          </div>
        </header>

        {/* Blog Grid */}
        <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((p) => (
              <BlogCard
                key={p.slug}
                title={p.title}
                excerpt={p.excerpt || "No excerpt available."}
                date={formatDate(p.published_at ?? p.created_at)}
                slug={p.slug}
              />
            ))}
          </div>
          
          {!posts.length ? (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70">
              No posts yet. Seed posts in Supabase or add them via the admin placeholder.
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

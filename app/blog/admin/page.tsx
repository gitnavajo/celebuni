import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createPostAction } from "@/app/actions/blog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog admin (MVP)",
  robots: { index: false, follow: false },
};

export default function BlogAdminPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Blog admin (MVP placeholder)
        </h1>
        <Link href="/blog" className="text-sm text-white/70 hover:text-white">
          Back to blog
        </Link>
      </div>

      <Card className="mt-6 bg-white/5 p-6">
        <div className="text-sm text-white/70">
          This is a simple form UI for later. Writes are blocked by RLS until we
          add authenticated admin policies.
        </div>
        <Separator className="my-5 bg-white/10" />

        <form action={createPostAction} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-white/80">Title</label>
            <Input
              name="title"
              placeholder="How to Send Fan Mail Successfully"
              className="bg-white/5 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80">Slug</label>
            <Input
              name="slug"
              placeholder="how-to-send-fan-mail-successfully"
              className="bg-white/5 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80">Excerpt</label>
            <Input
              name="excerpt"
              placeholder="A practical, respectful checklist that gets replies."
              className="bg-white/5 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80">Author</label>
            <Input
              name="author"
              placeholder="CelebUni Team"
              className="bg-white/5 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80">Markdown content</label>
            <textarea
              name="content"
              placeholder="# Heading\n\nWrite your post here..."
              className="min-h-56 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
            />
          </div>

          <Button type="submit" className="bg-violet-500 text-white hover:bg-violet-400">
            Create post (disabled until admin writes)
          </Button>
        </form>
      </Card>
    </main>
  );
}


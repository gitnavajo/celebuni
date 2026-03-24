import Link from "next/link";
import { SearchHero } from "@/components/search/search-hero";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            <span className="text-white">Celeb</span>
            <span className="text-white/70">Uni</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/blog"
              className="text-sm text-white/80 hover:text-white"
            >
              Blog
            </Link>
            <Badge variant="secondary" className="bg-white/10 text-white/80">
              MVP
            </Badge>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6">
        <SearchHero />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Card className="cosmic-glow bg-white/5 p-5">
            <div className="text-sm font-medium text-white">Bio + link</div>
            <div className="mt-2 text-sm text-white/70">
              Clean MVP launch: a solid bio and one official link goes a long way.
            </div>
          </Card>
          <Card className="cosmic-glow bg-white/5 p-5">
            <div className="text-sm font-medium text-white">
              Convention appearances
            </div>
            <div className="mt-2 text-sm text-white/70">
              Optional for MVP, but ready when you want it.
            </div>
          </Card>
          <Card className="cosmic-glow bg-white/5 p-5">
            <div className="text-sm font-medium text-white">Fan mail</div>
            <div className="mt-2 text-sm text-white/70">
              Verified address placeholder (future verification workflow).
            </div>
          </Card>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 py-10 text-xs text-white/50">
        Built for a cosmic-dark MVP. No paid API keys required.
      </footer>
    </div>
  );
}

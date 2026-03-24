import Image from "next/image";
import type { TmdbCombinedCredits, TmdbCredit } from "@/types/tmdb";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function titleOf(c: TmdbCredit) {
  return c.title || c.name || "Untitled";
}

function yearOf(c: TmdbCredit) {
  const raw = c.release_date || c.first_air_date;
  if (!raw) return "";
  return raw.slice(0, 4);
}

function posterUrl(posterPath: string | null | undefined) {
  if (!posterPath) return null;
  return `https://image.tmdb.org/t/p/w342${posterPath}`;
}

function pickTopCredits(credits: TmdbCombinedCredits, limit = 12) {
  return credits.cast
    .map((c) => {
      const date = c.release_date || c.first_air_date || "";
      const score = (c.vote_average ?? 0) * 10 + (date ? 1 : 0);
      return { c, date, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.date || "").localeCompare(a.date || "");
    })
    .slice(0, limit)
    .map((x) => x.c);
}

export function FilmographyGrid({
  credits,
}: {
  credits: TmdbCombinedCredits | null;
}) {
  if (!credits) {
    return (
      <div className="text-sm text-white/70">
        Filmography unavailable (missing TMDb link).
      </div>
    );
  }

  const items = pickTopCredits(credits, 12);
  if (!items.length) {
    return (
      <div className="text-sm text-white/70">
        No filmography returned by TMDb for this person.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => {
        const poster = posterUrl(c.poster_path);
        return (
          <Card key={`${c.media_type ?? "unknown"}-${c.id}`} className="bg-white/5 p-3">
            <div className="flex gap-3">
              <div className="relative h-16 w-12 overflow-hidden rounded-md border border-white/10 bg-white/5">
                {poster ? (
                  <Image
                    src={poster}
                    alt={titleOf(c)}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-white">
                  {titleOf(c)}
                </div>
                <div className="mt-0.5 text-xs text-white/60">
                  {yearOf(c) || "—"} · {c.character || "—"}
                </div>
                <div className="mt-2">
                  <Badge className="bg-white/10 text-white/80">
                    {c.media_type ?? "—"}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}


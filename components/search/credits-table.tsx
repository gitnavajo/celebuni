import type { TmdbCombinedCredits, TmdbCredit } from "@/types/tmdb";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function titleOf(c: TmdbCredit) {
  return c.title || c.name || "Untitled";
}

function yearOf(c: TmdbCredit) {
  const raw = c.release_date || c.first_air_date;
  if (!raw) return "";
  return raw.slice(0, 4);
}

function pickTopCredits(credits: TmdbCombinedCredits, limit = 10) {
  const scored = credits.cast
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

  return scored;
}

export function CreditsTable({ credits }: { credits: TmdbCombinedCredits }) {
  const rows = pickTopCredits(credits, 12);

  if (!rows.length) {
    return (
      <div className="text-sm text-white/70">
        No credits available from TMDb for this entry.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead className="text-white/70">Title</TableHead>
            <TableHead className="text-white/70">Year</TableHead>
            <TableHead className="text-white/70">Role</TableHead>
            <TableHead className="text-right text-white/70">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((c) => (
            <TableRow key={`${c.media_type ?? "unknown"}-${c.id}`}>
              <TableCell className="font-medium text-white">
                {titleOf(c)}
              </TableCell>
              <TableCell className="text-white/70">{yearOf(c)}</TableCell>
              <TableCell className="text-white/70">
                {c.character || c.job || "—"}
              </TableCell>
              <TableCell className="text-right">
                <Badge className="bg-white/10 text-white/80">
                  {c.media_type ?? "—"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


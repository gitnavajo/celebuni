import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase";
import { FanMailCard } from "@/components/search/fan-mail-card";
import type { Database } from "@/types/supabase";

type PageProps = {
  params: Promise<{ query: string }>;
};

function normalizeQuery(q: string) {
  return decodeURIComponent(q).trim();
}

function formatCategory(cat: string) {
  if (cat === "voice_actor") return "Voice Actor";
  if (cat === "actor") return "Actor";
  if (cat === "musician") return "Musician";
  return cat;
}

function isUpcoming(dateStr: string | null) {
  if (!dateStr) return false;
  const today = new Date();
  const d = new Date(dateStr + "T00:00:00");
  return d.getTime() >= new Date(today.toDateString()).getTime();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { query } = await params;
  const q = normalizeQuery(query);
  const supabase = createSupabaseServerClient();

  const { data: exact } = await supabase
    .from("celebrities")
    .select("name,slug,bio,category,official_url")
    .eq("slug", q)
    .maybeSingle();

  if (exact) {
    return {
      title: exact.name,
      description: exact.bio
        ? exact.bio.slice(0, 160)
        : exact.official_url
          ? `Official link and bio for ${exact.name}.`
          : `Profile for ${exact.name} on CelebUni.`,
      openGraph: {
        title: exact.name,
        description: exact.bio ? exact.bio.slice(0, 160) : undefined,
      },
    };
  }

  return {
    title: `Search: ${q}`,
    description: `Search results for ${q} on CelebUni.`,
  };
}

export default async function CelebritySearchPage({ params }: PageProps) {
  const { query } = await params;
  const q = normalizeQuery(query);
  if (!q) notFound();

  const supabase = createSupabaseServerClient();
  type CelebrityRow = Database["public"]["Tables"]["celebrities"]["Row"];
  type AppearanceRow = Database["public"]["Tables"]["appearances"]["Row"];
  type FanMailRow = Database["public"]["Tables"]["fan_mail_addresses"]["Row"];

  // 1) Prefer exact slug match
  const { data: exact, error: exactErr } = await supabase
    .from("celebrities")
    .select("*")
    .eq("slug", q)
    .maybeSingle();
  if (exactErr) throw exactErr;

  let list: CelebrityRow[] = [];
  if (exact) {
    list = [exact as CelebrityRow];
  } else {
    const { data: matches, error: matchErr } = await supabase
      .from("celebrities")
      .select("*")
      .ilike("name", `%${q}%`)
      .order("name", { ascending: true })
      .limit(12);
    if (matchErr) throw matchErr;
    list = (matches ?? []) as CelebrityRow[];
  }
  if (!list.length) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <Card className="bg-white/5 p-6">
          <div className="text-white">No celebrities found for “{q}”.</div>
          <div className="mt-2 text-sm text-white/70">
            Try searching by a full name, or use a known slug.
          </div>
          <div className="mt-5">
            <Link href="/" className="text-sm underline underline-offset-4 text-white/80 hover:text-white">
              Back to home
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  // If multiple matches, show a fast list of results first.
  // If only one match (or exact slug), show the full profile.
  if (!exact && list.length > 1) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Results for “{q}”
          </h1>
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            New search
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <Link key={c.id} href={`/search/${encodeURIComponent(c.slug)}`}>
              <Card className="bg-white/5 p-5 transition hover:bg-white/10">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-white font-medium">{c.name}</div>
                  <Badge className="bg-white/10 text-white/80">
                    {formatCategory(c.category)}
                  </Badge>
                </div>
                {c.bio ? (
                  <div className="mt-2 text-sm text-white/70 line-clamp-3">
                    {c.bio}
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-white/50">
                    Bio coming soon.
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </main>
    );
  }

  const celebrity = (exact ?? list[0]!) as CelebrityRow;

  const [{ data: appearancesRaw, error: appErr }, { data: fanMailRaw, error: fmErr }] =
    await Promise.all([
      supabase
      .from("appearances")
      .select("*")
      .eq("celebrity_id", celebrity.id)
      .order("event_date", { ascending: true, nullsFirst: false }),
      supabase
      .from("fan_mail_addresses")
      .select("*")
      .eq("celebrity_id", celebrity.id)
      .order("verified", { ascending: false })
      .order("last_updated", { ascending: false })
      .limit(1)
      .maybeSingle(),
    ]);
  if (appErr) throw appErr;
  if (fmErr) throw fmErr;

  const appearances = (appearancesRaw ?? []) as AppearanceRow[];
  const fanMail = (fanMailRaw ?? null) as FanMailRow | null;

  const upcoming = appearances.filter((a) => isUpcoming(a.event_date));
  const past = appearances.filter((a) => !isUpcoming(a.event_date)).reverse();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {celebrity.image_url ? (
              <Image
                src={celebrity.image_url}
                alt={celebrity.name}
                fill
                sizes="80px"
                className="object-cover"
                priority
              />
            ) : null}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                {celebrity.name}
              </h1>
              <Badge className="bg-white/10 text-white/80">
                {formatCategory(celebrity.category)}
              </Badge>
            </div>
            <div className="mt-1 text-sm text-white/60">/{celebrity.slug}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-white/10 text-white hover:bg-white/20" type="button">
            Add to favorites
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/5 p-5">
            <div className="text-sm font-medium text-white">Bio</div>
            <Separator className="my-4 bg-white/10" />
            <div className="text-sm leading-7 text-white/80 whitespace-pre-line">
              {celebrity.bio || "Bio coming soon."}
            </div>
          </Card>

          <Card className="bg-white/5 p-5">
            <div className="text-sm font-medium text-white">Official link</div>
            <Separator className="my-4 bg-white/10" />
            {celebrity.official_url ? (
              <a
                href={celebrity.official_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-violet-200 underline underline-offset-4 hover:text-violet-100"
              >
                {celebrity.official_url}
              </a>
            ) : (
              <div className="text-sm text-white/60">
                No link yet. Add <code className="text-white/80">official_url</code>{" "}
                in Supabase.
              </div>
            )}
          </Card>

          <Card className="bg-white/5 p-5">
            <div className="text-sm font-medium text-white">Conventions</div>
            <div className="mt-2 text-xs text-white/50">
              Upcoming first, then past.
            </div>
            <Separator className="my-4 bg-white/10" />

            <div className="space-y-6">
              <div>
                <div className="text-xs font-medium text-white/70">Upcoming</div>
                <div className="mt-2 rounded-xl border border-white/10">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-white/70">Event</TableHead>
                        <TableHead className="text-white/70">Date</TableHead>
                        <TableHead className="text-white/70">Location</TableHead>
                        <TableHead className="text-right text-white/70">Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(upcoming.length ? upcoming : []).map((a) => (
                        <TableRow key={a.id} className="border-white/10">
                          <TableCell className="text-white">
                            {a.url ? (
                              <a className="underline underline-offset-4" href={a.url} target="_blank" rel="noreferrer">
                                {a.event_name}
                              </a>
                            ) : (
                              a.event_name
                            )}
                          </TableCell>
                          <TableCell className="text-white/70">{a.event_date ?? "—"}</TableCell>
                          <TableCell className="text-white/70">{a.location ?? "—"}</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-white/10 text-white/80">{a.type}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!upcoming.length ? (
                        <TableRow className="border-white/10">
                          <TableCell className="text-white/60" colSpan={4}>
                            No upcoming appearances yet.
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-white/70">Past</div>
                <div className="mt-2 rounded-xl border border-white/10">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-white/70">Event</TableHead>
                        <TableHead className="text-white/70">Date</TableHead>
                        <TableHead className="text-white/70">Location</TableHead>
                        <TableHead className="text-right text-white/70">Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(past.length ? past : []).map((a) => (
                        <TableRow key={a.id} className="border-white/10">
                          <TableCell className="text-white">
                            {a.url ? (
                              <a className="underline underline-offset-4" href={a.url} target="_blank" rel="noreferrer">
                                {a.event_name}
                              </a>
                            ) : (
                              a.event_name
                            )}
                          </TableCell>
                          <TableCell className="text-white/70">{a.event_date ?? "—"}</TableCell>
                          <TableCell className="text-white/70">{a.location ?? "—"}</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-white/10 text-white/80">{a.type}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!past.length ? (
                        <TableRow className="border-white/10">
                          <TableCell className="text-white/60" colSpan={4}>
                            No past appearances yet.
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <FanMailCard
            name={celebrity.name}
            address={fanMail?.address ?? null}
            verified={fanMail?.verified ?? false}
            source={fanMail?.source ?? null}
            lastUpdated={fanMail?.last_updated ?? null}
          />

          <Card className="bg-white/5 p-5">
            <div className="text-sm font-medium text-white">More</div>
            <Separator className="my-4 bg-white/10" />
            <div className="text-sm text-white/70">
              Want to edit this profile? Admin write access will be added later.
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}


import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { trackViewAction } from "@/app/actions/tracking";

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

  // Track view
  await trackViewAction(celebrity.id);

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
      .order("last_updated", { ascending: false }),
    ]);

  if (appErr) throw appErr;
  if (fmErr) throw fmErr;

  const appearances = (appearancesRaw ?? []) as AppearanceRow[];
  const fanMailAddresses = (fanMailRaw ?? []) as FanMailRow[];
  const fanMail = fanMailAddresses[0] || null;

  return (
    <main className="min-h-screen bg-background">
      {/* Cosmic background effect */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>
      
      <div className="relative z-10 px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl mb-6 flex justify-between">
          <Link href="/" className="text-sm text-white/50 hover:text-white inline-flex items-center gap-2">
            &larr; Back to Search
          </Link>
          {celebrity.official_url && (
            <a href={celebrity.official_url} target="_blank" rel="noreferrer" className="text-sm text-white/50 hover:text-white">
              Official Website &#8599;
            </a>
          )}
        </div>

        {/* Profile Card */}
        <Card className="mx-auto max-w-5xl bg-white/5 border border-white/10 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {celebrity.image_url && (
              <div className="md:w-96">
                <img
                  src={celebrity.image_url}
                  alt={celebrity.name}
                  className="rounded-lg w-full h-auto object-cover"
                  style={{ maxWidth: '400px', height: 'auto' }}
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{celebrity.name}</h1>
              <div className="mb-4 flex gap-2">
                <Badge className="bg-white/10 text-white/80">
                  {formatCategory(celebrity.category)}
                </Badge>
              </div>
              <p className="text-white/80 text-lg mb-6">
                {celebrity.bio || "Bio coming soon."}
              </p>
              
              {/* Appearances/Conventions */}
              {appearances.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">🎤 Appearances</h3>
                  <div className="space-y-2">
                    {appearances.map((app) => {
                      const dateStr = app.event_date ? new Date(app.event_date).toLocaleDateString() : "TBA";
                      return (
                        <div key={app.id} className="text-sm text-white/70">
                          <span className="font-medium">{app.event_name}</span>
                          {app.location && <span> • {app.location}</span>}
                          <span> • {dateStr}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
        
        {/* New Features Section */}
        <div className="mx-auto max-w-5xl mt-12 space-y-8">
          {/* Social Media Links */}
          {(celebrity.twitter_handle || celebrity.instagram_handle || celebrity.tiktok_handle || celebrity.youtube_url) && (
            <div className="rounded-lg bg-white/5 p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Follow {celebrity.name}</h3>
              <div className="flex flex-wrap gap-3">
                {celebrity.twitter_handle && (
                  <a
                    href={`https://twitter.com/${celebrity.twitter_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Twitter
                  </a>
                )}
                {celebrity.instagram_handle && (
                  <a
                    href={`https://instagram.com/${celebrity.instagram_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Instagram
                  </a>
                )}
                {celebrity.tiktok_handle && (
                  <a
                    href={`https://tiktok.com/@${celebrity.tiktok_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    TikTok
                  </a>
                )}
                {celebrity.youtube_url && (
                  <a
                    href={celebrity.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    YouTube
                  </a>
                )}
              </div>
            </div>
          )}
          
          {/* Fan Mail Addresses */}
          {fanMailAddresses.length > 0 && (
            <div className="rounded-lg bg-white/5 p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">📬 Fan Mail</h3>
              <div className="space-y-3">
                {fanMailAddresses.map((fm) => (
                  <div key={fm.id} className="bg-white/5 p-3 rounded border border-white/10">
                    <p className="text-white font-mono text-sm break-all">{fm.address}</p>
                    {fm.verified && (
                      <p className="text-xs text-green-400 mt-1">✓ Verified</p>
                    )}
                    {fm.source && (
                      <p className="text-xs text-white/50 mt-1">Source: {fm.source}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

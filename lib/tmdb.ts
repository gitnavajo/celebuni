import type {
  TmdbCombinedCredits,
  TmdbPersonDetails,
  TmdbSearchPersonResponse,
} from "@/types/tmdb";

const TMDB_BASE = "https://api.themoviedb.org/3";

function tmdbKey() {
  return process.env.TMDB_API_KEY;
}

function assertKey() {
  const key = tmdbKey();
  if (!key) {
    throw new Error(
      "Missing TMDB_API_KEY. Add it to .env.local to enable real credits.",
    );
  }
  return key;
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const key = assertKey();
  const sp = new URLSearchParams();
  sp.set("api_key", key);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    sp.set(k, String(v));
  }

  const res = await fetch(`${TMDB_BASE}${path}?${sp.toString()}`, {
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TMDb error (${res.status}): ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function searchPeople(query: string) {
  return tmdbFetch<TmdbSearchPersonResponse>("/search/person", {
    query,
    include_adult: "false",
    language: "en-US",
    page: 1,
  });
}

export async function getPersonDetails(personId: number) {
  return tmdbFetch<TmdbPersonDetails>(`/person/${personId}`, {
    language: "en-US",
  });
}

export async function getPersonCombinedCredits(personId: number) {
  return tmdbFetch<TmdbCombinedCredits>(`/person/${personId}/combined_credits`, {
    language: "en-US",
  });
}

export function shortBio(bio: string, sentences = 3) {
  const cleaned = (bio || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const parts = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.slice(0, sentences).join(" ");
}


import { redirect } from "next/navigation";

type SearchRedirectProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function pickString(v: string | string[] | undefined) {
  if (!v) return "";
  return Array.isArray(v) ? v[0] ?? "" : v;
}

// Back-compat: support /search?q=... by redirecting to /search/[query]
export default async function SearchRedirect({ searchParams }: SearchRedirectProps) {
  const sp = await searchParams;
  const q = pickString(sp.q).trim();
  if (!q) redirect("/");
  redirect(`/search/${encodeURIComponent(q)}`);
}


import { NextResponse } from "next/server";
import { getPersonCombinedCredits } from "@/lib/tmdb";

// Kept for later: TMDb-backed filmography/credits.
// Not used by the current free MVP UI.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tmdbId: string }> },
) {
  const { tmdbId } = await params;
  const id = Number(tmdbId);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid tmdbId" }, { status: 400 });
  }

  try {
    const credits = await getPersonCombinedCredits(id);
    return NextResponse.json(credits, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "TMDb request failed";
    // If TMDB_API_KEY isn't set, lib/tmdb will throw; we surface that clearly.
    return NextResponse.json({ error: message }, { status: 501 });
  }
}


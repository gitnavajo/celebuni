"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchAction } from "@/app/actions/search";

type Category = "actors" | "voice_actors" | "musicians";

const categoryLabel: Record<Category, string> = {
  actors: "Actors",
  voice_actors: "Voice Actors",
  musicians: "Musicians",
};

export function SearchHero() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<Category>("actors");

  const placeholder = useMemo(
    () => "Search any celebrity, movie, anime, or band...",
    [],
  );

  return (
    <section className="mx-auto max-w-3xl text-center">
      <h1 className="text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
        A fan directory for the universe of celebrities
      </h1>
      <p className="mt-3 text-pretty text-sm leading-6 text-white/70 md:text-base">
        Search people and titles, view key credits from TMDb, and explore
        conventions & fan-mail info.
      </p>

      <div className="mt-6 flex justify-center">
        <Tabs
          value={category}
          onValueChange={(v) => setCategory(v as Category)}
          className="w-full"
        >
          <TabsList className="mx-auto grid w-full max-w-md grid-cols-3 bg-white/10">
            {(
              Object.keys(categoryLabel) as Array<keyof typeof categoryLabel>
            ).map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
              >
                {categoryLabel[key]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <form
        action={searchAction}
        className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <input type="hidden" name="category" value={category} />
        <Input
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-12 bg-white/5 text-white placeholder:text-white/40"
        />
        <Button
          type="submit"
          className="h-12 bg-violet-500 text-white hover:bg-violet-400"
        >
          Search
        </Button>
      </form>
    </section>
  );
}


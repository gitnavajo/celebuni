"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <Card className="bg-white/5 p-6">
        <div className="text-white">This page failed to load.</div>
        <div className="mt-2 text-sm text-white/70">{error.message}</div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            onClick={reset}
            className="bg-white/10 text-white hover:bg-white/20"
          >
            Retry
          </Button>
          <Link
            href="/"
            className="text-sm text-white/70 underline underline-offset-4"
          >
            Back to home
          </Link>
        </div>
      </Card>
    </main>
  );
}


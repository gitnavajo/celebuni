"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
        <div className="text-white">Something went wrong.</div>
        <div className="mt-2 text-sm text-white/70">
          {error.message || "Unknown error"}
        </div>
        <div className="mt-5">
          <Button onClick={reset} className="bg-white/10 text-white hover:bg-white/20">
            Try again
          </Button>
        </div>
      </Card>
    </main>
  );
}


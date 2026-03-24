import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <Card className="bg-white/5 p-6">
        <Skeleton className="h-6 w-40 bg-white/10" />
        <Skeleton className="mt-4 h-12 w-full bg-white/10" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28 w-full bg-white/10" />
          <Skeleton className="h-28 w-full bg-white/10" />
          <Skeleton className="h-28 w-full bg-white/10" />
        </div>
      </Card>
    </main>
  );
}


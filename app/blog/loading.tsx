import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <Skeleton className="h-10 w-40 bg-white/10" />
      <div className="mt-6 grid gap-4">
        <Card className="bg-white/5 p-5">
          <Skeleton className="h-5 w-64 bg-white/10" />
          <Skeleton className="mt-3 h-4 w-full bg-white/10" />
          <Skeleton className="mt-2 h-4 w-5/6 bg-white/10" />
        </Card>
        <Card className="bg-white/5 p-5">
          <Skeleton className="h-5 w-56 bg-white/10" />
          <Skeleton className="mt-3 h-4 w-full bg-white/10" />
          <Skeleton className="mt-2 h-4 w-4/6 bg-white/10" />
        </Card>
      </div>
    </main>
  );
}


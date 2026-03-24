import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="space-y-4">
        <Skeleton className="h-4 w-48 bg-white/10" />
        <Skeleton className="h-10 w-80 bg-white/10" />
        <Skeleton className="h-16 w-full bg-white/10" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="bg-white/5 p-5 lg:col-span-2">
          <Skeleton className="h-5 w-56 bg-white/10" />
          <Skeleton className="mt-4 h-64 w-full bg-white/10" />
        </Card>
        <div className="space-y-6">
          <Card className="bg-white/5 p-5">
            <Skeleton className="h-5 w-44 bg-white/10" />
            <Skeleton className="mt-4 h-32 w-full bg-white/10" />
          </Card>
          <Card className="bg-white/5 p-5">
            <Skeleton className="h-5 w-44 bg-white/10" />
            <Skeleton className="mt-4 h-24 w-full bg-white/10" />
          </Card>
        </div>
      </div>
    </main>
  );
}


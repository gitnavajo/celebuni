import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-2xl bg-white/10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-white/10" />
          <Skeleton className="h-4 w-40 bg-white/10" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/5 p-5">
            <Skeleton className="h-5 w-24 bg-white/10" />
            <Skeleton className="mt-4 h-24 w-full bg-white/10" />
          </Card>
          <Card className="bg-white/5 p-5">
            <Skeleton className="h-5 w-32 bg-white/10" />
            <Skeleton className="mt-4 h-48 w-full bg-white/10" />
          </Card>
          <Card className="bg-white/5 p-5">
            <Skeleton className="h-5 w-32 bg-white/10" />
            <Skeleton className="mt-4 h-56 w-full bg-white/10" />
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="bg-white/5 p-5">
            <Skeleton className="h-5 w-28 bg-white/10" />
            <Skeleton className="mt-4 h-28 w-full bg-white/10" />
          </Card>
          <Card className="bg-white/5 p-5">
            <Skeleton className="h-5 w-24 bg-white/10" />
            <Skeleton className="mt-4 h-20 w-full bg-white/10" />
          </Card>
        </div>
      </div>
    </main>
  );
}


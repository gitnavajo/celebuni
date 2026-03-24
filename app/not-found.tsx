import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <Card className="bg-white/5 p-6">
        <div className="text-white">Page not found.</div>
        <div className="mt-2 text-sm text-white/70">
          Head back to{" "}
          <Link href="/" className="underline underline-offset-4">
            search
          </Link>
          .
        </div>
      </Card>
    </main>
  );
}


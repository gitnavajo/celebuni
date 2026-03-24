"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function FanMailCard({
  name,
  address,
  verified,
  source,
  lastUpdated,
}: {
  name: string;
  address: string | null;
  verified: boolean;
  source: string | null;
  lastUpdated: string | null;
}) {
  const [copied, setCopied] = useState(false);

  const copyText = useMemo(() => {
    if (!address) return "";
    return `${name}\n${address}`;
  }, [address, name]);

  async function copy() {
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <Card className="bg-white/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-white">Fan mail</div>
        <Badge className="bg-white/10 text-white/80">
          {verified ? "Verified" : "Unverified"}
        </Badge>
      </div>
      <Separator className="my-4 bg-white/10" />

      {address ? (
        <>
          <div className="whitespace-pre-line text-sm text-white/80">
            {address}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button
              type="button"
              onClick={copy}
              className="bg-white/10 text-white hover:bg-white/20"
            >
              {copied ? "Copied" : "Copy address"}
            </Button>
            <div className="text-xs text-white/50">
              {source ? `Source: ${source}` : null}
              {lastUpdated ? `${source ? " · " : ""}Updated: ${lastUpdated}` : null}
            </div>
          </div>
        </>
      ) : (
        <div className="text-sm text-white/60">
          No fan-mail address on file yet.
        </div>
      )}
    </Card>
  );
}


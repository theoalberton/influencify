"use client";

import { useState, useTransition } from "react";
import { applyToCampaign } from "./actions";
import { Button } from "@/components/ui/Button";

export function ApplyButton({ campaignId }: { campaignId: string }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ error?: string; success?: string }>({});

  if (result.success) {
    return <p className="rounded-xl bg-[#eef3d6] px-3 py-2 text-xs text-[#0a3625]">{result.success}</p>;
  }

  return (
    <div>
      <Button
        type="button"
        size="sm"
        className="w-full"
        disabled={pending}
        onClick={() => startTransition(async () => setResult(await applyToCampaign(campaignId)))}
      >
        {pending ? "Enviando..." : "Quero divulgar"}
      </Button>
      {result.error && <p className="mt-2 text-xs text-red-600">{result.error}</p>}
    </div>
  );
}

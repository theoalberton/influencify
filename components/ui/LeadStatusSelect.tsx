"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "@/lib/actions/leads";
import { LEAD_STATUS_LABEL } from "@/lib/utils";
import type { LeadStatus } from "@/lib/database.types";

const TONE: Record<LeadStatus, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  sent: "bg-amber-50 text-amber-700 ring-amber-200",
  converted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  lost: "bg-slate-100 text-slate-600 ring-slate-200",
};

/** Badge clicável: muda o status do lead na hora, sem sair da tabela. */
export function LeadStatusSelect({ leadId, status, revalidate }: { leadId: string; status: LeadStatus; revalidate: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as LeadStatus;
        startTransition(() => updateLeadStatus(leadId, next, revalidate));
      }}
      className={`cursor-pointer appearance-none rounded-full px-2.5 py-1 pr-6 text-xs font-medium capitalize ring-1 ring-inset transition disabled:opacity-50 ${TONE[status]}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'><path d='M6 9l6 6 6-6'/></svg>\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 6px center",
        backgroundSize: "12px",
      }}
    >
      {(Object.keys(LEAD_STATUS_LABEL) as LeadStatus[]).map((value) => (
        <option key={value} value={value}>
          {LEAD_STATUS_LABEL[value]}
        </option>
      ))}
    </select>
  );
}

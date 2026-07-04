import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  sent: "bg-amber-50 text-amber-700 ring-amber-200",
  converted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  lost: "bg-slate-100 text-slate-600 ring-slate-200",
  paused: "bg-amber-50 text-amber-700 ring-amber-200",
  ended: "bg-slate-100 text-slate-600 ring-slate-200",
  invited: "bg-blue-50 text-blue-700 ring-blue-200",
  removed: "bg-red-50 text-red-700 ring-red-200",
  default: "bg-slate-100 text-slate-700 ring-slate-200",
};

export function Badge({ tone = "default", children }: { tone?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
        tones[tone] ?? tones.default
      )}
    >
      {children}
    </span>
  );
}

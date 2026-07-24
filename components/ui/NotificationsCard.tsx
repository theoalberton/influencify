import Link from "next/link";

export interface NotificationItem {
  emoji: string;
  text: React.ReactNode;
  href?: string;
  cta?: string;
}

const MILESTONES = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];

/** Maior marco de leads atingido e o próximo alvo — combustível de motivação. */
export function leadMilestone(count: number): { reached: number | null; next: number | null } {
  const reached = [...MILESTONES].reverse().find((m) => count >= m) ?? null;
  const next = MILESTONES.find((m) => count < m) ?? null;
  return { reached, next };
}

export function NotificationsCard({ items }: { items: NotificationItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mb-5 space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#eef3d6] px-5 py-3.5"
        >
          <p className="flex min-w-0 items-center gap-2.5 text-sm text-[#0a3625]">
            <span className="text-lg" aria-hidden>
              {item.emoji}
            </span>
            <span className="min-w-0">{item.text}</span>
          </p>
          {item.href && item.cta && (
            <Link
              href={item.href}
              className="shrink-0 rounded-full bg-[#0a3625] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#145238]"
            >
              {item.cta}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

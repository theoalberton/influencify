import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { markRewardPaid } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";
import type { Influencer, InviteReward } from "@/lib/database.types";

type RewardRow = InviteReward & { influencers: Pick<Influencer, "display_name"> | null };

export default async function AdminDashboardPage() {
  const profile = await requireRole("admin");
  const supabase = await createClient();

  const [
    { count: influencersCount },
    { count: brandsCount },
    { count: campaignsCount },
    { count: leadsCount },
    { count: clicksCount },
    { data: rewardsData },
  ] = await Promise.all([
    supabase.from("influencers").select("id", { count: "exact", head: true }),
    supabase.from("brands").select("id", { count: "exact", head: true }),
    supabase.from("campaigns").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("clicks").select("id", { count: "exact", head: true }),
    supabase
      .from("invite_rewards")
      .select("*, influencers(display_name)")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const leads = leadsCount ?? 0;
  const clicks = clicksCount ?? 0;
  const conversion = clicks > 0 ? ((leads / clicks) * 100).toFixed(1) : "0.0";
  const rewards = (rewardsData ?? []) as RewardRow[];
  const pending = rewards.filter((r) => r.status === "pending");

  return (
    <DashboardShell role="admin" name={profile.name} title="Visão geral da plataforma">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Influenciadores" value={influencersCount ?? 0} />
        <StatCard label="Marcas" value={brandsCount ?? 0} />
        <StatCard label="Campanhas" value={campaignsCount ?? 0} />
        <StatCard label="Leads totais" value={leads} />
        <StatCard label="Cliques totais" value={clicks} />
        <StatCard label="Conversão geral" value={`${conversion}%`} />
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <h2 className="text-sm font-semibold text-[#113b34]">
          Recompensas de indicação{" "}
          {pending.length > 0 && <Badge tone="sent">{pending.length} a pagar</Badge>}
        </h2>
        {rewards.length === 0 ? (
          <p className="mt-3 text-sm text-[#85918a]">Nenhuma recompensa resgatada ainda.</p>
        ) : (
          <div className="mt-3 divide-y divide-black/5">
            {rewards.map((reward) => (
              <div key={reward.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium text-[#113b34]">{reward.influencers?.display_name ?? "—"}</p>
                  <p className="text-xs text-[#85918a]">{formatDate(reward.created_at)}</p>
                </div>
                <span className="font-semibold text-[#113b34]">
                  R$ {Number(reward.amount).toFixed(2).replace(".", ",")}
                </span>
                {reward.status === "paid" ? (
                  <Badge tone="converted">pago</Badge>
                ) : (
                  <form action={markRewardPaid.bind(null, reward.id)}>
                    <Button type="submit" size="sm" variant="secondary">
                      Marcar como pago
                    </Button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

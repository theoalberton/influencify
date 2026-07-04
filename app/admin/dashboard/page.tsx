import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/ui/Card";

export default async function AdminDashboardPage() {
  const profile = await requireRole("admin");
  const supabase = await createClient();

  const [
    { count: influencersCount },
    { count: brandsCount },
    { count: campaignsCount },
    { count: leadsCount },
    { count: clicksCount },
  ] = await Promise.all([
    supabase.from("influencers").select("id", { count: "exact", head: true }),
    supabase.from("brands").select("id", { count: "exact", head: true }),
    supabase.from("campaigns").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("clicks").select("id", { count: "exact", head: true }),
  ]);

  const leads = leadsCount ?? 0;
  const clicks = clicksCount ?? 0;
  const conversion = clicks > 0 ? ((leads / clicks) * 100).toFixed(1) : "0.0";

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
    </DashboardShell>
  );
}

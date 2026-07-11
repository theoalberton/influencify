import { redirect } from "next/navigation";
import { requireRole, getMyBrand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { PerformanceChart } from "@/components/ui/PerformanceChart";
import { FunnelRow } from "@/components/ui/FunnelRow";
import { buildDailySeries } from "@/lib/timeseries";

export default async function BrandDashboardPage() {
  const profile = await requireRole("brand");
  const brand = await getMyBrand();
  if (!brand) redirect("/brand/profile");

  const supabase = await createClient();

  const [{ count: campaignsCount }, { count: activeCampaignsCount }, { count: leadsCount }, { count: ambassadorsCount }] =
    await Promise.all([
      supabase.from("campaigns").select("id", { count: "exact", head: true }).eq("brand_id", brand.id),
      supabase
        .from("campaigns")
        .select("id", { count: "exact", head: true })
        .eq("brand_id", brand.id)
        .eq("status", "active"),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("brand_id", brand.id),
      supabase
        .from("brand_influencers")
        .select("id", { count: "exact", head: true })
        .eq("brand_id", brand.id)
        .eq("status", "active"),
    ]);

  const { data: campaignRows } = await supabase.from("campaigns").select("id").eq("brand_id", brand.id);
  const campaignIds = (campaignRows ?? []).map((c) => c.id);

  const { count: clicksCount } = campaignIds.length
    ? await supabase.from("clicks").select("id", { count: "exact", head: true }).in("campaign_id", campaignIds)
    : { count: 0 };

  const leads = leadsCount ?? 0;
  const clicks = clicksCount ?? 0;
  const conversion = clicks > 0 ? ((leads / clicks) * 100).toFixed(1) : "0.0";

  // Série dos últimos 30 dias + funil
  const since = new Date();
  since.setDate(since.getDate() - 29);
  const sinceIso = since.toISOString().slice(0, 10);

  const [{ data: clickRows }, { data: leadRows }] = await Promise.all([
    campaignIds.length
      ? supabase.from("clicks").select("created_at").in("campaign_id", campaignIds).gte("created_at", sinceIso)
      : Promise.resolve({ data: [] as { created_at: string }[] }),
    supabase.from("leads").select("created_at, status").eq("brand_id", brand.id).gte("created_at", sinceIso),
  ]);

  const series = buildDailySeries(
    (clickRows ?? []).map((r) => r.created_at),
    (leadRows ?? []).map((r) => r.created_at)
  );
  const clicks30 = (clickRows ?? []).length;
  const leads30 = (leadRows ?? []).length;
  const converted30 = (leadRows ?? []).filter((r) => r.status === "converted").length;

  return (
    <DashboardShell
      role="brand"
      name={profile.name}
      title={brand.company_name}
      actions={
        <LinkButton href="/brand/campaigns/new" variant="primary">
          Nova campanha
        </LinkButton>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Campanhas ativas" value={activeCampaignsCount ?? 0} hint={`${campaignsCount ?? 0} no total`} />
        <StatCard label="Embaixadores ativos" value={ambassadorsCount ?? 0} />
        <StatCard label="Leads captados" value={leads} />
        <StatCard label="Taxa de conversão" value={`${conversion}%`} hint="cliques → leads" />
      </div>

      <div className="mt-4 space-y-4">
        <PerformanceChart data={series} />
        <FunnelRow clicks={clicks30} leads={leads30} converted={converted30} />
      </div>
    </DashboardShell>
  );
}

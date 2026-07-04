import { redirect } from "next/navigation";
import { requireRole, getMyBrand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

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
    </DashboardShell>
  );
}

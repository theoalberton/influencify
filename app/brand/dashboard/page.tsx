import { redirect } from "next/navigation";
import Link from "next/link";
import { requireRole, getMyBrand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { PerformanceChart } from "@/components/ui/PerformanceChart";
import { FunnelRow } from "@/components/ui/FunnelRow";
import { OnboardingChecklist } from "@/components/ui/OnboardingChecklist";
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

  const { data: campaignRows } = await supabase
    .from("campaigns")
    .select("id, avg_ticket")
    .eq("brand_id", brand.id);
  const campaignIds = (campaignRows ?? []).map((c) => c.id);

  const { count: clicksCount } = campaignIds.length
    ? await supabase.from("clicks").select("id", { count: "exact", head: true }).in("campaign_id", campaignIds)
    : { count: 0 };

  const leads = leadsCount ?? 0;
  const clicks = clicksCount ?? 0;
  const conversion = clicks > 0 ? ((leads / clicks) * 100).toFixed(1) : "0.0";

  // Receita estimada: leads convertidos × ticket médio da campanha.
  const ticketByCampaign = new Map(
    (campaignRows ?? []).filter((c) => c.avg_ticket).map((c) => [c.id, Number(c.avg_ticket)])
  );
  let estimatedRevenue = 0;
  if (ticketByCampaign.size > 0) {
    const { data: convertedRows } = await supabase
      .from("leads")
      .select("campaign_id")
      .eq("brand_id", brand.id)
      .eq("status", "converted");
    for (const row of convertedRows ?? []) {
      estimatedRevenue += ticketByCampaign.get(row.campaign_id) ?? 0;
    }
  }

  // Primeiros passos: some quando tudo estiver concluído.
  const onboardingSteps = [
    {
      label: "Complete o perfil da marca",
      description: "Logo e descrição — aparecem nas ofertas que os influenciadores divulgam.",
      done: Boolean(brand.logo_url),
      href: "/brand/profile",
      cta: "Completar perfil",
    },
    {
      label: "Crie a primeira campanha",
      description: "Cupom, desconto e imagem da oferta em poucos minutos.",
      done: (campaignsCount ?? 0) > 0,
      href: "/brand/campaigns/new",
      cta: "Criar campanha",
    },
    {
      label: "Vincule um embaixador",
      description: "Encontre influenciadores do seu nicho e convide para divulgar.",
      done: (ambassadorsCount ?? 0) > 0,
      href: "/brand/discover",
      cta: "Descobrir influenciadores",
    },
    {
      label: "Receba o primeiro lead",
      description: "Quando alguém resgatar um cupom, o contato aparece em Leads.",
      done: leads > 0,
      href: "/brand/leads",
      cta: "Ver leads",
    },
  ];
  const onboardingDone = onboardingSteps.every((s) => s.done);

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
      {!onboardingDone && <OnboardingChecklist steps={onboardingSteps} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Campanhas ativas" value={activeCampaignsCount ?? 0} hint={`${campaignsCount ?? 0} no total`} />
        <StatCard label="Embaixadores ativos" value={ambassadorsCount ?? 0} />
        <StatCard label="Leads captados" value={leads} />
        <StatCard label="Taxa de conversão" value={`${conversion}%`} hint="cliques → leads" />
      </div>

      {ticketByCampaign.size > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#0a3625] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Receita estimada gerada</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-[#ccda47]">
              R$ {estimatedRevenue.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-white/60">
            Leads marcados como <strong className="text-white/80">convertidos</strong> × ticket médio de cada campanha.
            Marque conversões em{" "}
            <Link href="/brand/leads" className="font-semibold text-[#ccda47] hover:underline">
              Leads
            </Link>
            .
          </p>
        </div>
      )}

      <div className="mt-4 space-y-4">
        <PerformanceChart data={series} />
        <FunnelRow clicks={clicks30} leads={leads30} converted={converted30} />
      </div>
    </DashboardShell>
  );
}

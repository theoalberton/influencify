import { redirect } from "next/navigation";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { PerformanceChart } from "@/components/ui/PerformanceChart";
import { FunnelRow } from "@/components/ui/FunnelRow";
import { OnboardingChecklist } from "@/components/ui/OnboardingChecklist";
import { buildDailySeries } from "@/lib/timeseries";

export default async function InfluencerDashboardPage() {
  const profile = await requireRole("influencer");
  const influencer = await getMyInfluencer();
  if (!influencer) redirect("/influencer/profile");

  const supabase = await createClient();

  const [{ count: leadsCount }, { count: clicksCount }, { count: campaignsCount }] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("influencer_id", influencer.id),
    supabase.from("clicks").select("id", { count: "exact", head: true }).eq("influencer_id", influencer.id),
    supabase
      .from("campaign_influencers")
      .select("id", { count: "exact", head: true })
      .eq("influencer_id", influencer.id)
      .eq("status", "active"),
  ]);

  const leads = leadsCount ?? 0;
  const clicks = clicksCount ?? 0;
  const conversion = clicks > 0 ? ((leads / clicks) * 100).toFixed(1) : "0.0";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Primeiros passos: some quando tudo estiver concluído.
  const onboardingSteps = [
    {
      label: "Complete o seu perfil",
      description: "Foto, bio e redes — é o que o público e as marcas veem primeiro.",
      done: Boolean(influencer.profile_image_url && influencer.bio),
      href: "/influencer/profile",
      cta: "Completar perfil",
    },
    {
      label: "Tenha uma oferta ativa",
      description: "Crie uma campanha sua ou aceite o convite de uma marca.",
      done: (campaignsCount ?? 0) > 0,
      href: "/influencer/my-campaigns/new",
      cta: "Criar campanha",
    },
    {
      label: "Divulgue o seu link",
      description: "Coloque o link do perfil na bio e nos stories. O primeiro clique confirma este passo.",
      done: clicks > 0,
      href: "/influencer/referrals",
      cta: "Ver meus links",
    },
    {
      label: "Receba o primeiro lead",
      description: "Quando alguém resgatar um cupom, o contato aparece em Leads.",
      done: leads > 0,
      href: "/influencer/leads",
      cta: "Ver leads",
    },
  ];
  const onboardingDone = onboardingSteps.every((s) => s.done);

  // Série dos últimos 30 dias + funil
  const since = new Date();
  since.setDate(since.getDate() - 29);
  const sinceIso = since.toISOString().slice(0, 10);

  const [{ data: clickRows }, { data: leadRows }] = await Promise.all([
    supabase.from("clicks").select("created_at").eq("influencer_id", influencer.id).gte("created_at", sinceIso),
    supabase.from("leads").select("created_at, status").eq("influencer_id", influencer.id).gte("created_at", sinceIso),
  ]);

  const series = buildDailySeries(
    (clickRows ?? []).map((r) => r.created_at),
    (leadRows ?? []).map((r) => r.created_at)
  );
  const converted30 = (leadRows ?? []).filter((r) => r.status === "converted").length;

  return (
    <DashboardShell
      role="influencer"
      name={profile.name}
      title={`Olá, ${influencer.display_name}`}
      actions={
        <div className="flex gap-2">
          <LinkButton href={`/i/${influencer.slug}/midia-kit`} variant="secondary">
            Meu mídia kit
          </LinkButton>
          <LinkButton href={`/i/${influencer.slug}`} variant="secondary">
            Ver meu perfil público
          </LinkButton>
        </div>
      }
    >
      {!onboardingDone && <OnboardingChecklist steps={onboardingSteps} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Leads gerados" value={leads} />
        <StatCard label="Cliques totais" value={clicks} />
        <StatCard label="Campanhas ativas" value={campaignsCount ?? 0} />
        <StatCard label="Taxa de conversão" value={`${conversion}%`} hint="cliques → leads" />
      </div>

      <div className="mt-4 space-y-4">
        <PerformanceChart data={series} />
        <FunnelRow clicks={(clickRows ?? []).length} leads={(leadRows ?? []).length} converted={converted30} />
      </div>

      <div className="mt-4 rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <h2 className="text-sm font-semibold text-[#0a3625]">Seu link principal</h2>
        <p className="mt-2 break-all rounded-lg bg-[#f4f6e8] px-3 py-2 font-mono text-sm text-[#4d584d]">
          {siteUrl}/i/{influencer.slug}
        </p>
        <p className="mt-3 text-sm text-[#4d584d]">
          Divulgue um produto seu em{" "}
          <a href="/influencer/my-campaigns" className="font-medium text-[#0a3625] hover:underline">
            Minhas campanhas
          </a>{" "}
          ou veja as ofertas das marcas em{" "}
          <a href="/influencer/campaigns" className="font-medium text-[#0a3625] hover:underline">
            Campanhas de marcas
          </a>
          . Para negociar com marcas, envie o seu{" "}
          <a href={`/i/${influencer.slug}/midia-kit`} className="font-medium text-[#0a3625] hover:underline">
            mídia kit
          </a>
          .
        </p>
      </div>
    </DashboardShell>
  );
}

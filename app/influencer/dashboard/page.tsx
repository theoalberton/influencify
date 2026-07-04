import { redirect } from "next/navigation";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StatCard } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

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

  return (
    <DashboardShell
      role="influencer"
      name={profile.name}
      title={`Olá, ${influencer.display_name}`}
      actions={
        <LinkButton href={`/i/${influencer.slug}`} variant="secondary">
          Ver meu perfil público
        </LinkButton>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Leads gerados" value={leads} />
        <StatCard label="Cliques totais" value={clicks} />
        <StatCard label="Campanhas ativas" value={campaignsCount ?? 0} />
        <StatCard label="Taxa de conversão" value={`${conversion}%`} hint="cliques → leads" />
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-sm font-semibold text-slate-900">Seu link principal</h2>
        <p className="mt-2 break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm text-slate-600">
          {siteUrl}/i/{influencer.slug}
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Veja campanhas disponíveis das marcas que você é embaixador em{" "}
          <a href="/influencer/campaigns" className="font-medium text-indigo-600 hover:underline">
            Campanhas
          </a>
          .
        </p>
      </div>
    </DashboardShell>
  );
}

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireRole, getMyBrand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatFollowers } from "@/lib/utils";
import { rewardSummary, earnedAmount } from "@/lib/rewards";
import { inviteToCampaign, removeFromCampaign, approveApplication, rejectApplication } from "./actions";
import type { Campaign, CampaignInfluencer, Influencer } from "@/lib/database.types";

const INVITE_STATUS_LABEL: Record<string, string> = {
  invited: "convite enviado",
  applied: "candidatura pendente",
  active: "divulgando",
  paused: "pausado",
  removed: "recusou",
};

type ApplicationRow = CampaignInfluencer & {
  influencers: Pick<
    Influencer,
    "id" | "display_name" | "niche" | "followers_count" | "profile_image_url" | "slug"
  > | null;
};

export default async function CampaignAmbassadorsPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireRole("brand");
  const brand = await getMyBrand();
  if (!brand) redirect("/brand/profile");

  const { id } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("brand_id", brand.id)
    .single<Campaign>();

  if (!campaign) notFound();

  const [{ data: ambassadorLinks }, { data: inviteRows }, { data: leadRows }] = await Promise.all([
    supabase
      .from("brand_influencers")
      .select("influencers(id, display_name, niche, followers_count)")
      .eq("brand_id", brand.id)
      .eq("status", "active"),
    supabase
      .from("campaign_influencers")
      .select("*, influencers(id, display_name, niche, followers_count, profile_image_url, slug)")
      .eq("campaign_id", campaign.id),
    supabase.from("leads").select("influencer_id").eq("campaign_id", campaign.id),
  ]);

  const ambassadors = (ambassadorLinks ?? [])
    .map(
      (l) =>
        (l as unknown as { influencers: Pick<Influencer, "id" | "display_name" | "niche" | "followers_count"> | null })
          .influencers
    )
    .filter((i): i is Pick<Influencer, "id" | "display_name" | "niche" | "followers_count"> => i !== null);

  const rows = (inviteRows ?? []) as ApplicationRow[];
  const applications = rows.filter((r) => r.status === "applied");
  const promoting = rows.filter((r) => r.status === "active");
  const linkByInfluencer = new Map(rows.map((r) => [r.influencer_id, r]));

  // Leads por influenciador → base da recompensa por lead
  const leadsByInfluencer = new Map<string, number>();
  for (const lead of leadRows ?? []) {
    if (lead.influencer_id) {
      leadsByInfluencer.set(lead.influencer_id, (leadsByInfluencer.get(lead.influencer_id) ?? 0) + 1);
    }
  }

  const reward = rewardSummary(campaign);
  const totalOwed = promoting.reduce(
    (sum, row) => sum + earnedAmount(campaign, leadsByInfluencer.get(row.influencer_id) ?? 0),
    0
  );

  return (
    <DashboardShell role="brand" name={profile.name} title={`Influenciadores · ${campaign.title}`}>
      <Link href="/brand/campaigns" className="text-sm font-medium text-[#0a3625] hover:underline">
        ‹ Voltar às campanhas
      </Link>

      {campaign.is_open && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#0a3625] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Campanha aberta</p>
            <p className="mt-1 text-lg font-bold text-[#ccda47]">{reward ?? "Recompensa a combinar"}</p>
          </div>
          {campaign.reward_type === "per_lead" && (
            <div className="text-right">
              <p className="text-xs text-white/60">A pagar aos influenciadores</p>
              <p className="text-2xl font-bold tracking-tight text-white">
                R$ {totalOwed.toFixed(2).replace(".", ",")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Candidaturas aguardando aprovação */}
      {applications.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-[#0a3625]">
            Candidaturas <Badge tone="invited">{applications.length}</Badge>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((row) => {
              const inf = row.influencers;
              if (!inf) return null;
              return (
                <div
                  key={row.id}
                  className="rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] ring-2 ring-[#ccda47]"
                >
                  <div className="flex items-center gap-3">
                    {inf.profile_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={inf.profile_image_url}
                        alt={inf.display_name}
                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0a3625] text-lg font-bold text-[#ccda47]">
                        {inf.display_name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#0a3625]">{inf.display_name}</p>
                      <p className="truncate text-xs text-[#7a8578]">
                        {[inf.niche, inf.followers_count ? `${formatFollowers(inf.followers_count)} seguidores` : null]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/i/${inf.slug}/midia-kit`}
                    target="_blank"
                    className="mt-3 inline-block text-xs font-medium text-[#0a3625] hover:underline"
                  >
                    Ver mídia kit ›
                  </Link>

                  <div className="mt-4 flex gap-2">
                    <form action={approveApplication.bind(null, row.id, campaign.id)} className="flex-1">
                      <Button type="submit" size="sm" className="w-full">
                        Aprovar
                      </Button>
                    </form>
                    <form action={rejectApplication.bind(null, row.id, campaign.id)}>
                      <Button type="submit" size="sm" variant="secondary">
                        Recusar
                      </Button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Quem já está divulgando, com resultado e cupom exclusivo */}
      {promoting.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-[#0a3625]">Divulgando ({promoting.length})</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promoting.map((row) => {
              const leads = leadsByInfluencer.get(row.influencer_id) ?? 0;
              const owed = earnedAmount(campaign, leads);
              return (
                <div key={row.id} className="rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
                  <p className="font-semibold text-[#0a3625]">{row.influencers?.display_name ?? "—"}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-[#4d584d]">
                      <strong className="text-[#0a3625]">{leads}</strong> leads
                    </span>
                    {campaign.reward_type === "per_lead" && owed > 0 && (
                      <span className="rounded-full bg-[#eef3d6] px-2.5 py-1 text-xs font-bold text-[#0a3625]">
                        R$ {owed.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </div>
                  {row.coupon_code && (
                    <p className="mt-3 rounded-lg bg-[#f4f6e8] px-3 py-2 font-mono text-xs text-[#4d584d]">
                      cupom: <strong className="text-[#0a3625]">{row.coupon_code}</strong>
                    </p>
                  )}
                  <form action={removeFromCampaign.bind(null, campaign.id, row.influencer_id)} className="mt-4">
                    <Button type="submit" size="sm" variant="secondary">
                      Remover
                    </Button>
                  </form>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Convite direto aos influenciadores da rede */}
      <Card className="mt-6 max-w-3xl">
        <p className="text-sm text-[#4d584d]">
          Convide influenciadores da <strong>sua rede</strong> para esta campanha. Cada um recebe o convite no
          painel dele e a oferta só entra no perfil público depois que ele aceitar.
        </p>

        {ambassadors.length === 0 ? (
          <p className="mt-5 rounded-xl bg-[#f4f6e8] px-4 py-3 text-sm text-[#4d584d]">
            Você ainda não tem influenciadores na sua rede. Convide criadores em{" "}
            <Link href="/brand/discover" className="font-medium text-[#0a3625] hover:underline">
              Descobrir influenciadores
            </Link>
            .
          </p>
        ) : (
          <div className="mt-5 divide-y divide-black/5">
            {ambassadors.map((amb) => {
              const link = linkByInfluencer.get(amb.id);
              return (
                <div key={amb.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="font-medium text-[#0a3625]">{amb.display_name}</p>
                    <p className="text-xs text-[#7a8578]">
                      {[amb.niche, amb.followers_count ? `${formatFollowers(amb.followers_count)} seguidores` : null]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {link && <Badge tone={link.status}>{INVITE_STATUS_LABEL[link.status] ?? link.status}</Badge>}
                    {link ? (
                      <form action={removeFromCampaign.bind(null, campaign.id, amb.id)}>
                        <Button type="submit" size="sm" variant="secondary">
                          Remover
                        </Button>
                      </form>
                    ) : (
                      <form action={inviteToCampaign.bind(null, campaign.id, amb.id)}>
                        <Button type="submit" size="sm">
                          Convidar
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </DashboardShell>
  );
}

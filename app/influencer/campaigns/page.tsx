import { redirect } from "next/navigation";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Table";
import { CopyButton } from "@/components/ui/CopyButton";
import { formatDiscount } from "@/lib/utils";
import { rewardSummary, earnedAmount } from "@/lib/rewards";
import { acceptInvite, declineInvite, acceptPartnership, declinePartnership } from "./actions";
import type { Brand, BrandInfluencer, Campaign, CampaignInfluencer } from "@/lib/database.types";

type InviteRow = CampaignInfluencer & {
  campaigns: (Campaign & { brands: Brand | null }) | null;
};

type PartnershipRow = BrandInfluencer & { brands: Brand | null };

export default async function InfluencerCampaignsPage() {
  const profile = await requireRole("influencer");
  const influencer = await getMyInfluencer();
  if (!influencer) redirect("/influencer/profile");

  const supabase = await createClient();

  // A campanha de marca só aparece aqui se a marca convidou este influenciador.
  const [{ data: rows }, { data: partnershipRows }] = await Promise.all([
    supabase
      .from("campaign_influencers")
      .select("*, campaigns(*, brands(*))")
      .eq("influencer_id", influencer.id)
      .in("status", ["invited", "active"])
      .order("created_at", { ascending: false }),
    supabase
      .from("brand_influencers")
      .select("*, brands(*)")
      .eq("influencer_id", influencer.id)
      .eq("status", "invited")
      .order("created_at", { ascending: false }),
  ]);

  const partnershipInvites = ((partnershipRows ?? []) as PartnershipRow[]).filter((p) => p.brands);

  // Leads por campanha: base do "quanto já rendeu" nas campanhas por performance
  const { data: myLeads } = await supabase
    .from("leads")
    .select("campaign_id")
    .eq("influencer_id", influencer.id);
  const leadsByCampaign = new Map<string, number>();
  for (const lead of myLeads ?? []) {
    if (lead.campaign_id) {
      leadsByCampaign.set(lead.campaign_id, (leadsByCampaign.get(lead.campaign_id) ?? 0) + 1);
    }
  }

  const invites = ((rows ?? []) as InviteRow[]).filter(
    (r) => r.campaigns && r.campaigns.brand_id !== null && r.campaigns.status === "active"
  );

  const pending = invites.filter((r) => r.status === "invited");
  const active = invites.filter((r) => r.status === "active");

  return (
    <DashboardShell role="influencer" name={profile.name} title="Campanhas de marcas">
      {/* Convites de parceria: a marca quer este influenciador na rede dela */}
      {partnershipInvites.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-[#0a3625]">
            Marcas que querem trabalhar com você <Badge tone="invited">{partnershipInvites.length}</Badge>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partnershipInvites.map((p) => {
              const brand = p.brands!;
              return (
                <div key={p.id} className="rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] ring-2 ring-[#ccda47]">
                  <div className="flex items-center gap-3">
                    {brand.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={brand.logo_url} alt={brand.company_name} className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-black/5" />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0a3625] text-lg font-bold text-[#ccda47]">
                        {brand.company_name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#0a3625]">{brand.company_name}</p>
                      <p className="text-xs text-[#7a8578]">{brand.segment ?? "quer você na rede dela"}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[#4d584d]">
                    Aceitando, essa marca pode convidar você para divulgar campanhas com link rastreável.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <form action={acceptPartnership.bind(null, p.id)} className="flex-1">
                      <Button type="submit" size="sm" className="w-full">
                        Aceitar parceria
                      </Button>
                    </form>
                    <form action={declinePartnership.bind(null, p.id)}>
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

      {invites.length === 0 ? (
        <EmptyState
          title="Nenhum convite de campanha ainda"
          description="Quando uma marca convidar você para divulgar uma campanha, o convite aparece aqui para você aceitar ou recusar."
        />
      ) : (
        <div className="space-y-8">
          {pending.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-[#0a3625]">
                Convites pendentes <Badge tone="invited">{pending.length}</Badge>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pending.map((invite) => {
                  const campaign = invite.campaigns!;
                  return (
                    <div key={invite.id} className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] ring-2 ring-[#0a3625]/20">
                      <CampaignThumb campaign={campaign} />
                      <div className="p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-[#7a8578]">
                          {campaign.brands?.company_name}
                        </p>
                        <h3 className="mt-1 truncate font-semibold text-[#0a3625]">{campaign.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-[#4d584d]">{campaign.description}</p>

                        <div className="mt-4 flex gap-2">
                          <form action={acceptInvite.bind(null, invite.id)} className="flex-1">
                            <Button type="submit" size="sm" className="w-full">
                              Aceitar convite
                            </Button>
                          </form>
                          <form action={declineInvite.bind(null, invite.id)}>
                            <Button type="submit" size="sm" variant="secondary">
                              Recusar
                            </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {active.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-[#0a3625]">Divulgando</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {active.map((invite) => {
                  const campaign = invite.campaigns!;
                  return (
                    <div key={invite.id} className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
                      <CampaignThumb campaign={campaign} />
                      <div className="p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-[#7a8578]">
                          {campaign.brands?.company_name}
                        </p>
                        <h3 className="mt-1 truncate font-semibold text-[#0a3625]">{campaign.title}</h3>

                        {/* Campanha por performance: mostra o que já rendeu */}
                        {campaign.is_open && (
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {rewardSummary(campaign) && (
                              <span className="rounded-full bg-[#ccda47] px-2.5 py-1 text-xs font-bold text-[#0a3625]">
                                {rewardSummary(campaign)}
                              </span>
                            )}
                            <span className="text-xs text-[#4d584d]">
                              <strong className="text-[#0a3625]">{leadsByCampaign.get(campaign.id) ?? 0}</strong> leads
                              {campaign.reward_type === "per_lead" && (
                                <>
                                  {" · "}
                                  <strong className="text-[#0a3625]">
                                    R${" "}
                                    {earnedAmount(campaign, leadsByCampaign.get(campaign.id) ?? 0)
                                      .toFixed(2)
                                      .replace(".", ",")}
                                  </strong>{" "}
                                  a receber
                                </>
                              )}
                            </span>
                          </div>
                        )}

                        <div className="mt-3 space-y-2">
                          <p className="break-all rounded-lg bg-[#f4f6e8] px-3 py-2 font-mono text-xs text-[#4d584d]">
                            {invite.public_url}
                          </p>
                          <CopyButton value={invite.public_url ?? ""} />
                          {invite.coupon_code && (
                            <p className="rounded-lg bg-[#eef3d6] px-3 py-2 text-xs text-[#4d584d]">
                              Seu cupom exclusivo:{" "}
                              <strong className="font-mono text-[#0a3625]">{invite.coupon_code}</strong>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </DashboardShell>
  );
}

function CampaignThumb({ campaign }: { campaign: Campaign & { brands: Brand | null } }) {
  return (
    <div className="relative aspect-video w-full bg-[#f4f6e8]">
      {campaign.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={campaign.image_url} alt={campaign.title} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#e9ecd8] to-[#dfe8c9] text-2xl font-bold text-[#a3ac9c]">
          {campaign.brands?.company_name?.slice(0, 1).toUpperCase()}
        </div>
      )}
      <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
        {formatDiscount(campaign.discount_type, campaign.discount_value)}
      </span>
    </div>
  );
}

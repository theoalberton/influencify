import { redirect } from "next/navigation";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Table";
import { CopyButton } from "@/components/ui/CopyButton";
import { formatDiscount } from "@/lib/utils";
import { acceptInvite, declineInvite } from "./actions";
import type { Brand, Campaign, CampaignInfluencer } from "@/lib/database.types";

type InviteRow = CampaignInfluencer & {
  campaigns: (Campaign & { brands: Brand | null }) | null;
};

export default async function InfluencerCampaignsPage() {
  const profile = await requireRole("influencer");
  const influencer = await getMyInfluencer();
  if (!influencer) redirect("/influencer/profile");

  const supabase = await createClient();

  // A campanha de marca só aparece aqui se a marca convidou este influenciador.
  const { data: rows } = await supabase
    .from("campaign_influencers")
    .select("*, campaigns(*, brands(*))")
    .eq("influencer_id", influencer.id)
    .in("status", ["invited", "active"])
    .order("created_at", { ascending: false });

  const invites = ((rows ?? []) as InviteRow[]).filter(
    (r) => r.campaigns && r.campaigns.brand_id !== null && r.campaigns.status === "active"
  );

  const pending = invites.filter((r) => r.status === "invited");
  const active = invites.filter((r) => r.status === "active");

  return (
    <DashboardShell role="influencer" name={profile.name} title="Campanhas de marcas">
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

                        <div className="mt-3 space-y-2">
                          <p className="break-all rounded-lg bg-[#f4f6e8] px-3 py-2 font-mono text-xs text-[#4d584d]">
                            {invite.public_url}
                          </p>
                          <CopyButton value={invite.public_url ?? ""} />
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

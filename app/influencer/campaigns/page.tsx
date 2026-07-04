import { redirect } from "next/navigation";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Table";
import { CopyButton } from "@/components/ui/CopyButton";
import { formatDiscount } from "@/lib/utils";
import { generateCampaignLink } from "./actions";
import type { Brand, Campaign, CampaignInfluencer } from "@/lib/database.types";

export default async function InfluencerCampaignsPage() {
  const profile = await requireRole("influencer");
  const influencer = await getMyInfluencer();
  if (!influencer) redirect("/influencer/profile");

  const supabase = await createClient();

  const { data: links } = await supabase
    .from("brand_influencers")
    .select("brand_id")
    .eq("influencer_id", influencer.id)
    .eq("status", "active");

  const brandIds = (links ?? []).map((l) => l.brand_id);

  const { data: campaigns } = brandIds.length
    ? await supabase
        .from("campaigns")
        .select("*, brands(*)")
        .in("brand_id", brandIds)
        .eq("status", "active")
    : { data: [] as (Campaign & { brands: Brand })[] };

  const { data: myLinks } = await supabase
    .from("campaign_influencers")
    .select("*")
    .eq("influencer_id", influencer.id);

  const linkByCampaign = new Map((myLinks ?? []).map((l) => [l.campaign_id, l]));

  return (
    <DashboardShell role="influencer" name={profile.name} title="Campanhas disponíveis">
      {!campaigns || campaigns.length === 0 ? (
        <EmptyState
          title="Nenhuma campanha disponível ainda"
          description="Assim que uma marca te adicionar como embaixador e publicar uma campanha, ela aparece aqui."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(campaigns as (Campaign & { brands: Brand })[]).map((campaign) => {
            const myLink = linkByCampaign.get(campaign.id) as CampaignInfluencer | undefined;
            return (
              <Card key={campaign.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {campaign.brands?.company_name}
                    </p>
                    <h3 className="mt-1 font-semibold text-slate-900">{campaign.title}</h3>
                  </div>
                  <Badge tone="active">{formatDiscount(campaign.discount_type, campaign.discount_value)}</Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{campaign.description}</p>

                {myLink ? (
                  <div className="mt-4 space-y-2">
                    <p className="break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600">
                      {myLink.public_url}
                    </p>
                    <CopyButton value={myLink.public_url ?? ""} />
                  </div>
                ) : (
                  <form action={generateCampaignLink.bind(null, campaign.id)} className="mt-4">
                    <Button type="submit" size="sm">
                      Gerar meu link
                    </Button>
                  </form>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}

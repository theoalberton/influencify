import { redirect } from "next/navigation";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(campaigns as (Campaign & { brands: Brand })[]).map((campaign) => {
            const myLink = linkByCampaign.get(campaign.id) as CampaignInfluencer | undefined;
            return (
              <div
                key={campaign.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
              >
                <div className="relative aspect-video w-full bg-slate-100">
                  {campaign.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={campaign.image_url} alt={campaign.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-fuchsia-100 text-2xl font-bold text-indigo-300">
                      {campaign.brands?.company_name?.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                    {formatDiscount(campaign.discount_type, campaign.discount_value)}
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {campaign.brands?.company_name}
                  </p>
                  <h3 className="mt-1 truncate font-semibold text-slate-900">{campaign.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{campaign.description}</p>

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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}

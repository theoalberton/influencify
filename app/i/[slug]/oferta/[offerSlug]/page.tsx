import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDiscount } from "@/lib/utils";
import { hashRequestIp, requestUserAgent } from "@/lib/track";
import { LeadForm } from "./LeadForm";
import type { Brand, Campaign, CampaignInfluencer } from "@/lib/database.types";

export default async function OfferPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; offerSlug: string }>;
  searchParams: Promise<{ ref?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string }>;
}) {
  const { slug, offerSlug } = await params;
  const query = await searchParams;

  const supabase = await createClient();

  const { data: influencer } = await supabase
    .from("influencers")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!influencer) notFound();

  let campaignInfluencer: CampaignInfluencer | null = null;

  if (query.ref) {
    const { data } = await supabase
      .from("campaign_influencers")
      .select("*")
      .eq("referral_code", query.ref)
      .eq("influencer_id", influencer.id)
      .single();
    campaignInfluencer = data;
  }

  if (!campaignInfluencer) {
    const { data: campaignBySlug } = await supabase.from("campaigns").select("id").eq("slug", offerSlug).single();
    if (campaignBySlug) {
      const { data } = await supabase
        .from("campaign_influencers")
        .select("*")
        .eq("campaign_id", campaignBySlug.id)
        .eq("influencer_id", influencer.id)
        .single();
      campaignInfluencer = data;
    }
  }

  if (!campaignInfluencer) notFound();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*, brands(*)")
    .eq("id", campaignInfluencer.campaign_id)
    .eq("slug", offerSlug)
    .eq("status", "active")
    .single();

  if (!campaign) notFound();

  const typedCampaign = campaign as Campaign & { brands: Brand };

  await supabase.from("clicks").insert({
    campaign_id: typedCampaign.id,
    influencer_id: influencer.id,
    referral_code: campaignInfluencer.referral_code,
    ip_hash: await hashRequestIp(),
    user_agent: await requestUserAgent(),
    source: query.utm_source ?? "profile",
  });

  const campaignUtm = [query.utm_source, query.utm_medium, query.utm_campaign].filter(Boolean).join("/");

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        {typedCampaign.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={typedCampaign.image_url} alt={typedCampaign.title} className="mb-4 h-40 w-full rounded-2xl object-cover" />
        )}

        <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
          {typedCampaign.brands?.company_name} · via {influencer.display_name}
        </p>
        <h1 className="mt-1 text-xl font-bold text-slate-900">{typedCampaign.title}</h1>
        <p className="mt-2 text-sm font-semibold text-indigo-600">
          {formatDiscount(typedCampaign.discount_type, typedCampaign.discount_value)}
        </p>
        {typedCampaign.description && <p className="mt-2 text-sm text-slate-500">{typedCampaign.description}</p>}

        <div className="mt-6 border-t border-slate-100 pt-6">
          <LeadForm
            campaignId={typedCampaign.id}
            brandId={typedCampaign.brand_id}
            influencerId={influencer.id}
            referralCode={campaignInfluencer.referral_code}
            requiredFields={typedCampaign.required_fields}
            source="profile"
            campaignUtm={campaignUtm}
          />
        </div>
      </div>
    </div>
  );
}

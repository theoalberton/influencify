"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyBrand } from "@/lib/auth";
import { inviteInfluencerToCampaign } from "@/lib/invites";
import { buildInfluencerCoupon } from "@/lib/rewards";

export async function inviteToCampaign(campaignId: string, influencerId: string): Promise<void> {
  const brand = await getMyBrand();
  if (!brand) return;

  const supabase = await createClient();

  const [{ data: campaign }, { data: influencer }] = await Promise.all([
    supabase.from("campaigns").select("id, slug").eq("id", campaignId).eq("brand_id", brand.id).single(),
    supabase.from("influencers").select("id, slug").eq("id", influencerId).single(),
  ]);
  if (!campaign || !influencer) return;

  await inviteInfluencerToCampaign(supabase, {
    campaignId: campaign.id,
    campaignSlug: campaign.slug,
    influencerId: influencer.id,
    influencerSlug: influencer.slug,
  });

  revalidatePath(`/brand/campaigns/${campaignId}`);
}

/**
 * Aprova a candidatura: ativa o link e gera o cupom exclusivo do influenciador
 * — é ele que permite atribuir vendas no checkout da marca.
 */
export async function approveApplication(campaignInfluencerId: string, campaignId: string): Promise<void> {
  const brand = await getMyBrand();
  if (!brand) return;

  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, coupon_code")
    .eq("id", campaignId)
    .eq("brand_id", brand.id)
    .single();
  if (!campaign) return;

  const { data: link } = await supabase
    .from("campaign_influencers")
    .select("id, referral_code, influencer_id, influencers(display_name)")
    .eq("id", campaignInfluencerId)
    .eq("campaign_id", campaignId)
    .single();
  if (!link) return;

  const displayName =
    (link as unknown as { influencers: { display_name: string } | null }).influencers?.display_name ?? "";

  await supabase
    .from("campaign_influencers")
    .update({
      status: "active",
      coupon_code: buildInfluencerCoupon(campaign.coupon_code, displayName, link.referral_code),
    })
    .eq("id", campaignInfluencerId);

  revalidatePath(`/brand/campaigns/${campaignId}`);
}

export async function rejectApplication(campaignInfluencerId: string, campaignId: string): Promise<void> {
  const brand = await getMyBrand();
  if (!brand) return;

  const supabase = await createClient();
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id")
    .eq("id", campaignId)
    .eq("brand_id", brand.id)
    .single();
  if (!campaign) return;

  await supabase
    .from("campaign_influencers")
    .update({ status: "removed" })
    .eq("id", campaignInfluencerId)
    .eq("campaign_id", campaignId);

  revalidatePath(`/brand/campaigns/${campaignId}`);
}

export async function removeFromCampaign(campaignId: string, influencerId: string): Promise<void> {
  const brand = await getMyBrand();
  if (!brand) return;

  const supabase = await createClient();
  await supabase
    .from("campaign_influencers")
    .delete()
    .eq("campaign_id", campaignId)
    .eq("influencer_id", influencerId);

  revalidatePath(`/brand/campaigns/${campaignId}`);
}

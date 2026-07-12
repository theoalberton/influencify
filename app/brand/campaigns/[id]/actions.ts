"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyBrand } from "@/lib/auth";
import { inviteInfluencerToCampaign } from "@/lib/invites";

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

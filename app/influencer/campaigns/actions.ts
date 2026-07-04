"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyInfluencer } from "@/lib/auth";
import { generateReferralCode } from "@/lib/utils";

export async function generateCampaignLink(campaignId: string): Promise<void> {
  const influencer = await getMyInfluencer();
  if (!influencer) return;

  const supabase = await createClient();
  const referral_code = generateReferralCode();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("slug")
    .eq("id", campaignId)
    .single();

  if (!campaign) return;

  const public_url = `${siteUrl}/i/${influencer.slug}/oferta/${campaign.slug}?ref=${referral_code}`;

  const { error: ciError } = await supabase.from("campaign_influencers").insert({
    campaign_id: campaignId,
    influencer_id: influencer.id,
    referral_code,
    public_url,
    status: "active",
  });

  if (ciError) return;

  await supabase.from("referrals").insert({
    referral_code,
    influencer_id: influencer.id,
    campaign_id: campaignId,
  });

  revalidatePath("/influencer/campaigns");
}

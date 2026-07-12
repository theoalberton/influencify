"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyInfluencer } from "@/lib/auth";

export async function acceptInvite(campaignInfluencerId: string): Promise<void> {
  const influencer = await getMyInfluencer();
  if (!influencer) return;

  const supabase = await createClient();
  await supabase
    .from("campaign_influencers")
    .update({ status: "active" })
    .eq("id", campaignInfluencerId)
    .eq("influencer_id", influencer.id);

  revalidatePath("/influencer/campaigns");
}

export async function declineInvite(campaignInfluencerId: string): Promise<void> {
  const influencer = await getMyInfluencer();
  if (!influencer) return;

  const supabase = await createClient();
  await supabase
    .from("campaign_influencers")
    .update({ status: "removed" })
    .eq("id", campaignInfluencerId)
    .eq("influencer_id", influencer.id);

  revalidatePath("/influencer/campaigns");
}

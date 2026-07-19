"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyInfluencer } from "@/lib/auth";
import type { CampaignStatus } from "@/lib/database.types";

export async function updateOwnCampaignStatus(campaignId: string, status: CampaignStatus): Promise<void> {
  const influencer = await getMyInfluencer();
  if (!influencer) return;

  const supabase = await createClient();

  // Campanha em análise só é liberada pelo admin — o dono não se autoaprova.
  const { data: current } = await supabase
    .from("campaigns")
    .select("status")
    .eq("id", campaignId)
    .eq("influencer_id", influencer.id)
    .single();
  if (!current || current.status === "under_review" || status === "under_review") return;

  await supabase
    .from("campaigns")
    .update({ status })
    .eq("id", campaignId)
    .eq("influencer_id", influencer.id);
  revalidatePath("/influencer/my-campaigns");
}

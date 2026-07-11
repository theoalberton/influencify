"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyInfluencer } from "@/lib/auth";
import type { CampaignStatus } from "@/lib/database.types";

export async function updateOwnCampaignStatus(campaignId: string, status: CampaignStatus): Promise<void> {
  const influencer = await getMyInfluencer();
  if (!influencer) return;

  const supabase = await createClient();
  await supabase
    .from("campaigns")
    .update({ status })
    .eq("id", campaignId)
    .eq("influencer_id", influencer.id);
  revalidatePath("/influencer/my-campaigns");
}

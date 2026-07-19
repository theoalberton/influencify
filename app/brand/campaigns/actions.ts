"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyBrand } from "@/lib/auth";
import type { CampaignStatus } from "@/lib/database.types";

export async function updateCampaignStatus(campaignId: string, status: CampaignStatus): Promise<void> {
  const brand = await getMyBrand();
  if (!brand) return;

  const supabase = await createClient();

  // Campanha em análise só é liberada pelo admin — o dono não se autoaprova.
  const { data: current } = await supabase
    .from("campaigns")
    .select("status")
    .eq("id", campaignId)
    .eq("brand_id", brand.id)
    .single();
  if (!current || current.status === "under_review" || status === "under_review") return;

  await supabase.from("campaigns").update({ status }).eq("id", campaignId).eq("brand_id", brand.id);
  revalidatePath("/brand/campaigns");
}

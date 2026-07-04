"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyBrand } from "@/lib/auth";
import type { CampaignStatus } from "@/lib/database.types";

export async function updateCampaignStatus(campaignId: string, status: CampaignStatus): Promise<void> {
  const brand = await getMyBrand();
  if (!brand) return;

  const supabase = await createClient();
  await supabase.from("campaigns").update({ status }).eq("id", campaignId).eq("brand_id", brand.id);
  revalidatePath("/brand/campaigns");
}

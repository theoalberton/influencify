"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyBrand } from "@/lib/auth";

export async function linkInfluencer(influencerId: string): Promise<void> {
  const brand = await getMyBrand();
  if (!brand) return;

  const supabase = await createClient();
  const { error } = await supabase.from("brand_influencers").insert({
    brand_id: brand.id,
    influencer_id: influencerId,
    status: "active",
  });

  // 23505 = já vinculado; silencioso porque o botão some após revalidar.
  if (error && error.code !== "23505") return;

  revalidatePath("/brand/discover");
  revalidatePath("/brand/ambassadors");
}

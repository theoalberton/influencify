"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyBrand } from "@/lib/auth";
import { notifyPartnershipInvite } from "@/lib/invites";

/** Convida o influenciador para a rede da marca — ele precisa aceitar. */
export async function linkInfluencer(influencerId: string): Promise<void> {
  const brand = await getMyBrand();
  if (!brand) return;

  const supabase = await createClient();
  const { error } = await supabase.from("brand_influencers").insert({
    brand_id: brand.id,
    influencer_id: influencerId,
    status: "invited",
  });

  // 23505 = já convidado/vinculado; silencioso porque o botão some após revalidar.
  if (error && error.code !== "23505") return;

  if (!error) {
    await notifyPartnershipInvite(supabase, { influencerId, brandName: brand.company_name });
  }

  revalidatePath("/brand/discover");
  revalidatePath("/brand/ambassadors");
}

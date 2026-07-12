"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

export async function toggleBrandActive(brandId: string, isActive: boolean): Promise<void> {
  await requireRole("admin");
  const supabase = await createClient();
  await supabase.from("brands").update({ is_active: isActive }).eq("id", brandId);
  revalidatePath("/admin/brands");
}

export async function toggleInfluencerActive(influencerId: string, isActive: boolean): Promise<void> {
  await requireRole("admin");
  const supabase = await createClient();
  await supabase.from("influencers").update({ is_active: isActive }).eq("id", influencerId);
  revalidatePath("/admin/influencers");
}

export async function markRewardPaid(rewardId: string): Promise<void> {
  await requireRole("admin");
  const supabase = await createClient();
  await supabase.from("invite_rewards").update({ status: "paid" }).eq("id", rewardId);
  revalidatePath("/admin/dashboard");
}

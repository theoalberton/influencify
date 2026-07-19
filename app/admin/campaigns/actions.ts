"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

/** Aprovação/reprovação da fila de moderação — só admin (RLS reforça). */
export async function reviewCampaign(campaignId: string, decision: "approve" | "reject"): Promise<void> {
  await requireRole("admin");

  const supabase = await createClient();
  await supabase
    .from("campaigns")
    .update({ status: decision === "approve" ? "active" : "ended" })
    .eq("id", campaignId);

  revalidatePath("/admin/campaigns");
  revalidatePath("/admin/dashboard");
}

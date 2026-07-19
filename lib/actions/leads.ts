"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import type { LeadStatus } from "@/lib/database.types";

const VALID_STATUSES: LeadStatus[] = ["new", "sent", "converted", "lost"];

/**
 * Muda o status de um lead. A RLS garante o escopo: marca nos leads das
 * campanhas dela, influenciador só nos das campanhas próprias.
 */
export async function updateLeadStatus(leadId: string, status: LeadStatus, revalidate: string): Promise<void> {
  const profile = await getCurrentProfile();
  if (!profile) return;
  if (!VALID_STATUSES.includes(status)) return;

  const supabase = await createClient();
  await supabase.from("leads").update({ status }).eq("id", leadId);

  revalidatePath(revalidate);
}

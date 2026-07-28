"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyInfluencer } from "@/lib/auth";
import { generateReferralCode } from "@/lib/utils";

export interface ApplyState {
  error?: string;
  success?: string;
}

/**
 * Candidatura a uma campanha aberta. Nasce como 'applied' — a marca decide se
 * aprova; só então o link vira público (RLS reforça essa regra).
 */
export async function applyToCampaign(campaignId: string): Promise<ApplyState> {
  const influencer = await getMyInfluencer();
  if (!influencer) return { error: "Complete o seu perfil antes de se candidatar." };

  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, slug, is_open, status")
    .eq("id", campaignId)
    .single();

  if (!campaign?.is_open || campaign.status !== "active") {
    return { error: "Esta campanha não está mais aberta a candidaturas." };
  }

  const referral_code = generateReferralCode();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.from("campaign_influencers").insert({
    campaign_id: campaignId,
    influencer_id: influencer.id,
    referral_code,
    public_url: `${siteUrl}/i/${influencer.slug}/oferta/${campaign.slug}?ref=${referral_code}`,
    status: "applied",
  });

  if (error) {
    if (error.code === "23505") return { error: "Você já se candidatou a esta campanha." };
    return { error: "Não foi possível enviar a candidatura. Tente novamente." };
  }

  revalidatePath("/influencer/oportunidades");
  return { success: "Candidatura enviada! A marca vai avaliar e você recebe a resposta aqui." };
}

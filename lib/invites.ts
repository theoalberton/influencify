import type { SupabaseClient } from "@supabase/supabase-js";
import { generateReferralCode } from "@/lib/utils";

/**
 * Cria o convite de campanha para um influenciador: linha em
 * campaign_influencers (status 'invited') já com o link rastreável pronto,
 * e o contador em referrals. O link só aparece no perfil público quando o
 * influenciador aceita (status 'active').
 */
export async function inviteInfluencerToCampaign(
  supabase: SupabaseClient,
  args: { campaignId: string; campaignSlug: string; influencerId: string; influencerSlug: string }
): Promise<{ error?: string }> {
  const referral_code = generateReferralCode();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const public_url = `${siteUrl}/i/${args.influencerSlug}/oferta/${args.campaignSlug}?ref=${referral_code}`;

  const { error } = await supabase.from("campaign_influencers").insert({
    campaign_id: args.campaignId,
    influencer_id: args.influencerId,
    referral_code,
    public_url,
    status: "invited",
  });

  if (error) {
    if (error.code === "23505") return {}; // já convidado — idempotente
    return { error: error.message };
  }

  await supabase.from("referrals").insert({
    referral_code,
    influencer_id: args.influencerId,
    campaign_id: args.campaignId,
  });

  return {};
}

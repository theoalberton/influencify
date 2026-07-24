import type { SupabaseClient } from "@supabase/supabase-js";
import { generateReferralCode } from "@/lib/utils";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, campaignInviteEmailHtml, partnershipInviteEmailHtml } from "@/lib/email";

/** Melhor e-mail disponível do influenciador: login (via service role) ou comercial. */
async function influencerEmail(
  supabase: SupabaseClient,
  influencerId: string
): Promise<{ to: string | null; displayName: string } | null> {
  const { data: influencer } = await supabase
    .from("influencers")
    .select("user_id, display_name, contact_email")
    .eq("id", influencerId)
    .single();
  if (!influencer) return null;

  let to = influencer.contact_email as string | null;
  const admin = createAdminClient();
  if (admin) {
    const { data: profile } = await admin
      .from("profiles")
      .select("email")
      .eq("user_id", influencer.user_id)
      .single();
    to = profile?.email ?? to;
  }
  return { to, displayName: influencer.display_name };
}

/** Avisa o influenciador que uma marca o convidou para a rede dela. */
export async function notifyPartnershipInvite(
  supabase: SupabaseClient,
  args: { influencerId: string; brandName: string }
): Promise<void> {
  try {
    const target = await influencerEmail(supabase, args.influencerId);
    if (!target?.to) return;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await sendEmail({
      to: target.to,
      subject: `${args.brandName} quer você na rede de influenciadores dela`,
      html: partnershipInviteEmailHtml({
        influencerName: target.displayName,
        brandName: args.brandName,
        dashboardUrl: `${siteUrl}/influencer/campaigns`,
      }),
    });
  } catch {
    // e-mail nunca bloqueia o convite
  }
}

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

  // Aviso por e-mail: sem ele o convite só é visto se o influenciador logar.
  // Falha de e-mail nunca falha o convite.
  try {
    const { data: campaign } = await supabase
      .from("campaigns")
      .select("title, brands(company_name)")
      .eq("id", args.campaignId)
      .single();
    const target = await influencerEmail(supabase, args.influencerId);

    if (campaign && target?.to) {
      const brandName =
        (campaign as unknown as { brands: { company_name: string } | null }).brands?.company_name ?? "Uma marca";
      await sendEmail({
        to: target.to,
        subject: `${brandName} convidou você para uma campanha`,
        html: campaignInviteEmailHtml({
          influencerName: target.displayName,
          brandName,
          campaignTitle: campaign.title,
          dashboardUrl: `${siteUrl}/influencer/campaigns`,
        }),
      });
    }
  } catch {
    // silencioso por design
  }

  return {};
}

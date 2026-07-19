"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyInfluencer } from "@/lib/auth";
import { sendEmail, inviteAcceptedEmailHtml } from "@/lib/email";

export async function acceptInvite(campaignInfluencerId: string): Promise<void> {
  const influencer = await getMyInfluencer();
  if (!influencer) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("campaign_influencers")
    .update({ status: "active" })
    .eq("id", campaignInfluencerId)
    .eq("influencer_id", influencer.id);

  // Fecha o ciclo: a marca fica sabendo na hora que o convite foi aceito.
  if (!error) {
    try {
      const { data: link } = await supabase
        .from("campaign_influencers")
        .select("campaigns(title, brands(company_name, email))")
        .eq("id", campaignInfluencerId)
        .single();
      const campaign = (link as unknown as {
        campaigns: { title: string; brands: { company_name: string; email: string | null } | null } | null;
      })?.campaigns;

      if (campaign?.brands?.email) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
        await sendEmail({
          to: campaign.brands.email,
          subject: `${influencer.display_name} aceitou divulgar a sua campanha`,
          html: inviteAcceptedEmailHtml({
            brandName: campaign.brands.company_name,
            influencerName: influencer.display_name,
            campaignTitle: campaign.title,
            dashboardUrl: `${siteUrl}/brand/dashboard`,
          }),
        });
      }
    } catch {
      // e-mail nunca bloqueia o aceite
    }
  }

  revalidatePath("/influencer/campaigns");
}

export async function declineInvite(campaignInfluencerId: string): Promise<void> {
  const influencer = await getMyInfluencer();
  if (!influencer) return;

  const supabase = await createClient();
  await supabase
    .from("campaign_influencers")
    .update({ status: "removed" })
    .eq("id", campaignInfluencerId)
    .eq("influencer_id", influencer.id);

  revalidatePath("/influencer/campaigns");
}

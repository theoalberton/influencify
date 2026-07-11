"use server";

import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, couponEmailHtml, newLeadEmailHtml } from "@/lib/email";
import { translateError } from "@/lib/errors";

export interface LeadFormState {
  error?: string;
  success?: boolean;
  coupon_code?: string | null;
  destination_url?: string | null;
  lead_id?: string;
  emailed?: boolean;
}

interface CampaignForLead {
  title: string;
  product_name: string | null;
  coupon_code: string | null;
  destination_url: string | null;
  status: string;
  brand_id: string | null;
  influencer_id: string | null;
  brands: { company_name: string; email: string | null; user_id: string } | null;
  influencers: { display_name: string; user_id: string } | null;
}

export async function submitLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const campaign_id = String(formData.get("campaign_id") ?? "");
  // Vazio em campanhas próprias do influenciador (sem marca envolvida).
  const brand_id = String(formData.get("brand_id") ?? "") || null;
  const influencer_id = String(formData.get("influencer_id") ?? "");
  const referral_code = String(formData.get("referral_code") ?? "") || null;
  const source = String(formData.get("source") ?? "profile");
  const medium = String(formData.get("medium") ?? "") || null;
  const campaign_utm = String(formData.get("campaign_utm") ?? "") || null;

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const consent = formData.get("consent") === "on";

  if (!name) return { error: "Informe seu nome." };
  if (!consent) return { error: "Você precisa aceitar os termos para receber o cupom." };
  if (!campaign_id) return { error: "Oferta inválida." };

  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select(
      "title, product_name, coupon_code, destination_url, status, brand_id, influencer_id, brands(company_name, email, user_id), influencers(display_name, user_id)"
    )
    .eq("id", campaign_id)
    .single<CampaignForLead>();

  if (!campaign || campaign.status !== "active") {
    return { error: "Esta oferta não está mais disponível." };
  }

  // Gera o id aqui em vez de usar .select() no insert: o visitante anônimo
  // pode inserir leads, mas o RLS (corretamente) não deixa ele ler a linha
  // de volta — um RETURNING dispararia violação de policy.
  const lead_id = randomUUID();

  const { error } = await supabase.from("leads").insert({
    id: lead_id,
    campaign_id,
    brand_id,
    influencer_id: influencer_id || null,
    referral_code,
    name,
    email,
    phone,
    city,
    consent,
    source,
    medium,
    campaign_utm,
    status: "new",
    coupon_revealed: true,
  });

  if (error) return { error: translateError(error.message) };

  const emailed = await sendLeadEmails(campaign, { lead_id, name, email, influencer_id });

  return {
    success: true,
    coupon_code: campaign.coupon_code,
    destination_url: campaign.destination_url,
    lead_id,
    emailed,
  };
}

/**
 * Dispara o cupom para o visitante e a notificação para o dono da campanha.
 * Nunca lança: e-mail é cortesia, não pode derrubar a captação do lead.
 */
async function sendLeadEmails(
  campaign: CampaignForLead,
  lead: { lead_id: string; name: string; email: string | null; influencer_id: string }
): Promise<boolean> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const ownerName =
    campaign.brands?.company_name ?? campaign.product_name ?? campaign.influencers?.display_name ?? "a marca";

  let couponSent = false;

  try {
    // 1. Cupom para o visitante
    if (lead.email) {
      couponSent = await sendEmail({
        to: lead.email,
        subject: `Seu cupom da oferta ${campaign.title}`,
        html: couponEmailHtml({
          visitorName: lead.name.split(" ")[0],
          campaignTitle: campaign.title,
          ownerName,
          couponCode: campaign.coupon_code,
          destinationUrl: campaign.destination_url,
        }),
      });
    }

    // 2. Notificação para o dono da campanha (sem expor o contato do lead —
    // isso respeita o bloqueio do plano gratuito).
    let ownerEmail = campaign.brands?.email ?? null;
    const ownerUserId = campaign.brands?.user_id ?? campaign.influencers?.user_id ?? null;

    if (!ownerEmail && ownerUserId) {
      const admin = createAdminClient();
      if (admin) {
        const { data: ownerProfile } = await admin
          .from("profiles")
          .select("email")
          .eq("user_id", ownerUserId)
          .single();
        ownerEmail = ownerProfile?.email ?? null;
      }
    }

    if (ownerEmail) {
      let promoterName: string | null = campaign.influencers?.display_name ?? null;
      if (!promoterName && lead.influencer_id) {
        const supabase = await createClient();
        const { data: promoter } = await supabase
          .from("influencers")
          .select("display_name")
          .eq("id", lead.influencer_id)
          .single();
        promoterName = promoter?.display_name ?? null;
      }

      await sendEmail({
        to: ownerEmail,
        subject: `🎉 Novo lead na campanha ${campaign.title}`,
        html: newLeadEmailHtml({
          ownerName,
          leadName: lead.name,
          campaignTitle: campaign.title,
          influencerName: campaign.brands ? promoterName : null,
          dashboardUrl: `${siteUrl}/${campaign.brands ? "brand" : "influencer"}/leads`,
        }),
      });
    }
  } catch {
    // silencioso de propósito
  }

  return couponSent;
}

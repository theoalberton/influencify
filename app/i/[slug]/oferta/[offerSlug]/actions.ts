"use server";

import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/database.types";

export interface LeadFormState {
  error?: string;
  success?: boolean;
  coupon_code?: string | null;
  destination_url?: string | null;
  lead_id?: string;
}

export async function submitLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const campaign_id = String(formData.get("campaign_id") ?? "");
  const brand_id = String(formData.get("brand_id") ?? "");
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
  if (!campaign_id || !brand_id) return { error: "Oferta inválida." };

  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("coupon_code, destination_url, status")
    .eq("id", campaign_id)
    .single<Pick<Campaign, "coupon_code" | "destination_url" | "status">>();

  if (!campaign || campaign.status !== "active") {
    return { error: "Esta oferta não está mais disponível." };
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
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
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  return {
    success: true,
    coupon_code: campaign.coupon_code,
    destination_url: campaign.destination_url,
    lead_id: lead.id,
  };
}

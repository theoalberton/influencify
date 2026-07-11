"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile, getMyInfluencer } from "@/lib/auth";
import { translateError } from "@/lib/errors";
import { slugify, generateReferralCode } from "@/lib/utils";
import type { DiscountType } from "@/lib/database.types";

export interface OwnCampaignFormState {
  error?: string;
  limitReached?: boolean;
}

const FREE_OWN_CAMPAIGN_LIMIT = 1;

export async function createOwnCampaign(
  _prev: OwnCampaignFormState,
  formData: FormData
): Promise<OwnCampaignFormState> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const influencer = await getMyInfluencer();
  if (!influencer) return { error: "Complete seu perfil público antes de criar campanhas." };

  const supabase = await createClient();

  // Plano gratuito: 1 campanha própria. Pro: ilimitadas.
  if (profile.plan_type === "free") {
    const { count } = await supabase
      .from("campaigns")
      .select("id", { count: "exact", head: true })
      .eq("influencer_id", influencer.id);

    if ((count ?? 0) >= FREE_OWN_CAMPAIGN_LIMIT) {
      return {
        limitReached: true,
        error: "O plano gratuito inclui 1 campanha própria. Faça upgrade para criar quantas quiser.",
      };
    }
  }

  const title = String(formData.get("title") ?? "").trim();
  const product_name = String(formData.get("product_name") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const image_url = String(formData.get("image_url") ?? "").trim() || null;
  const discount_type = String(formData.get("discount_type") ?? "") as DiscountType;
  const discount_value = String(formData.get("discount_value") ?? "").trim() || null;
  const coupon_code = String(formData.get("coupon_code") ?? "").trim() || null;
  const destination_url = String(formData.get("destination_url") ?? "").trim() || null;
  const start_date = String(formData.get("start_date") ?? "").trim() || null;
  const end_date = String(formData.get("end_date") ?? "").trim() || null;
  const required_fields = formData.getAll("required_fields").map(String);

  if (!title) return { error: "Informe o nome da campanha." };
  if (!discount_type) return { error: "Escolha o tipo de desconto." };

  const slug = slugify(title);

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .insert({
      influencer_id: influencer.id,
      title,
      slug,
      product_name,
      description,
      image_url,
      discount_type,
      discount_value,
      coupon_code,
      destination_url,
      start_date,
      end_date,
      required_fields: required_fields.length ? required_fields : ["name", "email"],
    })
    .select("id, slug")
    .single();

  if (error) {
    if (error.code === "23505") return { error: "Você já tem uma campanha com esse nome. Escolha outro título." };
    return { error: translateError(error.message) };
  }

  // Gera o link rastreável na hora: a campanha já nasce publicada no perfil.
  const referral_code = generateReferralCode();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const public_url = `${siteUrl}/i/${influencer.slug}/oferta/${campaign.slug}?ref=${referral_code}`;

  await supabase.from("campaign_influencers").insert({
    campaign_id: campaign.id,
    influencer_id: influencer.id,
    referral_code,
    public_url,
    status: "active",
  });

  await supabase.from("referrals").insert({
    referral_code,
    influencer_id: influencer.id,
    campaign_id: campaign.id,
  });

  redirect("/influencer/my-campaigns");
}

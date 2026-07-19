"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyBrand } from "@/lib/auth";
import { inviteInfluencerToCampaign } from "@/lib/invites";
import { translateError } from "@/lib/errors";
import { slugify } from "@/lib/utils";
import { parseCampaignForm } from "@/lib/campaign-form";
import { getCampaignRiskFlags } from "@/lib/moderation";

export interface CampaignFormState {
  error?: string;
}

export async function createCampaign(_prev: CampaignFormState, formData: FormData): Promise<CampaignFormState> {
  const brand = await getMyBrand();
  if (!brand) return { error: "Complete o perfil da marca antes de criar campanhas." };

  const values = parseCampaignForm(formData, { withPixels: true });

  if (!values.title) return { error: "Informe o nome da campanha." };
  if (!values.discount_type) return { error: "Escolha o tipo de desconto." };

  const invitedIds = formData.getAll("invited_influencers").map(String);

  const slug = slugify(values.title);
  const supabase = await createClient();

  // Texto em categoria sensível segura a campanha para revisão do admin.
  const riskFlags = getCampaignRiskFlags(values.title, values.product_name, values.description);

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .insert({
      brand_id: brand.id,
      slug,
      ...values,
      ...(riskFlags.length ? { status: "under_review" } : {}),
    })
    .select("id, slug")
    .single();

  if (error) {
    if (error.code === "23505") return { error: "Já existe uma campanha com esse nome. Escolha outro título." };
    return { error: translateError(error.message) };
  }

  // Convida somente os embaixadores selecionados — a campanha não aparece
  // automaticamente para os demais.
  if (invitedIds.length) {
    const { data: influencers } = await supabase
      .from("influencers")
      .select("id, slug")
      .in("id", invitedIds);

    for (const influencer of influencers ?? []) {
      await inviteInfluencerToCampaign(supabase, {
        campaignId: campaign.id,
        campaignSlug: campaign.slug,
        influencerId: influencer.id,
        influencerSlug: influencer.slug,
      });
    }
  }

  redirect("/brand/campaigns");
}

"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyBrand } from "@/lib/auth";
import { translateError } from "@/lib/errors";
import { parseCampaignForm } from "@/lib/campaign-form";
import { getCampaignRiskFlags } from "@/lib/moderation";

export interface EditCampaignState {
  error?: string;
}

// O slug NÃO muda na edição: os links já divulgados continuam válidos.
export async function updateCampaign(
  campaignId: string,
  _prev: EditCampaignState,
  formData: FormData
): Promise<EditCampaignState> {
  const brand = await getMyBrand();
  if (!brand) return { error: "Complete o perfil da marca antes de editar campanhas." };

  const values = parseCampaignForm(formData, { withPixels: true });
  if (!values.title) return { error: "Informe o nome da campanha." };
  if (!values.discount_type) return { error: "Escolha o tipo de desconto." };

  // Edição que introduz termo sensível volta para revisão — sem brecha pós-aprovação.
  const riskFlags = getCampaignRiskFlags(values.title, values.product_name, values.description);

  const supabase = await createClient();
  const { error } = await supabase
    .from("campaigns")
    .update({ ...values, ...(riskFlags.length ? { status: "under_review" } : {}) })
    .eq("id", campaignId)
    .eq("brand_id", brand.id);

  if (error) return { error: translateError(error.message) };

  redirect("/brand/campaigns");
}

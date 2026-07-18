"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyInfluencer } from "@/lib/auth";
import { translateError } from "@/lib/errors";
import { parseCampaignForm } from "@/lib/campaign-form";

export interface EditOwnCampaignState {
  error?: string;
}

// O slug NÃO muda na edição: os links já divulgados continuam válidos.
export async function updateOwnCampaign(
  campaignId: string,
  _prev: EditOwnCampaignState,
  formData: FormData
): Promise<EditOwnCampaignState> {
  const influencer = await getMyInfluencer();
  if (!influencer) return { error: "Complete o seu perfil antes de editar campanhas." };

  const values = parseCampaignForm(formData, { withPixels: false });
  if (!values.title) return { error: "Informe o nome da campanha." };
  if (!values.discount_type) return { error: "Escolha o tipo de desconto." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("campaigns")
    .update(values)
    .eq("id", campaignId)
    .eq("influencer_id", influencer.id);

  if (error) return { error: translateError(error.message) };

  redirect("/influencer/my-campaigns");
}

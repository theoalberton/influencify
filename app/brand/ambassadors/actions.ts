"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyBrand } from "@/lib/auth";
import type { BrandInfluencerStatus } from "@/lib/database.types";

export interface AmbassadorFormState {
  error?: string;
}

export async function addAmbassador(_prev: AmbassadorFormState, formData: FormData): Promise<AmbassadorFormState> {
  const brand = await getMyBrand();
  if (!brand) return { error: "Complete o perfil da marca primeiro." };

  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/^.*\/i\//, "");

  if (!slug) return { error: "Informe o link (slug) do influenciador." };

  const supabase = await createClient();
  const { data: influencer } = await supabase.from("influencers").select("id").eq("slug", slug).single();

  if (!influencer) return { error: "Nenhum influenciador encontrado com esse link." };

  const { error } = await supabase.from("brand_influencers").insert({
    brand_id: brand.id,
    influencer_id: influencer.id,
    status: "active",
  });

  if (error) {
    if (error.code === "23505") return { error: "Esse influenciador já está vinculado à sua marca." };
    return { error: error.message };
  }

  revalidatePath("/brand/ambassadors");
  return {};
}

export async function updateAmbassadorStatus(id: string, status: BrandInfluencerStatus): Promise<void> {
  const brand = await getMyBrand();
  if (!brand) return;

  const supabase = await createClient();
  await supabase.from("brand_influencers").update({ status }).eq("id", id).eq("brand_id", brand.id);
  revalidatePath("/brand/ambassadors");
}

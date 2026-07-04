"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyBrand } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { DiscountType } from "@/lib/database.types";

export interface CampaignFormState {
  error?: string;
}

export async function createCampaign(_prev: CampaignFormState, formData: FormData): Promise<CampaignFormState> {
  const brand = await getMyBrand();
  if (!brand) return { error: "Complete o perfil da marca antes de criar campanhas." };

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
  const meta_pixel_id = String(formData.get("meta_pixel_id") ?? "").trim() || null;
  const tiktok_pixel_id = String(formData.get("tiktok_pixel_id") ?? "").trim() || null;
  const google_tag_id = String(formData.get("google_tag_id") ?? "").trim() || null;
  const internal_notes = String(formData.get("internal_notes") ?? "").trim() || null;
  const required_fields = formData.getAll("required_fields").map(String);

  if (!title) return { error: "Informe o nome da campanha." };
  if (!discount_type) return { error: "Escolha o tipo de desconto." };

  const slug = slugify(title);
  const supabase = await createClient();

  const { error } = await supabase.from("campaigns").insert({
    brand_id: brand.id,
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
    meta_pixel_id,
    tiktok_pixel_id,
    google_tag_id,
    internal_notes,
  });

  if (error) {
    if (error.code === "23505") return { error: "Já existe uma campanha com esse nome. Escolha outro título." };
    return { error: error.message };
  }

  redirect("/brand/campaigns");
}

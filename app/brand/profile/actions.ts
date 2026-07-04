"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export interface BrandFormState {
  error?: string;
}

export async function saveBrandProfile(_prev: BrandFormState, formData: FormData): Promise<BrandFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const company_name = String(formData.get("company_name") ?? "").trim();
  const requestedSlug = String(formData.get("slug") ?? "").trim();
  const segment = String(formData.get("segment") ?? "").trim() || null;
  const website = String(formData.get("website") ?? "").trim() || null;
  const instagram = String(formData.get("instagram") ?? "").trim() || null;
  const contact_name = String(formData.get("contact_name") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const logo_url = String(formData.get("logo_url") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!company_name) {
    return { error: "Informe o nome da empresa." };
  }

  const slug = slugify(requestedSlug || company_name);
  if (!slug) return { error: "Não foi possível gerar um link válido a partir do nome." };

  const supabase = await createClient();

  const { data: existing } = await supabase.from("brands").select("id").eq("user_id", user.id).single();

  const payload = {
    user_id: user.id,
    slug,
    company_name,
    segment,
    website,
    instagram,
    contact_name,
    email,
    phone,
    logo_url,
    description,
  };

  const { error } = existing
    ? await supabase.from("brands").update(payload).eq("user_id", user.id)
    : await supabase.from("brands").insert(payload);

  if (error) {
    if (error.code === "23505") return { error: "Esse link (slug) já está em uso. Escolha outro." };
    return { error: error.message };
  }

  redirect("/brand/dashboard");
}

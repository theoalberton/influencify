"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export interface ProfileFormState {
  error?: string;
  success?: string;
}

export async function saveInfluencerProfile(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const display_name = String(formData.get("display_name") ?? "").trim();
  const requestedSlug = String(formData.get("slug") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const instagram = String(formData.get("instagram") ?? "").trim() || null;
  const tiktok = String(formData.get("tiktok") ?? "").trim() || null;
  const youtube = String(formData.get("youtube") ?? "").trim() || null;
  const niche = String(formData.get("niche") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "").trim() || null;
  const profile_image_url = String(formData.get("profile_image_url") ?? "").trim() || null;
  const whatsapp = String(formData.get("whatsapp") ?? "").trim() || null;
  const contact_email = String(formData.get("contact_email") ?? "").trim() || null;
  const share_whatsapp = formData.get("share_whatsapp") === "on";
  const share_email = formData.get("share_email") === "on";
  const followersRaw = String(formData.get("followers_count") ?? "").trim();
  const followers_count = followersRaw ? Number(followersRaw) : null;

  if (!display_name) {
    return { error: "Informe seu nome de exibição." };
  }

  // Consentimento sem o dado correspondente não faz sentido — pede o dado.
  if (share_whatsapp && !whatsapp) {
    return { error: "Você autorizou contato por WhatsApp — informe o seu número de WhatsApp comercial." };
  }
  if (share_email && !contact_email) {
    return { error: "Você autorizou contato por e-mail — informe o seu e-mail comercial." };
  }

  const slug = slugify(requestedSlug || display_name);
  if (!slug) {
    return { error: "Não foi possível gerar um link válido a partir do nome." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("influencers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const payload = {
    user_id: user.id,
    slug,
    display_name,
    bio,
    instagram,
    tiktok,
    youtube,
    niche,
    city,
    country,
    profile_image_url,
    whatsapp,
    contact_email,
    share_whatsapp,
    share_email,
    followers_count,
  };

  const { error } = existing
    ? await supabase.from("influencers").update(payload).eq("user_id", user.id)
    : await supabase.from("influencers").insert(payload);

  if (error) {
    if (error.code === "23505") {
      return { error: "Esse link (slug) já está em uso. Escolha outro." };
    }
    return { error: error.message };
  }

  redirect("/influencer/dashboard");
}

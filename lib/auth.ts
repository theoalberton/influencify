import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AccountType, Brand, Influencer, Profile } from "@/lib/database.types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
  return data;
}

/** Redireciona para /login se não houver sessão, ou para a home do papel certo se o papel não bater. */
export async function requireRole(role: AccountType) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.account_type !== role) {
    redirect(`/${profile.account_type}/dashboard`);
  }
  return profile;
}

export async function getMyInfluencer(): Promise<Influencer | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("influencers").select("*").eq("user_id", user.id).single();
  return data;
}

export async function getMyBrand(): Promise<Brand | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("brands").select("*").eq("user_id", user.id).single();
  return data;
}

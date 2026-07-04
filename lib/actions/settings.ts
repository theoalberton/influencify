"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export interface SettingsState {
  error?: string;
  success?: string;
}

export async function updateAccountSettings(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sessão expirada." };

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;

  if (!name) return { error: "Informe seu nome." };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ name, phone }).eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/influencer/settings");
  revalidatePath("/brand/settings");
  return { success: "Dados atualizados." };
}

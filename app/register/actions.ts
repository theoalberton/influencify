"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AccountType } from "@/lib/database.types";

export interface RegisterState {
  error?: string;
}

export async function registerAction(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const accountType = String(formData.get("account_type") ?? "") as AccountType;

  if (!name || !email || !password) {
    return { error: "Preencha nome, e-mail e senha." };
  }
  if (password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }
  if (accountType !== "influencer" && accountType !== "brand") {
    return { error: "Escolha se você é influenciador ou marca." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { error: error.message };
  }
  if (!data.user) {
    return { error: "Não foi possível criar a conta. Tente novamente." };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    user_id: data.user.id,
    account_type: accountType,
    name,
    email,
    phone: phone || null,
  });

  if (profileError) {
    return { error: profileError.message };
  }

  if (!data.session) {
    return {
      error:
        "Conta criada! Confirme seu e-mail (verifique a caixa de entrada) e depois faça login.",
    };
  }

  redirect(accountType === "influencer" ? "/influencer/profile" : "/brand/profile");
}

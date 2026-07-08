"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { translateError } from "@/lib/errors";

export interface ResetPasswordState {
  error?: string;
}

export async function resetPasswordAction(
  _prev: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 6) return { error: "A senha precisa ter pelo menos 6 caracteres." };
  if (password !== confirm) return { error: "As senhas não conferem." };

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Link expirado ou inválido. Solicite a redefinição novamente." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: translateError(error.message) };

  redirect("/login?reset=ok");
}

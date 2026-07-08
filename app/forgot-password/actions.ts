"use server";

import { createClient } from "@/lib/supabase/server";
import { translateError } from "@/lib/errors";

export interface ForgotPasswordState {
  error?: string;
  success?: string;
}

export async function forgotPasswordAction(
  _prev: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Informe seu e-mail." };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/confirm?next=/reset-password`,
  });

  if (error) return { error: translateError(error.message) };

  return {
    success:
      "Se este e-mail estiver cadastrado, você vai receber um link para redefinir a senha. Verifique também a caixa de spam.",
  };
}

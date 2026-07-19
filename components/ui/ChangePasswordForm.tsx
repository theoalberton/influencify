"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { translateError } from "@/lib/errors";
import { Field } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";

/** Troca de senha do usuário logado — vale para influenciador, marca e admin. */
export function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get("new_password") ?? "");
    const confirm = String(data.get("confirm_password") ?? "");

    if (password.length < 6) {
      setError("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não conferem. Digite a mesma senha nos dois campos.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (updateError) {
      setError(translateError(updateError.message));
      return;
    }

    form.reset();
    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Nova senha">
        <PasswordInput name="new_password" required minLength={6} placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
      </Field>
      <Field label="Confirmar nova senha">
        <PasswordInput name="confirm_password" required minLength={6} placeholder="Repita a nova senha" autoComplete="new-password" />
      </Field>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {success && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Senha alterada com sucesso. Use a nova senha no próximo login.
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Alterando..." : "Alterar senha"}
      </Button>
    </form>
  );
}

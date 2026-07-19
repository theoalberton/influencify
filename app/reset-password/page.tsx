"use client";

import { useActionState } from "react";
import { resetPasswordAction, type ResetPasswordState } from "./actions";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { PasswordInput } from "@/components/ui/PasswordInput";

const initialState: ResetPasswordState = {};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#dde0cb] bg-white px-4 py-3 text-sm text-[#0a3625] transition focus:border-[#0a3625] focus:outline-none focus:ring-4 focus:ring-[#0a3625]/10";

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight text-[#0a3625]">Criar nova senha</h1>
      <p className="mt-2 text-sm leading-relaxed text-[#4d584d]">
        Escolha uma nova senha para a sua conta.
      </p>

      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#0a3625]">Nova senha</label>
          <PasswordInput name="password" required minLength={6} className={inputClass} placeholder="Mínimo 6 caracteres" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0a3625]">Confirmar nova senha</label>
          <PasswordInput name="confirm" required minLength={6} className={inputClass} placeholder="Repita a senha" />
        </div>

        {state.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-[#ccda47] px-4 py-3 text-sm font-bold text-[#0a3625] transition hover:brightness-105 disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </AuthLayout>
  );
}

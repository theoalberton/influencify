"use client";

import { useActionState } from "react";
import { resetPasswordAction, type ResetPasswordState } from "./actions";
import { AuthLayout } from "@/components/layout/AuthLayout";

const initialState: ResetPasswordState = {};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#d8d2c3] bg-white px-4 py-3 text-sm text-[#113b34] transition focus:border-[#004741] focus:outline-none focus:ring-4 focus:ring-[#004741]/10";

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight text-[#113b34]">Criar nova senha</h1>
      <p className="mt-2 text-sm leading-relaxed text-[#5f6b64]">
        Escolha uma nova senha para a sua conta.
      </p>

      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#113b34]">Nova senha</label>
          <input type="password" name="password" required minLength={6} className={inputClass} placeholder="Mínimo 6 caracteres" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#113b34]">Confirmar nova senha</label>
          <input type="password" name="confirm" required minLength={6} className={inputClass} placeholder="Repita a senha" />
        </div>

        {state.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-[#004741] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#00614f] disabled:opacity-60"
        >
          {pending ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </AuthLayout>
  );
}

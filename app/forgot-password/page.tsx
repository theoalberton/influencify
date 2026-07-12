"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction, type ForgotPasswordState } from "./actions";
import { AuthLayout } from "@/components/layout/AuthLayout";

const initialState: ForgotPasswordState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, initialState);

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight text-[#113b34]">Esqueceu sua senha?</h1>
      <p className="mt-2 text-sm leading-relaxed text-[#5f6b64]">
        Digite o e-mail da sua conta e enviaremos um link para você criar uma nova senha.
      </p>

      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#113b34]">E-mail</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1.5 w-full rounded-xl border border-[#d8d2c3] bg-white px-4 py-3 text-sm text-[#113b34] transition focus:border-[#004741] focus:outline-none focus:ring-4 focus:ring-[#004741]/10"
            placeholder="voce@email.com"
          />
        </div>

        {state.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
        {state.success && (
          <p className="rounded-xl bg-[#f0ede4] px-4 py-3 text-sm text-[#113b34]">{state.success}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-[#004741] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#00614f] disabled:opacity-60"
        >
          {pending ? "Enviando..." : "Enviar link de redefinição"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[#5f6b64]">
        Lembrou a senha?{" "}
        <Link href="/login" className="font-medium text-[#004741] hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}

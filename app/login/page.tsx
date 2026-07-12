"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction, type LoginState } from "./actions";
import { AuthLayout } from "@/components/layout/AuthLayout";

const initialState: LoginState = {};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#d8d2c3] bg-white px-4 py-3 text-sm text-[#113b34] transition focus:border-[#004741] focus:outline-none focus:ring-4 focus:ring-[#004741]/10";

function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const searchParams = useSearchParams();
  const resetOk = searchParams.get("reset") === "ok";
  const linkInvalido = searchParams.get("error") === "link-invalido";

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-[#113b34]">Entrar no Influencify</h1>
      <p className="mt-2 text-sm text-[#5f6b64]">Acesse seu dashboard de influenciador ou marca.</p>

      {resetOk && (
        <p className="mt-6 rounded-xl bg-[#eaf3ec] px-4 py-3 text-sm text-emerald-700">
          Senha alterada com sucesso. Entre com a nova senha.
        </p>
      )}
      {linkInvalido && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          O link expirou ou já foi usado. Solicite a redefinição de senha novamente.
        </p>
      )}

      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#113b34]">E-mail</label>
          <input type="email" name="email" required className={inputClass} placeholder="voce@email.com" />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-[#113b34]">Senha</label>
            <Link href="/forgot-password" className="text-xs font-medium text-[#004741] hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
          <input type="password" name="password" required className={inputClass} placeholder="Sua senha" />
        </div>

        {state.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-[#004741] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#00614f] disabled:opacity-60"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[#5f6b64]">
        Ainda não tem conta?{" "}
        <Link href="/register" className="font-medium text-[#004741] hover:underline">
          Criar conta grátis
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}

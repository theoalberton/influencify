"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "./actions";
import { AuthLayout } from "@/components/layout/AuthLayout";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <AuthLayout>
      <p className="mb-2 text-sm font-semibold text-indigo-600 lg:hidden">Influencify</p>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Bem-vindo de volta</h1>
      <p className="mt-2 text-sm text-slate-500">Acesse seu dashboard de influenciador ou marca.</p>

      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">E-mail</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="voce@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Senha</label>
          <input
            type="password"
            name="password"
            required
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Sua senha"
          />
        </div>

        {state.error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110 disabled:opacity-60"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Ainda não tem conta?{" "}
        <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Criar conta grátis
        </Link>
      </p>
    </AuthLayout>
  );
}

"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction, type RegisterState } from "./actions";
import { AuthLayout } from "@/components/layout/AuthLayout";

const initialState: RegisterState = {};

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const [accountType, setAccountType] = useState<"influencer" | "brand">("influencer");

  return (
    <AuthLayout>
      <p className="mb-2 text-sm font-semibold text-indigo-600 lg:hidden">Influencify</p>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Criar conta grátis</h1>
      <p className="mt-2 text-sm text-slate-500">Transforme audiência em leads qualificados.</p>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setAccountType("influencer")}
          className={`rounded-2xl border-2 px-4 py-4 text-left transition ${
            accountType === "influencer"
              ? "border-indigo-600 bg-indigo-50/60"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="text-lg">🎥</span>
          <p className={`mt-1 text-sm font-bold ${accountType === "influencer" ? "text-indigo-700" : "text-slate-700"}`}>
            Sou influenciador
          </p>
          <p className="mt-0.5 text-xs text-slate-400">Quero monetizar minha audiência</p>
        </button>
        <button
          type="button"
          onClick={() => setAccountType("brand")}
          className={`rounded-2xl border-2 px-4 py-4 text-left transition ${
            accountType === "brand"
              ? "border-indigo-600 bg-indigo-50/60"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className="text-lg">🏢</span>
          <p className={`mt-1 text-sm font-bold ${accountType === "brand" ? "text-indigo-700" : "text-slate-700"}`}>
            Sou marca
          </p>
          <p className="mt-0.5 text-xs text-slate-400">Quero leads dos meus embaixadores</p>
        </button>
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="account_type" value={accountType} />

        <div>
          <label className="block text-sm font-medium text-slate-700">Nome</label>
          <input
            name="name"
            required
            className={inputClass}
            placeholder={accountType === "influencer" ? "Seu nome" : "Nome do responsável"}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">E-mail</label>
            <input type="email" name="email" required className={inputClass} placeholder="voce@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Telefone</label>
            <input name="phone" className={inputClass} placeholder="(11) 99999-9999" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Senha</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className={inputClass}
            placeholder="Mínimo 6 caracteres"
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
          {pending ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}

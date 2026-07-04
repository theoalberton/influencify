"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction, type RegisterState } from "./actions";

const initialState: RegisterState = {};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const [accountType, setAccountType] = useState<"influencer" | "brand">("influencer");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Criar conta no Influencify</h1>
        <p className="mt-1 text-sm text-slate-500">
          Transforme seu público em leads qualificados para marcas.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setAccountType("influencer")}
            className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
              accountType === "influencer"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            Sou influenciador
          </button>
          <button
            type="button"
            onClick={() => setAccountType("brand")}
            className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
              accountType === "brand"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            Sou marca
          </button>
        </div>

        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="account_type" value={accountType} />

          <div>
            <label className="block text-sm font-medium text-slate-700">Nome</label>
            <input
              name="name"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder={accountType === "influencer" ? "Seu nome" : "Nome do responsável"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">E-mail</label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="voce@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Telefone</label>
            <input
              name="phone"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Senha</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {state.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
          >
            {pending ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

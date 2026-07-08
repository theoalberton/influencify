"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction, type RegisterState } from "./actions";
import { AuthLayout } from "@/components/layout/AuthLayout";

const initialState: RegisterState = {};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#d2d2d7] bg-white px-4 py-3 text-sm text-[#1d1d1f] transition focus:border-[#0071e3] focus:outline-none focus:ring-4 focus:ring-[#0071e3]/10";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const [accountType, setAccountType] = useState<"influencer" | "brand">("influencer");

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Criar sua conta</h1>
      <p className="mt-2 text-sm text-[#6e6e73]">Transforme audiência em leads qualificados.</p>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setAccountType("influencer")}
          className={`rounded-2xl border px-4 py-4 text-left transition ${
            accountType === "influencer"
              ? "border-[#0071e3] bg-[#0071e3]/5 ring-1 ring-[#0071e3]"
              : "border-[#d2d2d7] hover:border-[#86868b]"
          }`}
        >
          <p className="text-sm font-semibold text-[#1d1d1f]">Influenciador</p>
          <p className="mt-0.5 text-xs text-[#6e6e73]">Monetize sua audiência</p>
        </button>
        <button
          type="button"
          onClick={() => setAccountType("brand")}
          className={`rounded-2xl border px-4 py-4 text-left transition ${
            accountType === "brand"
              ? "border-[#0071e3] bg-[#0071e3]/5 ring-1 ring-[#0071e3]"
              : "border-[#d2d2d7] hover:border-[#86868b]"
          }`}
        >
          <p className="text-sm font-semibold text-[#1d1d1f]">Marca</p>
          <p className="mt-0.5 text-xs text-[#6e6e73]">Capte leads qualificados</p>
        </button>
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="account_type" value={accountType} />

        <div>
          <label className="block text-sm font-medium text-[#1d1d1f]">Nome</label>
          <input
            name="name"
            required
            className={inputClass}
            placeholder={accountType === "influencer" ? "Seu nome" : "Nome do responsável"}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f]">E-mail</label>
            <input type="email" name="email" required className={inputClass} placeholder="voce@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f]">Telefone</label>
            <input name="phone" className={inputClass} placeholder="(11) 99999-9999" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1d1d1f]">Senha</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className={inputClass}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {state.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-[#0071e3] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#0077ed] disabled:opacity-60"
        >
          {pending ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[#6e6e73]">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-[#0071e3] hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}

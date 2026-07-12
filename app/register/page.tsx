"use client";

import { Suspense, useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { registerAction, type RegisterState } from "./actions";
import { AuthLayout } from "@/components/layout/AuthLayout";

const initialState: RegisterState = {};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#d8d2c3] bg-white px-4 py-3 text-sm text-[#113b34] transition focus:border-[#004741] focus:outline-none focus:ring-4 focus:ring-[#004741]/10";

function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const [accountType, setAccountType] = useState<"influencer" | "brand">("influencer");
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("invite") ?? "";

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-[#113b34]">Criar sua conta</h1>
      <p className="mt-2 text-sm text-[#5f6b64]">Transforme audiência em leads qualificados.</p>

      {inviteCode && (
        <p className="mt-4 rounded-xl bg-[#eef3ec] px-4 py-3 text-sm text-[#004741]">
          🎁 Você foi convidado por um influenciador do Influencify. Crie sua conta para começar.
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setAccountType("influencer")}
          className={`rounded-2xl border px-4 py-4 text-left transition ${
            accountType === "influencer"
              ? "border-[#004741] bg-[#004741]/5 ring-1 ring-[#004741]"
              : "border-[#d8d2c3] hover:border-[#85918a]"
          }`}
        >
          <p className="text-sm font-semibold text-[#113b34]">Influenciador</p>
          <p className="mt-0.5 text-xs text-[#5f6b64]">Monetize sua audiência</p>
        </button>
        <button
          type="button"
          onClick={() => setAccountType("brand")}
          className={`rounded-2xl border px-4 py-4 text-left transition ${
            accountType === "brand"
              ? "border-[#004741] bg-[#004741]/5 ring-1 ring-[#004741]"
              : "border-[#d8d2c3] hover:border-[#85918a]"
          }`}
        >
          <p className="text-sm font-semibold text-[#113b34]">Marca</p>
          <p className="mt-0.5 text-xs text-[#5f6b64]">Capte leads qualificados</p>
        </button>
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="account_type" value={accountType} />
        <input type="hidden" name="invite" value={inviteCode} />

        <div>
          <label className="block text-sm font-medium text-[#113b34]">Nome</label>
          <input
            name="name"
            required
            className={inputClass}
            placeholder={accountType === "influencer" ? "Seu nome" : "Nome do responsável"}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#113b34]">E-mail</label>
            <input type="email" name="email" required className={inputClass} placeholder="voce@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#113b34]">Telefone</label>
            <input name="phone" className={inputClass} placeholder="(11) 99999-9999" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#113b34]">Senha</label>
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
          className="w-full rounded-full bg-[#004741] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#00614f] disabled:opacity-60"
        >
          {pending ? "Criando conta..." : "Criar conta"}
        </button>

        <p className="text-center text-xs text-[#85918a]">
          Ao criar a conta você concorda com os{" "}
          <Link href="/termos" target="_blank" className="text-[#004741] hover:underline">
            Termos de Uso
          </Link>{" "}
          e a{" "}
          <Link href="/privacidade" target="_blank" className="text-[#004741] hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-[#5f6b64]">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-[#004741] hover:underline">
          Entrar
        </Link>
      </p>
    </>
  );
}

export default function RegisterPage() {
  return (
    <AuthLayout>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}

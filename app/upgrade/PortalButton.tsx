"use client";

import { useActionState } from "react";
import { openBillingPortal, type CheckoutState } from "./actions";

const initialState: CheckoutState = {};

export function PortalButton() {
  const [state, formAction, pending] = useActionState(openBillingPortal, initialState);

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-60"
      >
        {pending ? "Abrindo..." : "Gerenciar assinatura"}
      </button>
      {state.error && (
        <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">{state.error}</p>
      )}
    </form>
  );
}

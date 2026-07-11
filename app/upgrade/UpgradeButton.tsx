"use client";

import { useActionState } from "react";
import { startCheckout, type CheckoutState } from "./actions";

const initialState: CheckoutState = {};

export function UpgradeButton() {
  const [state, formAction, pending] = useActionState(startCheckout, initialState);

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#0071e3] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0077ed] disabled:opacity-60"
      >
        {pending ? "Abrindo pagamento..." : "Começar 7 dias grátis"}
      </button>
      {state.error && (
        <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">{state.error}</p>
      )}
    </form>
  );
}

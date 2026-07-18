"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createOwnCampaign, type OwnCampaignFormState } from "./actions";
import { CampaignFormFields } from "@/components/campaigns/CampaignFormFields";
import { Button } from "@/components/ui/Button";

const initialState: OwnCampaignFormState = {};

export function OwnCampaignForm() {
  const [state, formAction, pending] = useActionState(createOwnCampaign, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <CampaignFormFields imageHint="Aparece no seu perfil público, formato paisagem (16:9)." />

      {state.error && (
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {state.error}
          {state.limitReached && (
            <Link href="/upgrade" className="ml-2 font-semibold text-[#0a3625] hover:underline">
              Ver planos ›
            </Link>
          )}
        </div>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Criando..." : "Criar campanha"}
      </Button>
    </form>
  );
}

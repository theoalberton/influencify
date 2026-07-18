"use client";

import { useActionState } from "react";
import { updateOwnCampaign, type EditOwnCampaignState } from "./actions";
import { CampaignFormFields } from "@/components/campaigns/CampaignFormFields";
import { Button } from "@/components/ui/Button";
import type { Campaign } from "@/lib/database.types";

const initialState: EditOwnCampaignState = {};

export function EditOwnCampaignForm({ campaign }: { campaign: Campaign }) {
  const [state, formAction, pending] = useActionState(updateOwnCampaign.bind(null, campaign.id), initialState);

  return (
    <form action={formAction} className="space-y-5">
      <CampaignFormFields campaign={campaign} imageHint="Aparece no seu perfil público, formato paisagem (16:9)." />

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}

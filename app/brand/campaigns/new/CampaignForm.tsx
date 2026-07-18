"use client";

import { useActionState } from "react";
import { createCampaign, type CampaignFormState } from "./actions";
import { CampaignFormFields } from "@/components/campaigns/CampaignFormFields";
import { Field } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialState: CampaignFormState = {};

export interface AmbassadorOption {
  id: string;
  display_name: string;
  niche: string | null;
}

export function CampaignForm({ ambassadors }: { ambassadors: AmbassadorOption[] }) {
  const [state, formAction, pending] = useActionState(createCampaign, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <CampaignFormFields showPixels />

      <Field
        label="Convidar embaixadores"
        hint="Só os influenciadores convidados podem divulgar esta campanha — escolha os que combinam com o produto. Você também pode convidar depois."
      >
        {ambassadors.length === 0 ? (
          <p className="mt-2 rounded-xl bg-[#f4f6e8] px-4 py-3 text-sm text-[#4d584d]">
            Você ainda não tem embaixadores ativos. Vincule influenciadores em{" "}
            <a href="/brand/ambassadors" className="font-medium text-[#0a3625] hover:underline">
              Embaixadores
            </a>
            .
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            {ambassadors.map((amb) => (
              <label
                key={amb.id}
                className="flex items-center gap-3 rounded-xl border border-[#dde0cb] px-4 py-3 text-sm text-[#0a3625] transition has-[:checked]:border-[#0a3625] has-[:checked]:bg-[#0a3625]/5"
              >
                <input
                  type="checkbox"
                  name="invited_influencers"
                  value={amb.id}
                  className="rounded border-[#dde0cb] text-[#0a3625] focus:ring-[#0a3625]"
                />
                <span className="font-medium">{amb.display_name}</span>
                {amb.niche && <span className="text-xs text-[#7a8578]">{amb.niche}</span>}
              </label>
            ))}
          </div>
        )}
      </Field>

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Criando..." : "Criar campanha"}
      </Button>
    </form>
  );
}

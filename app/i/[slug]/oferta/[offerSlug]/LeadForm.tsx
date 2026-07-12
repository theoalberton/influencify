"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { submitLead, type LeadFormState } from "./actions";
import { Field, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialState: LeadFormState = {};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function LeadForm({
  campaignId,
  brandId,
  influencerId,
  referralCode,
  requiredFields,
  source,
  campaignUtm,
  metaPixelId,
}: {
  campaignId: string;
  brandId: string;
  influencerId: string;
  referralCode: string;
  requiredFields: string[];
  source: string;
  campaignUtm: string;
  metaPixelId?: string | null;
}) {
  const [state, formAction, pending] = useActionState(submitLead, initialState);

  // Evento Lead do Meta Pixel quando o formulário é convertido.
  useEffect(() => {
    if (state.success && metaPixelId && typeof window.fbq === "function") {
      window.fbq("track", "Lead");
    }
  }, [state.success, metaPixelId]);

  if (state.success) {
    return (
      <div className="rounded-2xl bg-emerald-50 p-6 text-center ring-1 ring-emerald-200">
        <p className="text-sm font-medium text-emerald-700">Cupom liberado!</p>
        {state.coupon_code && (
          <p className="mt-2 rounded-lg bg-white px-4 py-3 font-mono text-lg font-bold tracking-wider text-emerald-700 ring-1 ring-emerald-200">
            {state.coupon_code}
          </p>
        )}
        {state.emailed && (
          <p className="mt-2 text-xs text-emerald-600">Enviamos uma cópia do cupom para o seu e-mail.</p>
        )}
        {state.destination_url && (
          <a
            href={state.destination_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (state.lead_id) {
                fetch(`/api/leads/${state.lead_id}/click-store`, { method: "POST" }).catch(() => {});
              }
            }}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Ir para a loja
          </a>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="campaign_id" value={campaignId} />
      <input type="hidden" name="brand_id" value={brandId} />
      <input type="hidden" name="influencer_id" value={influencerId} />
      <input type="hidden" name="referral_code" value={referralCode} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="medium" value="link" />
      <input type="hidden" name="campaign_utm" value={campaignUtm} />

      <Field label="Nome">
        <Input name="name" required />
      </Field>

      {requiredFields.includes("email") && (
        <Field label="E-mail">
          <Input type="email" name="email" required />
        </Field>
      )}

      {requiredFields.includes("phone") && (
        <Field label="WhatsApp/Telefone">
          <Input name="phone" required placeholder="(11) 99999-9999" />
        </Field>
      )}

      {requiredFields.includes("city") && (
        <Field label="Cidade">
          <Input name="city" />
        </Field>
      )}

      <label className="flex items-start gap-2 text-xs text-slate-500">
        <input type="checkbox" name="consent" required className="mt-0.5 rounded border-[#d8d2c3] text-[#004741] focus:ring-[#004741]" />
        <span>
          Concordo em compartilhar meus dados com esta marca para receber o cupom, conforme a{" "}
          <Link href="/privacidade" target="_blank" className="text-[#004741] hover:underline">
            Política de Privacidade
          </Link>
          .
        </span>
      </label>

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando..." : "Receber cupom"}
      </Button>
    </form>
  );
}

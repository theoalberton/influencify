"use client";

import { useActionState } from "react";
import { createCampaign, type CampaignFormState } from "./actions";
import { Field, Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialState: CampaignFormState = {};

const REQUIRED_FIELD_OPTIONS = [
  { value: "name", label: "Nome" },
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
  { value: "city", label: "Cidade" },
];

export function CampaignForm() {
  const [state, formAction, pending] = useActionState(createCampaign, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome da campanha">
          <Input name="title" required placeholder="Insider 10% OFF" />
        </Field>
        <Field label="Produto/serviço">
          <Input name="product_name" placeholder="Assinatura anual" />
        </Field>
      </div>

      <Field label="Descrição da oferta">
        <Textarea name="description" rows={3} />
      </Field>

      <Field label="Imagem da oferta (URL)">
        <Input name="image_url" placeholder="https://..." />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Tipo de desconto">
          <Select name="discount_type" required defaultValue="percentage">
            <option value="percentage">Porcentagem</option>
            <option value="fixed">Valor fixo</option>
            <option value="free_shipping">Frete grátis</option>
            <option value="custom">Voucher personalizado</option>
          </Select>
        </Field>
        <Field label="Valor do desconto">
          <Input name="discount_value" placeholder="10 ou 50.00" />
        </Field>
        <Field label="Código do cupom">
          <Input name="coupon_code" placeholder="INSIDER10" />
        </Field>
      </div>

      <Field label="Link final de compra">
        <Input name="destination_url" placeholder="https://loja.com/produto" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Data de início">
          <Input type="date" name="start_date" />
        </Field>
        <Field label="Data de fim">
          <Input type="date" name="end_date" />
        </Field>
      </div>

      <Field label="Dados exigidos para liberar o cupom">
        <div className="mt-2 flex flex-wrap gap-4">
          {REQUIRED_FIELD_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="required_fields"
                value={opt.value}
                defaultChecked={opt.value === "name" || opt.value === "email"}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Meta Pixel ID">
          <Input name="meta_pixel_id" placeholder="Opcional" />
        </Field>
        <Field label="TikTok Pixel ID">
          <Input name="tiktok_pixel_id" placeholder="Opcional" />
        </Field>
        <Field label="Google Tag ID">
          <Input name="google_tag_id" placeholder="Opcional" />
        </Field>
      </div>

      <Field label="Observações internas">
        <Textarea name="internal_notes" rows={2} />
      </Field>

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Criando..." : "Criar campanha"}
      </Button>
    </form>
  );
}

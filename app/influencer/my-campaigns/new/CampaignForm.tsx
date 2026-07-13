"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createOwnCampaign, type OwnCampaignFormState } from "./actions";
import { Field, Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ThumbnailUpload } from "@/components/ui/ThumbnailUpload";

const initialState: OwnCampaignFormState = {};

const REQUIRED_FIELD_OPTIONS = [
  { value: "name", label: "Nome" },
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
  { value: "city", label: "Cidade" },
];

export function OwnCampaignForm() {
  const [state, formAction, pending] = useActionState(createOwnCampaign, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome da campanha">
          <Input name="title" required placeholder="Ex: Meu curso com 20% OFF" />
        </Field>
        <Field label="Produto/serviço" hint="É o nome que aparece no lugar da marca.">
          <Input name="product_name" placeholder="Ex: Curso Completo de Edição" />
        </Field>
      </div>

      <Field label="Descrição da oferta">
        <Textarea name="description" rows={3} />
      </Field>

      <ThumbnailUpload
        name="image_url"
        label="Imagem da oferta"
        hint="Aparece no seu perfil público, formato paisagem (16:9)."
      />

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
          <Input name="coupon_code" placeholder="MEUCUPOM10" />
        </Field>
      </div>

      <Field label="Link final de compra" hint="Para onde o visitante vai depois de pegar o cupom (sua loja, Hotmart, WhatsApp...).">
        <Input name="destination_url" placeholder="https://..." />
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
            <label key={opt.value} className="flex items-center gap-2 text-sm text-[#0a3625]">
              <input
                type="checkbox"
                name="required_fields"
                value={opt.value}
                defaultChecked={opt.value === "name" || opt.value === "email"}
                className="rounded border-[#dde0cb] text-[#0a3625] focus:ring-[#0a3625]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </Field>

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

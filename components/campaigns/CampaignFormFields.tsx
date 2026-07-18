"use client";

import { Field, Input, Textarea, Select } from "@/components/ui/Input";
import { ThumbnailUpload } from "@/components/ui/ThumbnailUpload";
import type { Campaign } from "@/lib/database.types";

const REQUIRED_FIELD_OPTIONS = [
  { value: "name", label: "Nome" },
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
  { value: "city", label: "Cidade" },
];

/**
 * Campos comuns de campanha, usados na criação e na edição.
 * Passe `campaign` para pré-preencher; `showPixels` liga os campos de
 * remarketing/observações (fluxo da marca).
 */
export function CampaignFormFields({
  campaign,
  showPixels = false,
  imageHint = "Aparece no perfil do embaixador, formato paisagem (16:9).",
}: {
  campaign?: Campaign;
  showPixels?: boolean;
  imageHint?: string;
}) {
  const requiredDefaults = campaign?.required_fields ?? ["name", "email"];

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome da campanha">
          <Input name="title" required defaultValue={campaign?.title} placeholder="Ex: Cupom de 10% na primeira compra" />
        </Field>
        <Field label="Produto/serviço">
          <Input name="product_name" defaultValue={campaign?.product_name ?? ""} placeholder="Assinatura anual" />
        </Field>
      </div>

      <Field label="Descrição da oferta">
        <Textarea name="description" rows={3} defaultValue={campaign?.description ?? ""} />
      </Field>

      <ThumbnailUpload name="image_url" label="Imagem da oferta" hint={imageHint} defaultUrl={campaign?.image_url} />

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Tipo de desconto">
          <Select name="discount_type" required defaultValue={campaign?.discount_type ?? "percentage"}>
            <option value="percentage">Porcentagem</option>
            <option value="fixed">Valor fixo</option>
            <option value="free_shipping">Frete grátis</option>
            <option value="custom">Voucher personalizado</option>
          </Select>
        </Field>
        <Field label="Valor do desconto">
          <Input name="discount_value" defaultValue={campaign?.discount_value ?? ""} placeholder="10 ou 50.00" />
        </Field>
        <Field label="Código do cupom">
          <Input name="coupon_code" defaultValue={campaign?.coupon_code ?? ""} placeholder="INSIDER10" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Link final de compra" hint="Para onde o visitante vai depois de pegar o cupom.">
          <Input name="destination_url" defaultValue={campaign?.destination_url ?? ""} placeholder="https://loja.com/produto" />
        </Field>
        <Field label="Ticket médio (R$)" hint="Valor médio de uma venda — usamos para estimar a receita gerada.">
          <Input
            name="avg_ticket"
            type="number"
            step="0.01"
            min="0"
            defaultValue={campaign?.avg_ticket ?? ""}
            placeholder="Ex: 150.00"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Data de início">
          <Input type="date" name="start_date" defaultValue={campaign?.start_date ?? ""} />
        </Field>
        <Field label="Data de fim">
          <Input type="date" name="end_date" defaultValue={campaign?.end_date ?? ""} />
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
                defaultChecked={requiredDefaults.includes(opt.value)}
                className="rounded border-[#dde0cb] text-[#0a3625] focus:ring-[#0a3625]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </Field>

      {showPixels && (
        <>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Meta Pixel ID">
              <Input name="meta_pixel_id" defaultValue={campaign?.meta_pixel_id ?? ""} placeholder="Opcional" />
            </Field>
            <Field label="TikTok Pixel ID">
              <Input name="tiktok_pixel_id" defaultValue={campaign?.tiktok_pixel_id ?? ""} placeholder="Opcional" />
            </Field>
            <Field label="Google Tag ID">
              <Input name="google_tag_id" defaultValue={campaign?.google_tag_id ?? ""} placeholder="Opcional" />
            </Field>
          </div>

          <Field label="Observações internas">
            <Textarea name="internal_notes" rows={2} defaultValue={campaign?.internal_notes ?? ""} />
          </Field>
        </>
      )}
    </>
  );
}

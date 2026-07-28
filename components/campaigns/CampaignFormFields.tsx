"use client";

import { useState } from "react";
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
  showOpenCampaign = false,
  imageHint = "Aparece no perfil do influenciador, formato paisagem (16:9).",
}: {
  campaign?: Campaign;
  showPixels?: boolean;
  showOpenCampaign?: boolean;
  imageHint?: string;
}) {
  const requiredDefaults = campaign?.required_fields ?? ["name", "email"];
  const [isOpen, setIsOpen] = useState(campaign?.is_open ?? false);
  const [rewardType, setRewardType] = useState(campaign?.reward_type ?? "per_lead");

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

      {showOpenCampaign && (
        <div className="rounded-2xl bg-[#f4f6e8] p-5">
          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              name="is_open"
              checked={isOpen}
              onChange={(e) => setIsOpen(e.target.checked)}
              className="mt-0.5 rounded border-[#dde0cb] text-[#0a3625] focus:ring-[#0a3625]"
            />
            <span className="text-sm">
              <strong className="text-[#0a3625]">Abrir para candidaturas</strong>
              <span className="mt-1 block text-xs leading-relaxed text-[#7a8578]">
                Qualquer influenciador da Influencify pode se candidatar a divulgar esta campanha — você aprova
                quem quiser. Em vez de cachê fixo, ele ganha por resultado. Ideal para trabalhar com muitos
                micro-influenciadores.
              </span>
            </span>
          </label>

          {isOpen && (
            <div className="mt-5 space-y-5 border-t border-black/5 pt-5">
              <Field label="Como o influenciador é recompensado?">
                <Select
                  name="reward_type"
                  value={rewardType}
                  onChange={(e) => setRewardType(e.target.value as typeof rewardType)}
                >
                  <option value="per_lead">Valor fixo por lead captado</option>
                  <option value="per_sale">Comissão por venda (cupom exclusivo)</option>
                  <option value="product">Produto / permuta por meta de leads</option>
                </Select>
              </Field>

              {rewardType === "per_lead" && (
                <Field label="Valor por lead (R$)" hint="Pago pelo número de leads que o influenciador captar.">
                  <Input
                    name="reward_value"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={campaign?.reward_value ?? ""}
                    placeholder="Ex: 5.00"
                    className="max-w-xs"
                  />
                </Field>
              )}

              {rewardType === "per_sale" && (
                <Field
                  label="Comissão por venda (%)"
                  hint="Cada influenciador recebe um cupom exclusivo — você identifica as vendas dele direto no seu checkout."
                >
                  <Input
                    name="reward_value"
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    defaultValue={campaign?.reward_value ?? ""}
                    placeholder="Ex: 15"
                    className="max-w-xs"
                  />
                </Field>
              )}

              {rewardType === "product" && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="O que o influenciador ganha">
                    <Input
                      name="reward_description"
                      defaultValue={campaign?.reward_description ?? ""}
                      placeholder="Ex: Kit com 3 produtos"
                    />
                  </Field>
                  <Field label="A cada quantos leads?">
                    <Input
                      name="reward_goal"
                      type="number"
                      min="1"
                      defaultValue={campaign?.reward_goal ?? ""}
                      placeholder="Ex: 10"
                    />
                  </Field>
                </div>
              )}

              <p className="rounded-xl bg-white px-4 py-3 text-xs leading-relaxed text-[#4d584d]">
                A Influencify mede e comprova os resultados de cada influenciador. <strong>O pagamento é feito
                diretamente por você</strong> (Pix, produto etc.) — combine as condições no contato comercial.
              </p>
            </div>
          )}
        </div>
      )}

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

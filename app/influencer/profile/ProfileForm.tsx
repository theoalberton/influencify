"use client";

import { useActionState } from "react";
import { saveInfluencerProfile, type ProfileFormState } from "./actions";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { Influencer } from "@/lib/database.types";

const initialState: ProfileFormState = {};

export function ProfileForm({ influencer }: { influencer: Influencer | null }) {
  const [state, formAction, pending] = useActionState(saveInfluencerProfile, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <ImageUpload
        bucket="avatars"
        name="profile_image_url"
        label="Foto de perfil"
        defaultUrl={influencer?.profile_image_url}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome de exibição">
          <Input name="display_name" required defaultValue={influencer?.display_name} placeholder="Seu nome público" />
        </Field>
        <Field label="Link público (slug)" hint="influencify.app/i/seu-slug">
          <Input name="slug" defaultValue={influencer?.slug} placeholder="seu-nome" />
        </Field>
      </div>

      <Field label="Bio curta">
        <Textarea name="bio" rows={3} defaultValue={influencer?.bio ?? ""} placeholder="Fale sobre você em uma frase." />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Instagram">
          <Input name="instagram" defaultValue={influencer?.instagram ?? ""} placeholder="@usuario" />
        </Field>
        <Field label="TikTok">
          <Input name="tiktok" defaultValue={influencer?.tiktok ?? ""} placeholder="@usuario" />
        </Field>
        <Field label="YouTube">
          <Input name="youtube" defaultValue={influencer?.youtube ?? ""} placeholder="/@canal" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Nicho">
          <Input name="niche" defaultValue={influencer?.niche ?? ""} placeholder="Fitness, moda, tech..." />
        </Field>
        <Field label="Cidade">
          <Input name="city" defaultValue={influencer?.city ?? ""} />
        </Field>
        <Field label="País">
          <Input name="country" defaultValue={influencer?.country ?? ""} placeholder="Brasil" />
        </Field>
      </div>

      <Field label="Seguidores (aprox.)">
        <Input
          type="number"
          name="followers_count"
          defaultValue={influencer?.followers_count ?? ""}
          placeholder="10000"
          className="max-w-xs"
        />
      </Field>

      <div className="rounded-2xl bg-[#f4f6e8] p-5">
        <p className="text-sm font-semibold text-[#0a3625]">Contato para parcerias com marcas</p>
        <p className="mt-1 text-xs leading-relaxed text-[#7a8578]">
          <strong className="text-[#4d584d]">Marcas cadastradas na Influencify vão usar estes dados para falar
          com você</strong> — negociar contratos, cachê e convites de campanha. Informe um telefone e um e-mail
          válidos que você realmente responde. Nada disso aparece no seu perfil público.
        </p>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="WhatsApp comercial">
            <Input name="whatsapp" defaultValue={influencer?.whatsapp ?? ""} placeholder="(11) 99999-9999" />
          </Field>
          <Field label="E-mail comercial">
            <Input
              type="email"
              name="contact_email"
              defaultValue={influencer?.contact_email ?? ""}
              placeholder="parcerias@seudominio.com"
            />
          </Field>
        </div>

        <div className="mt-4 space-y-2.5 border-t border-black/5 pt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7a8578]">
            Como as marcas podem falar com você?
          </p>
          <label className="flex items-start gap-2.5 text-sm text-[#0a3625]">
            <input
              type="checkbox"
              name="share_whatsapp"
              defaultChecked={influencer?.share_whatsapp ?? false}
              className="mt-0.5 rounded border-[#dde0cb] text-[#0a3625] focus:ring-[#0a3625]"
            />
            <span>
              Autorizo marcas a me chamarem no <strong>WhatsApp</strong>
            </span>
          </label>
          <label className="flex items-start gap-2.5 text-sm text-[#0a3625]">
            <input
              type="checkbox"
              name="share_email"
              defaultChecked={influencer?.share_email ?? false}
              className="mt-0.5 rounded border-[#dde0cb] text-[#0a3625] focus:ring-[#0a3625]"
            />
            <span>
              Autorizo marcas a me contatarem por <strong>e-mail</strong>
            </span>
          </label>
          <p className="text-xs text-[#a3ac9c]">
            Você escolhe: os dois, só um, ou nenhum. As marcas só veem o canal que você autorizar, e você pode
            mudar isso aqui quando quiser.
          </p>
        </div>
      </div>

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : influencer ? "Salvar alterações" : "Criar meu perfil"}
      </Button>
    </form>
  );
}

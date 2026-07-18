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
        <p className="text-sm font-semibold text-[#0a3625]">Contato comercial</p>
        <p className="mt-1 text-xs text-[#7a8578]">
          Visível apenas para marcas logadas na Influencify — nunca aparece no seu perfil público. É por aqui
          que as marcas negociam parcerias e cachê com você.
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
      </div>

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : influencer ? "Salvar alterações" : "Criar meu perfil"}
      </Button>
    </form>
  );
}

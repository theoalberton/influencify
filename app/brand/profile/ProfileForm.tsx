"use client";

import { useActionState } from "react";
import { saveBrandProfile, type BrandFormState } from "./actions";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Brand } from "@/lib/database.types";

const initialState: BrandFormState = {};

export function BrandProfileForm({ brand }: { brand: Brand | null }) {
  const [state, formAction, pending] = useActionState(saveBrandProfile, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome da empresa">
          <Input name="company_name" required defaultValue={brand?.company_name} placeholder="Insider" />
        </Field>
        <Field label="Link público (slug)" hint="usado internamente para identificar sua marca">
          <Input name="slug" defaultValue={brand?.slug} placeholder="insider" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Segmento">
          <Input name="segment" defaultValue={brand?.segment ?? ""} placeholder="Moda, suplementos, eventos..." />
        </Field>
        <Field label="Site">
          <Input name="website" defaultValue={brand?.website ?? ""} placeholder="https://..." />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Instagram">
          <Input name="instagram" defaultValue={brand?.instagram ?? ""} placeholder="@marca" />
        </Field>
        <Field label="Logo (URL)">
          <Input name="logo_url" defaultValue={brand?.logo_url ?? ""} placeholder="https://..." />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Responsável">
          <Input name="contact_name" defaultValue={brand?.contact_name ?? ""} />
        </Field>
        <Field label="E-mail de contato">
          <Input type="email" name="email" defaultValue={brand?.email ?? ""} />
        </Field>
        <Field label="Telefone">
          <Input name="phone" defaultValue={brand?.phone ?? ""} />
        </Field>
      </div>

      <Field label="Descrição">
        <Textarea name="description" rows={3} defaultValue={brand?.description ?? ""} />
      </Field>

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : brand ? "Salvar alterações" : "Criar perfil da marca"}
      </Button>
    </form>
  );
}

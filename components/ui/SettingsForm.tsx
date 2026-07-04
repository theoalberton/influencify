"use client";

import { useActionState } from "react";
import { updateAccountSettings, type SettingsState } from "@/lib/actions/settings";
import { Field, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Profile } from "@/lib/database.types";

const initialState: SettingsState = {};

export function SettingsForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(updateAccountSettings, initialState);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <Field label="Nome">
        <Input name="name" required defaultValue={profile.name} />
      </Field>
      <Field label="E-mail" hint="O e-mail de login não pode ser alterado no MVP.">
        <Input defaultValue={profile.email} disabled />
      </Field>
      <Field label="Telefone">
        <Input name="phone" defaultValue={profile.phone ?? ""} />
      </Field>
      <Field label="Plano atual">
        <Input defaultValue={`${profile.plan_type} · ${profile.plan_status}`} disabled className="capitalize" />
      </Field>

      {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      {state.success && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{state.success}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { addAmbassador, type AmbassadorFormState } from "./actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialState: AmbassadorFormState = {};

export function AddAmbassadorForm() {
  const [state, formAction, pending] = useActionState(addAmbassador, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[220px]">
        <label className="block text-sm font-medium text-slate-700">Link do influenciador</label>
        <Input name="slug" placeholder="Cole o link ou o slug do influenciador" required />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Adicionando..." : "Adicionar embaixador"}
      </Button>
      {state.error && <p className="w-full rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
    </form>
  );
}

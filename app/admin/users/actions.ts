"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

/**
 * Cortesia: dá o plano Pro sem cobrança. Não passa pelo gateway, então o
 * webhook da Kiwify nunca sobrescreve — só quem compra de verdade recebe
 * eventos de assinatura.
 */
export async function grantPro(profileId: string): Promise<void> {
  await requireRole("admin");

  const supabase = await createClient();
  const { data: target } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", profileId)
    .single();

  // Só influenciador e marca têm plano; admin não.
  if (!target || target.account_type === "admin") return;

  await supabase
    .from("profiles")
    .update({ plan_type: target.account_type, plan_status: "active" })
    .eq("id", profileId);

  revalidatePath("/admin/users");
}

/** Remove a cortesia: a conta volta ao plano gratuito. */
export async function revokePro(profileId: string): Promise<void> {
  await requireRole("admin");

  const supabase = await createClient();
  const { data: target } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", profileId)
    .single();

  if (!target || target.account_type === "admin") return;

  await supabase
    .from("profiles")
    .update({ plan_type: "free", plan_status: "active" })
    .eq("id", profileId);

  revalidatePath("/admin/users");
}

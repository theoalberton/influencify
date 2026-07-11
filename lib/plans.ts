import type { Profile } from "@/lib/database.types";

/**
 * Acesso aos leads é o recurso pago do MVP: contas free veem apenas a
 * contagem nos dashboards; a lista completa e o CSV exigem plano ativo.
 */
export function hasLeadAccess(profile: Profile): boolean {
  if (profile.account_type === "admin") return true;
  return profile.plan_type !== "free" && (profile.plan_status === "active" || profile.plan_status === "trialing");
}

/** Quantos leads o plano gratuito enxerga com contato completo. */
export const FREE_VISIBLE_LEADS = 10;

export const PLAN_PRICING = {
  influencer: { label: "Influenciador Pro", price: "R$ 49,90/mês" },
  brand: { label: "Marca Pro", price: "R$ 199,90/mês" },
} as const;

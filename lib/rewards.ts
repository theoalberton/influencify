import type { Campaign, RewardType } from "@/lib/database.types";
import { slugify } from "@/lib/utils";

export const REWARD_LABEL: Record<RewardType, string> = {
  per_lead: "por lead",
  per_sale: "por venda",
  product: "em produto",
};

/** Texto curto da recompensa, usado em cards e listagens. */
export function rewardSummary(campaign: Pick<Campaign, "reward_type" | "reward_value" | "reward_goal" | "reward_description">): string | null {
  const { reward_type, reward_value, reward_goal, reward_description } = campaign;
  if (!reward_type) return null;

  if (reward_type === "per_lead" && reward_value) {
    return `R$ ${Number(reward_value).toFixed(2).replace(".", ",")} por lead`;
  }
  if (reward_type === "per_sale" && reward_value) {
    return `${Number(reward_value).toFixed(0)}% por venda`;
  }
  if (reward_type === "product") {
    const goal = reward_goal ? ` a cada ${reward_goal} leads` : "";
    return `${reward_description || "Produto"}${goal}`;
  }
  return reward_description || null;
}

/** Quanto o influenciador acumulou até agora (fase 1: só por lead). */
export function earnedAmount(
  campaign: Pick<Campaign, "reward_type" | "reward_value">,
  leads: number
): number {
  if (campaign.reward_type === "per_lead" && campaign.reward_value) {
    return leads * Number(campaign.reward_value);
  }
  return 0;
}

/**
 * Cupom exclusivo do influenciador: base da campanha + primeiro nome, sem
 * acento nem espaço. É o que permite à marca atribuir vendas no próprio
 * checkout, sem integração nenhuma.
 */
export function buildInfluencerCoupon(baseCoupon: string | null, displayName: string, fallback: string): string {
  const firstName = slugify(displayName).split("-")[0].slice(0, 8).toUpperCase();
  const base = (baseCoupon ?? "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (base && firstName) return `${base}${firstName}`;
  if (firstName) return `${firstName}${fallback.slice(0, 4).toUpperCase()}`;
  return fallback.toUpperCase();
}

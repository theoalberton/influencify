"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMyInfluencer } from "@/lib/auth";
import { REWARD_PER_CYCLE, REFERRALS_PER_CYCLE } from "@/lib/plans";

/**
 * Resgata as recompensas disponíveis: cada ciclo de 3 indicados com plano Pro
 * ativo vale R$ 50. Ciclos já resgatados (linhas em invite_rewards) não contam
 * de novo.
 */
export async function claimRewards(): Promise<void> {
  const influencer = await getMyInfluencer();
  if (!influencer) return;

  const supabase = await createClient();

  const [{ data: referrals }, { count: claimedCount }] = await Promise.all([
    supabase.rpc("my_invite_referrals"),
    supabase
      .from("invite_rewards")
      .select("id", { count: "exact", head: true })
      .eq("influencer_id", influencer.id),
  ]);

  const qualified = ((referrals ?? []) as { is_pro: boolean }[]).filter((r) => r.is_pro).length;
  const earnedCycles = Math.floor(qualified / REFERRALS_PER_CYCLE);
  const available = earnedCycles - (claimedCount ?? 0);

  if (available <= 0) return;

  await supabase.from("invite_rewards").insert(
    Array.from({ length: available }, () => ({
      influencer_id: influencer.id,
      amount: REWARD_PER_CYCLE,
    }))
  );

  revalidatePath("/influencer/convites");
}

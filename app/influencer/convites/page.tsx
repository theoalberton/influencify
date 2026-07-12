import { redirect } from "next/navigation";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { formatDate } from "@/lib/utils";
import { REWARD_PER_CYCLE, REFERRALS_PER_CYCLE } from "@/lib/plans";
import { claimRewards } from "./actions";
import type { InviteReward } from "@/lib/database.types";

interface ReferralRow {
  name: string;
  is_pro: boolean;
  created_at: string;
}

const STEPS = [
  {
    number: "1",
    title: "Compartilhe seu link",
    description: "Envie seu link exclusivo para influenciadores que ainda não estão no Influencify.",
  },
  {
    number: "2",
    title: "Eles assinam o Pro",
    description: "Seu indicado cria a conta pelo seu link e ativa o plano Influenciador Pro.",
  },
  {
    number: "3",
    title: `Você ganha R$ ${REWARD_PER_CYCLE}`,
    description: `A cada ${REFERRALS_PER_CYCLE} indicados efetivados no Pro, você resgata R$ ${REWARD_PER_CYCLE}, pagos via Pix.`,
  },
];

export default async function ConvitesPage() {
  const profile = await requireRole("influencer");
  const influencer = await getMyInfluencer();
  if (!influencer) redirect("/influencer/profile");

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const inviteLink = `${siteUrl}/convite/${influencer.invite_code}`;

  const [{ data: referralsData }, { data: rewardsData }] = await Promise.all([
    supabase.rpc("my_invite_referrals"),
    supabase
      .from("invite_rewards")
      .select("*")
      .eq("influencer_id", influencer.id)
      .order("created_at", { ascending: false }),
  ]);

  const referrals = (referralsData ?? []) as ReferralRow[];
  const rewards = (rewardsData ?? []) as InviteReward[];

  const qualified = referrals.filter((r) => r.is_pro).length;
  const claimedCycles = rewards.length;
  const availableCycles = Math.floor(qualified / REFERRALS_PER_CYCLE) - claimedCycles;
  const progressInCycle = qualified % REFERRALS_PER_CYCLE;
  const totalEarned = rewards.reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <DashboardShell role="influencer" name={profile.name} title="Indique e ganhe">
      {/* Hero estilo Wise */}
      <div className="overflow-hidden rounded-3xl bg-[#004741] p-8 text-center sm:p-12">
        <h2 className="mx-auto max-w-md text-3xl font-extrabold uppercase leading-tight tracking-tight text-[#8ee6b8] sm:text-4xl">
          Convide {REFERRALS_PER_CYCLE} influenciadores e ganhe R$ {REWARD_PER_CYCLE}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/80">
          Você recebe R$ {REWARD_PER_CYCLE} para cada {REFERRALS_PER_CYCLE} influenciadores que se cadastrarem com o
          seu link exclusivo e ativarem o plano Pro. Sem limite de indicações.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/20 bg-white/5 p-4 text-left">
          <p className="text-xs font-medium text-white/60">Compartilhe o seu link</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="min-w-0 flex-1 break-all font-mono text-sm text-[#8ee6b8]">{inviteLink}</p>
            <CopyButton value={inviteLink} />
          </div>
        </div>
      </div>

      {/* Como funciona */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.number} className="rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#004741] text-sm font-bold text-white">
              {step.number}
            </div>
            <h3 className="mt-4 font-semibold text-[#113b34]">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#5f6b64]">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Progresso + recompensas */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <h3 className="text-sm font-semibold text-[#113b34]">Progresso do ciclo atual</h3>
          <div className="mt-4 flex items-center gap-3">
            {Array.from({ length: REFERRALS_PER_CYCLE }, (_, i) => (
              <div
                key={i}
                className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${
                  i < progressInCycle ? "bg-[#1baf7a] text-white" : "bg-[#f0ede4] text-[#a8b1a9]"
                }`}
              >
                {i < progressInCycle ? "✓" : i + 1}
              </div>
            ))}
            <p className="ml-2 text-sm text-[#5f6b64]">
              <strong className="text-[#113b34]">{progressInCycle}</strong> de {REFERRALS_PER_CYCLE} indicados
              efetivados neste ciclo
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f0ede4] px-4 py-3">
            <div>
              <p className="text-xs text-[#85918a]">Total ganho até agora</p>
              <p className="text-2xl font-semibold tracking-tight text-[#113b34]">
                R$ {totalEarned.toFixed(2).replace(".", ",")}
              </p>
            </div>
            {availableCycles > 0 ? (
              <form action={claimRewards}>
                <Button type="submit">
                  Resgatar R$ {(availableCycles * REWARD_PER_CYCLE).toFixed(2).replace(".", ",")}
                </Button>
              </form>
            ) : (
              <p className="text-xs text-[#85918a]">
                {qualified === 0 ? "Nenhum indicado efetivado ainda" : "Nada a resgatar no momento"}
              </p>
            )}
          </div>

          {rewards.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-medium text-[#85918a]">Histórico de recompensas</p>
              <div className="mt-2 divide-y divide-black/5">
                {rewards.map((reward) => (
                  <div key={reward.id} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="text-[#113b34]">R$ {Number(reward.amount).toFixed(2).replace(".", ",")}</span>
                    <span className="text-xs text-[#85918a]">{formatDate(reward.created_at)}</span>
                    <Badge tone={reward.status === "paid" ? "converted" : "sent"}>
                      {reward.status === "paid" ? "pago" : "aguardando pagamento"}
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-[#a8b1a9]">
                Recompensas resgatadas são pagas via Pix em até 7 dias úteis.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <h3 className="text-sm font-semibold text-[#113b34]">
            Seus indicados <span className="text-[#85918a]">({referrals.length})</span>
          </h3>
          {referrals.length === 0 ? (
            <p className="mt-4 rounded-xl bg-[#f0ede4] px-4 py-4 text-sm text-[#5f6b64]">
              Ninguém se cadastrou com o seu link ainda. Compartilhe com influenciadores que você conhece!
            </p>
          ) : (
            <div className="mt-3 divide-y divide-black/5">
              {referrals.map((referral, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#113b34]">{referral.name}</p>
                    <p className="text-xs text-[#85918a]">{formatDate(referral.created_at)}</p>
                  </div>
                  <Badge tone={referral.is_pro ? "converted" : "new"}>
                    {referral.is_pro ? "Pro efetivado ✓" : "cadastrado"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-[#a8b1a9]">
        Indicado efetivado = influenciador que se cadastrou pelo seu link e está com o plano Pro ativo (após o período
        de teste). Indicações fraudulentas ou contas duplicadas são desqualificadas.
      </p>
    </DashboardShell>
  );
}

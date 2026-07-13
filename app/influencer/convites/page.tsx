import { redirect } from "next/navigation";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/ui/Badge";
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
  { emoji: "🔗", title: "Compartilhe seu link", description: "Envie para influenciadores que ainda não estão aqui." },
  { emoji: "⚡", title: "Eles assinam o Pro", description: "Seu indicado cria a conta pelo seu link e ativa o plano." },
  { emoji: "💸", title: `Você ganha R$ ${REWARD_PER_CYCLE}`, description: "Pago via Pix a cada 3 efetivados. Sem limite." },
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
      {/* Hero: bottle green + wattle, tipografia display gigante */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0a3625] px-6 py-14 sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#ccda47]/15 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[#ccda47]/10 blur-2xl"
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ccda47]/80">Programa de indicação</p>
          <h2 className="mt-3 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-[#ccda47] sm:text-6xl">
            Indique {REFERRALS_PER_CYCLE},<br />
            ganhe <span className="text-white">R$ {REWARD_PER_CYCLE}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/70">
            A cada {REFERRALS_PER_CYCLE} influenciadores que assinarem o Pro pelo seu link, R$ {REWARD_PER_CYCLE} caem
            na sua conta via Pix. Indique quantos quiser.
          </p>

          <div className="mx-auto mt-8 flex max-w-lg flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <p className="min-w-0 flex-1 truncate rounded-full border border-[#ccda47]/40 bg-black/20 px-5 py-3 text-left font-mono text-sm text-[#ccda47]">
              {inviteLink}
            </p>
            <CopyButton value={inviteLink} />
          </div>
        </div>
      </div>

      {/* Como funciona */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <div key={step.title} className="rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ccda47] text-lg">
                {step.emoji}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#a3ac9c]">Passo {i + 1}</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#0a3625]">{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-[#4d584d]">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Progresso + indicados */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <h3 className="text-lg font-bold text-[#0a3625]">Seu progresso</h3>

          <div className="mt-5 flex items-center gap-3">
            {Array.from({ length: REFERRALS_PER_CYCLE }, (_, i) => (
              <div
                key={i}
                className={`flex h-14 w-14 items-center justify-center rounded-full text-xl font-extrabold transition ${
                  i < progressInCycle
                    ? "bg-[#ccda47] text-[#0a3625]"
                    : "border-2 border-dashed border-[#dde0cb] text-[#a3ac9c]"
                }`}
              >
                {i < progressInCycle ? "✓" : i + 1}
              </div>
            ))}
            <p className="ml-1 text-sm leading-snug text-[#4d584d]">
              <strong className="text-[#0a3625]">{progressInCycle}</strong> de {REFERRALS_PER_CYCLE} efetivados
              <br />
              neste ciclo
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#0a3625] px-5 py-4">
            <div>
              <p className="text-xs text-white/60">Total ganho</p>
              <p className="text-3xl font-extrabold tracking-tight text-[#ccda47]">
                R$ {totalEarned.toFixed(2).replace(".", ",")}
              </p>
            </div>
            {availableCycles > 0 ? (
              <form action={claimRewards}>
                <button
                  type="submit"
                  className="rounded-full bg-[#ccda47] px-6 py-2.5 text-sm font-bold text-[#0a3625] transition hover:brightness-105"
                >
                  Resgatar R$ {(availableCycles * REWARD_PER_CYCLE).toFixed(2).replace(".", ",")}
                </button>
              </form>
            ) : (
              <p className="text-xs text-white/50">
                {qualified === 0 ? "Nenhum efetivado ainda" : "Nada a resgatar agora"}
              </p>
            )}
          </div>

          {rewards.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-widest text-[#a3ac9c]">Histórico</p>
              <div className="mt-2 divide-y divide-black/5">
                {rewards.map((reward) => (
                  <div key={reward.id} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="font-semibold text-[#0a3625]">
                      R$ {Number(reward.amount).toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-xs text-[#7a8578]">{formatDate(reward.created_at)}</span>
                    <Badge tone={reward.status === "paid" ? "converted" : "sent"}>
                      {reward.status === "paid" ? "pago" : "aguardando"}
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-[#a3ac9c]">Pagamento via Pix em até 7 dias úteis após o resgate.</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <h3 className="text-lg font-bold text-[#0a3625]">
            Seus indicados <span className="text-base font-semibold text-[#a3ac9c]">({referrals.length})</span>
          </h3>
          {referrals.length === 0 ? (
            <div className="mt-4 rounded-2xl border-2 border-dashed border-[#dde0cb] px-5 py-8 text-center">
              <p className="text-3xl">📣</p>
              <p className="mt-2 text-sm font-semibold text-[#0a3625]">Ninguém pelo seu link ainda</p>
              <p className="mt-1 text-sm text-[#4d584d]">
                Manda pros criadores que você conhece — cada 3 que assinarem viram R$ {REWARD_PER_CYCLE} pra você.
              </p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-black/5">
              {referrals.map((referral, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f6e8] text-sm font-bold text-[#0a3625]">
                      {referral.name.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#0a3625]">{referral.name}</p>
                      <p className="text-xs text-[#7a8578]">{formatDate(referral.created_at)}</p>
                    </div>
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

      <p className="mt-6 text-center text-xs text-[#a3ac9c]">
        Efetivado = influenciador que assinou pelo seu link e está com o Pro ativo (após o teste grátis). Indicações
        fraudulentas são desqualificadas.
      </p>
    </DashboardShell>
  );
}

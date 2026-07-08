import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { hasLeadAccess, PLAN_PRICING } from "@/lib/plans";
import { UpgradeButton } from "./UpgradeButton";

const FREE_FEATURES = [
  "Perfil público e links rastreáveis",
  "Campanhas e cupons ilimitados para testar",
  "Contagem de cliques e leads no dashboard",
];

const PRO_FEATURES: Record<"influencer" | "brand", string[]> = {
  influencer: [
    "Nome e contato completo de cada lead",
    "Desempenho detalhado por campanha",
    "Prova de conversão para negociar com marcas",
  ],
  brand: [
    "Nome, e-mail e WhatsApp de cada lead",
    "Exportação CSV para remarketing",
    "Desempenho por influenciador",
    "Campos de pixel Meta/TikTok/Google",
  ],
};

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-[#0071e3]">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function UpgradePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.account_type === "admin") redirect("/admin/dashboard");

  const role = profile.account_type as "influencer" | "brand";
  const pro = PLAN_PRICING[role];
  const alreadyPro = hasLeadAccess(profile);
  const dashboardHref = `/${role}/dashboard`;

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href={dashboardHref} className="text-sm font-medium text-[#0071e3] hover:underline">
          ‹ Voltar ao dashboard
        </Link>

        <h1 className="mt-6 text-center text-4xl font-semibold tracking-tight text-[#1d1d1f]">
          Escolha o seu plano.
        </h1>
        <p className="mt-3 text-center text-[#6e6e73]">
          Capte leads gratuitamente. Desbloqueie o contato deles quando estiver pronto.
        </p>

        {alreadyPro && (
          <p className="mx-auto mt-6 max-w-md rounded-2xl bg-[#f0fdf4] px-5 py-4 text-center text-sm text-emerald-700">
            Seu plano <strong>{pro.label}</strong> está ativo. Obrigado por assinar!
          </p>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-3xl bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
            <h2 className="text-lg font-semibold text-[#1d1d1f]">Gratuito</h2>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-[#1d1d1f]">R$ 0</p>
            <p className="mt-1 text-xs text-[#86868b]">para sempre</p>

            <ul className="mt-6 space-y-3">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-[#6e6e73]">
                  <Check />
                  {feature}
                </li>
              ))}
              <li className="flex items-start gap-2.5 text-sm text-[#b0b0b8]">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
                  <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth={1.8} />
                  <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                </svg>
                Contato dos leads bloqueado
              </li>
            </ul>

            <p className="mt-8 rounded-full border border-[#d2d2d7] px-6 py-3 text-center text-sm font-medium text-[#6e6e73]">
              {profile.plan_type === "free" ? "Seu plano atual" : "Plano básico"}
            </p>
          </div>

          {/* Pro */}
          <div className="relative rounded-3xl bg-[#1d1d1f] p-8 text-white shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
            <span className="absolute -top-3 right-8 rounded-full bg-[#0071e3] px-3 py-1 text-xs font-semibold text-white">
              Recomendado
            </span>
            <h2 className="text-lg font-semibold">{pro.label}</h2>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{pro.price}</p>
            <p className="mt-1 text-xs text-white/50">cancele quando quiser</p>

            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/80">
                <Check />
                Tudo do plano gratuito
              </li>
              {PRO_FEATURES[role].map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-white/80">
                  <Check />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              {alreadyPro ? (
                <p className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-medium text-white/70">
                  Plano ativo
                </p>
              ) : (
                <UpgradeButton />
              )}
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-[#86868b]">
          Pagamento processado com segurança pelo Stripe. Os leads captados no plano gratuito ficam guardados e são
          liberados assim que a assinatura é ativada.
        </p>
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { hasLeadAccess, PLAN_PRICING } from "@/lib/plans";
import { UpgradeButton } from "./UpgradeButton";
import { PortalButton } from "./PortalButton";

const FREE_FEATURES: Record<"influencer" | "brand", string[]> = {
  influencer: [
    "Perfil público e links rastreáveis",
    "1 campanha própria (seu produto ou serviço)",
    "Contato completo dos 10 primeiros leads",
  ],
  brand: [
    "Campanhas, cupons e embaixadores",
    "Links rastreáveis por influenciador",
    "Contato completo dos 10 primeiros leads",
  ],
};

const PRO_FEATURES: Record<"influencer" | "brand", string[]> = {
  influencer: [
    "Campanhas próprias ilimitadas",
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
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-[#004741]">
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
    <div className="min-h-screen bg-[#f0ede4] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href={dashboardHref} className="text-sm font-medium text-[#004741] hover:underline">
          ‹ Voltar ao dashboard
        </Link>

        <h1 className="mt-6 text-center text-4xl font-semibold tracking-tight text-[#113b34]">
          Escolha o seu plano.
        </h1>
        <p className="mt-3 text-center text-[#5f6b64]">
          Capte leads gratuitamente. Desbloqueie o contato deles quando estiver pronto.
        </p>

        {alreadyPro && (
          <p className="mx-auto mt-6 max-w-md rounded-2xl bg-[#eaf3ec] px-5 py-4 text-center text-sm text-emerald-700">
            Seu plano <strong>{pro.label}</strong> está ativo. Obrigado por assinar!
          </p>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-3xl bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
            <h2 className="text-lg font-semibold text-[#113b34]">Gratuito</h2>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-[#113b34]">R$ 0</p>
            <p className="mt-1 text-xs text-[#85918a]">para sempre</p>

            <ul className="mt-6 space-y-3">
              {FREE_FEATURES[role].map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-[#5f6b64]">
                  <Check />
                  {feature}
                </li>
              ))}
              <li className="flex items-start gap-2.5 text-sm text-[#a8b1a9]">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
                  <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth={1.8} />
                  <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                </svg>
                Do 11º lead em diante, contato bloqueado
              </li>
            </ul>

            <p className="mt-8 rounded-full border border-[#d8d2c3] px-6 py-3 text-center text-sm font-medium text-[#5f6b64]">
              {profile.plan_type === "free" ? "Seu plano atual" : "Plano básico"}
            </p>
          </div>

          {/* Pro */}
          <div className="relative rounded-3xl bg-[#113b34] p-8 text-white shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
            <span className="absolute -top-3 right-8 rounded-full bg-[#004741] px-3 py-1 text-xs font-semibold text-white">
              Recomendado
            </span>
            <h2 className="text-lg font-semibold">{pro.label}</h2>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{pro.price}</p>
            <p className="mt-1 text-xs text-white/50">7 dias grátis · cancele quando quiser</p>

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

            <div className="mt-8">{alreadyPro ? <PortalButton /> : <UpgradeButton />}</div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-[#85918a]">
          Pagamento processado com segurança pelo Stripe. Os leads captados no plano gratuito ficam guardados e são
          liberados assim que a assinatura é ativada.
        </p>
      </div>
    </div>
  );
}

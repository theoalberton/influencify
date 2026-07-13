import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { hasLeadAccess, PLAN_PRICING } from "@/lib/plans";
import { kiwifyCheckoutUrl } from "@/lib/kiwify";
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

function Check({ className = "text-[#0a3625]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 shrink-0 ${className}`}>
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
  // Kiwify tem prioridade quando configurada; Stripe fica como alternativa.
  const kiwifyUrl = kiwifyCheckoutUrl(role, profile.email);

  return (
    <div className="min-h-screen bg-[#f4f6e8] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href={dashboardHref} className="text-sm font-medium text-[#0a3625] hover:underline">
          ‹ Voltar ao dashboard
        </Link>

        <h1 className="mt-6 text-center text-4xl font-semibold tracking-tight text-[#0a3625]">
          Escolha o seu plano.
        </h1>
        <p className="mt-3 text-center text-[#4d584d]">
          Capte leads gratuitamente. Desbloqueie o contato deles quando estiver pronto.
        </p>

        {alreadyPro && (
          <p className="mx-auto mt-6 max-w-md rounded-2xl bg-[#eef3d6] px-5 py-4 text-center text-sm text-emerald-700">
            Seu plano <strong>{pro.label}</strong> está ativo. Obrigado por assinar!
          </p>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-3xl bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
            <h2 className="text-lg font-semibold text-[#0a3625]">Gratuito</h2>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-[#0a3625]">R$ 0</p>
            <p className="mt-1 text-xs text-[#7a8578]">para sempre</p>

            <ul className="mt-6 space-y-3">
              {FREE_FEATURES[role].map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-[#4d584d]">
                  <Check />
                  {feature}
                </li>
              ))}
              <li className="flex items-start gap-2.5 text-sm text-[#a3ac9c]">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
                  <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth={1.8} />
                  <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                </svg>
                Do 11º lead em diante, contato bloqueado
              </li>
            </ul>

            <p className="mt-8 rounded-full border border-[#dde0cb] px-6 py-3 text-center text-sm font-medium text-[#4d584d]">
              {profile.plan_type === "free" ? "Seu plano atual" : "Plano básico"}
            </p>
          </div>

          {/* Pro */}
          <div className="relative rounded-3xl bg-[#0a3625] p-8 text-white shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
            <span className="absolute -top-3 right-8 rounded-full bg-[#ccda47] px-3 py-1 text-xs font-bold text-[#0a3625]">
              Recomendado
            </span>
            <h2 className="text-lg font-semibold">{pro.label}</h2>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{pro.price}</p>
            <p className="mt-1 text-xs text-white/50">7 dias grátis · cancele quando quiser</p>

            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/80">
                <Check className="text-[#ccda47]" />
                Tudo do plano gratuito
              </li>
              {PRO_FEATURES[role].map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-white/80">
                  <Check className="text-[#ccda47]" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              {alreadyPro ? (
                kiwifyUrl ? (
                  <p className="rounded-full border border-white/25 px-6 py-3 text-center text-sm font-medium text-white/80">
                    Plano ativo — gerencie pela sua conta Kiwify
                  </p>
                ) : (
                  <PortalButton />
                )
              ) : kiwifyUrl ? (
                <a
                  href={kiwifyUrl}
                  className="block w-full rounded-full bg-[#ccda47] px-6 py-3 text-center text-sm font-bold text-[#0a3625] transition hover:brightness-105"
                >
                  Assinar agora — 7 dias grátis
                </a>
              ) : (
                <UpgradeButton />
              )}
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-[#7a8578]">
          Pagamento processado com segurança pela {kiwifyUrl ? "Kiwify (Pix, boleto ou cartão)" : "Stripe"}. Os leads
          captados no plano gratuito ficam guardados e são liberados assim que a assinatura é ativada.
        </p>
      </div>
    </div>
  );
}

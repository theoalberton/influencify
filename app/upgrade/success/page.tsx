import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export default async function UpgradeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; provider?: string }>;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const { session_id, provider } = await searchParams;

  // Página de obrigado da Kiwify: a ativação chega pelo webhook em instantes.
  if (provider === "kiwify") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6e8] px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[#0a3625]">Pagamento confirmado!</h1>
          <p className="mt-2 text-sm text-[#4d584d]">
            Seu plano Pro será ativado automaticamente em até 1 minuto. Se demorar mais que isso, recarregue a página
            de leads ou fale com o suporte.
          </p>
          <Link
            href={`/${profile.account_type}/leads`}
            className="mt-8 inline-block rounded-full bg-[#0a3625] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#145238]"
          >
            Ver meus leads
          </Link>
        </div>
      </div>
    );
  }

  if (!session_id) redirect("/upgrade");

  const stripe = getStripe();
  if (!stripe) redirect("/upgrade");

  let activated = false;

  const session = await stripe.checkout.sessions.retrieve(session_id);
  // "no_payment_required" cobre o período de teste grátis (trial de 7 dias).
  const paidOrTrial = session.payment_status === "paid" || session.payment_status === "no_payment_required";
  if (
    paidOrTrial &&
    session.metadata?.user_id === profile.user_id &&
    (session.metadata?.plan_type === "influencer" || session.metadata?.plan_type === "brand")
  ) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        plan_type: session.metadata.plan_type,
        plan_status: session.payment_status === "paid" ? "active" : "trialing",
        stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
      })
      .eq("user_id", profile.user_id);
    activated = !error;
  }

  const dashboardHref = `/${profile.account_type}/dashboard`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6e8] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        {activated ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[#0a3625]">Assinatura ativa!</h1>
            <p className="mt-2 text-sm text-[#4d584d]">
              Seus leads já estão desbloqueados, incluindo os que foram captados no plano gratuito.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0a3625]">Pagamento em processamento</h1>
            <p className="mt-2 text-sm text-[#4d584d]">
              Não conseguimos confirmar o pagamento ainda. Se você concluiu o checkout, aguarde alguns instantes e
              recarregue esta página.
            </p>
          </>
        )}

        <Link
          href={activated ? `/${profile.account_type}/leads` : dashboardHref}
          className="mt-8 inline-block rounded-full bg-[#0a3625] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#145238]"
        >
          {activated ? "Ver meus leads" : "Voltar ao dashboard"}
        </Link>
      </div>
    </div>
  );
}

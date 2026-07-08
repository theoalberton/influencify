import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export default async function UpgradeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const { session_id } = await searchParams;
  if (!session_id) redirect("/upgrade");

  const stripe = getStripe();
  if (!stripe) redirect("/upgrade");

  let activated = false;

  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (
    session.payment_status === "paid" &&
    session.metadata?.user_id === profile.user_id &&
    (session.metadata?.plan_type === "influencer" || session.metadata?.plan_type === "brand")
  ) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ plan_type: session.metadata.plan_type, plan_status: "active" })
      .eq("user_id", profile.user_id);
    activated = !error;
  }

  const dashboardHref = `/${profile.account_type}/dashboard`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        {activated ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[#1d1d1f]">Assinatura ativa!</h1>
            <p className="mt-2 text-sm text-[#6e6e73]">
              Seus leads já estão desbloqueados, incluindo os que foram captados no plano gratuito.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Pagamento em processamento</h1>
            <p className="mt-2 text-sm text-[#6e6e73]">
              Não conseguimos confirmar o pagamento ainda. Se você concluiu o checkout, aguarde alguns instantes e
              recarregue esta página.
            </p>
          </>
        )}

        <Link
          href={activated ? `/${profile.account_type}/leads` : dashboardHref}
          className="mt-8 inline-block rounded-full bg-[#0071e3] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#0077ed]"
        >
          {activated ? "Ver meus leads" : "Voltar ao dashboard"}
        </Link>
      </div>
    </div>
  );
}

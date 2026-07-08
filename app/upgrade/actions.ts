"use server";

import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { getStripe, priceIdForRole } from "@/lib/stripe";

export interface CheckoutState {
  error?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function startCheckout(_prev: CheckoutState, _formData: FormData): Promise<CheckoutState> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.account_type === "admin") return { error: "Contas admin não precisam de plano." };

  const role = profile.account_type;
  const stripe = getStripe();
  if (!stripe) {
    return {
      error:
        "Pagamentos ainda não configurados neste ambiente. Defina STRIPE_SECRET_KEY e os price IDs no .env.local (veja o README).",
    };
  }

  const priceId = priceIdForRole(role);
  if (!priceId) {
    return {
      error: `Price ID do plano ${role === "influencer" ? "Influenciador" : "Marca"} não configurado (STRIPE_PRICE_${role.toUpperCase()}).`,
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: profile.email,
    metadata: { user_id: profile.user_id, plan_type: role },
    success_url: `${siteUrl}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/upgrade`,
  });

  if (!session.url) return { error: "Não foi possível iniciar o checkout. Tente novamente." };

  redirect(session.url);
}

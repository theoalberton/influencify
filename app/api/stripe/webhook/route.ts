import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Mantém o plano sincronizado com o Stripe: ativação, renovação, falha de
// pagamento e cancelamento. Requer STRIPE_WEBHOOK_SECRET e
// SUPABASE_SERVICE_ROLE_KEY configurados.
export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const admin = createAdminClient();

  if (!stripe || !webhookSecret || !admin) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 501 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const planType = session.metadata?.plan_type;
      if (userId && (planType === "influencer" || planType === "brand")) {
        await admin
          .from("profiles")
          .update({
            plan_type: planType,
            plan_status: session.payment_status === "paid" ? "active" : "trialing",
            stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
          })
          .eq("user_id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const userId = subscription.metadata?.user_id;
      if (userId) {
        const status =
          subscription.status === "active"
            ? "active"
            : subscription.status === "trialing"
              ? "trialing"
              : subscription.status === "past_due"
                ? "past_due"
                : "canceled";
        await admin.from("profiles").update({ plan_status: status }).eq("user_id", userId);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const userId = subscription.metadata?.user_id;
      if (userId) {
        await admin
          .from("profiles")
          .update({ plan_type: "free", plan_status: "active" })
          .eq("user_id", userId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

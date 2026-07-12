import { NextResponse, type NextRequest } from "next/server";
import { verifyKiwifySignature } from "@/lib/kiwify";
import { createAdminClient } from "@/lib/supabase/admin";

// Mantém o plano sincronizado com a Kiwify. Configure o webhook no painel da
// Kiwify apontando para /api/kiwify/webhook com os eventos de compra aprovada,
// assinatura renovada/atrasada/cancelada, reembolso e chargeback.

const ACTIVATE_EVENTS = new Set(["order_approved", "subscription_renewed"]);
const DOWNGRADE_EVENTS = new Set(["subscription_canceled", "order_refunded", "chargeback"]);
const LATE_EVENTS = new Set(["subscription_late"]);

interface KiwifyPayload {
  webhook_event_type?: string;
  order_status?: string;
  Customer?: { email?: string };
  customer?: { email?: string };
  Product?: { product_name?: string };
  product?: { product_name?: string };
}

export async function POST(request: NextRequest) {
  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY não configurada." }, { status: 501 });
  }

  const rawBody = await request.text();
  const signature = request.nextUrl.searchParams.get("signature");

  if (!verifyKiwifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  }

  let payload: KiwifyPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const event = payload.webhook_event_type ?? "";
  const email = (payload.Customer?.email ?? payload.customer?.email ?? "").trim().toLowerCase();

  if (!email) return NextResponse.json({ received: true, skipped: "sem e-mail" });

  const { data: profile } = await admin
    .from("profiles")
    .select("user_id, account_type")
    .ilike("email", email)
    .maybeSingle();

  if (!profile || (profile.account_type !== "influencer" && profile.account_type !== "brand")) {
    return NextResponse.json({ received: true, skipped: "perfil não encontrado" });
  }

  if (ACTIVATE_EVENTS.has(event)) {
    await admin
      .from("profiles")
      .update({ plan_type: profile.account_type, plan_status: "active" })
      .eq("user_id", profile.user_id);
  } else if (DOWNGRADE_EVENTS.has(event)) {
    await admin
      .from("profiles")
      .update({ plan_type: "free", plan_status: "active" })
      .eq("user_id", profile.user_id);
  } else if (LATE_EVENTS.has(event)) {
    await admin.from("profiles").update({ plan_status: "past_due" }).eq("user_id", profile.user_id);
  }

  return NextResponse.json({ received: true });
}

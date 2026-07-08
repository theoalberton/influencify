import Stripe from "stripe";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

/** Price ID do Stripe para cada plano pago, configurado via env. */
export function priceIdForRole(role: "influencer" | "brand"): string | undefined {
  return role === "influencer" ? process.env.STRIPE_PRICE_INFLUENCER : process.env.STRIPE_PRICE_BRAND;
}

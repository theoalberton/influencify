import { createHmac } from "crypto";

/** Link de checkout da Kiwify para o papel, com dados pré-preenchidos. */
export function kiwifyCheckoutUrl(role: "influencer" | "brand", email?: string | null): string | null {
  const base = role === "influencer" ? process.env.KIWIFY_CHECKOUT_INFLUENCER : process.env.KIWIFY_CHECKOUT_BRAND;
  if (!base) return null;
  const url = new URL(base);
  if (email) url.searchParams.set("email", email);
  return url.toString();
}

export function kiwifyConfigured(): boolean {
  return Boolean(process.env.KIWIFY_CHECKOUT_INFLUENCER || process.env.KIWIFY_CHECKOUT_BRAND);
}

/**
 * Valida a assinatura do webhook da Kiwify: HMAC-SHA1 do corpo bruto usando o
 * token do webhook, enviado no query param `signature`.
 */
export function verifyKiwifySignature(rawBody: string, signature: string | null): boolean {
  const token = process.env.KIWIFY_WEBHOOK_TOKEN;
  if (!token || !signature) return false;
  const expected = createHmac("sha1", token).update(rawBody).digest("hex");
  return expected === signature;
}

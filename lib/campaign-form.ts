import type { DiscountType } from "@/lib/database.types";

/** Converte o FormData dos formulários de campanha nas colunas editáveis. */
export function parseCampaignForm(formData: FormData, { withPixels }: { withPixels: boolean }) {
  const required_fields = formData.getAll("required_fields").map(String);
  const avgTicketRaw = String(formData.get("avg_ticket") ?? "").trim();
  const avg_ticket = avgTicketRaw ? Number(avgTicketRaw.replace(",", ".")) : null;

  const base = {
    title: String(formData.get("title") ?? "").trim(),
    product_name: String(formData.get("product_name") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    discount_type: String(formData.get("discount_type") ?? "") as DiscountType,
    discount_value: String(formData.get("discount_value") ?? "").trim() || null,
    coupon_code: String(formData.get("coupon_code") ?? "").trim() || null,
    destination_url: String(formData.get("destination_url") ?? "").trim() || null,
    avg_ticket: avg_ticket !== null && Number.isFinite(avg_ticket) && avg_ticket >= 0 ? avg_ticket : null,
    start_date: String(formData.get("start_date") ?? "").trim() || null,
    end_date: String(formData.get("end_date") ?? "").trim() || null,
    required_fields: required_fields.length ? required_fields : ["name", "email"],
  };

  if (!withPixels) return base;

  return {
    ...base,
    meta_pixel_id: String(formData.get("meta_pixel_id") ?? "").trim() || null,
    tiktok_pixel_id: String(formData.get("tiktok_pixel_id") ?? "").trim() || null,
    google_tag_id: String(formData.get("google_tag_id") ?? "").trim() || null,
    internal_notes: String(formData.get("internal_notes") ?? "").trim() || null,
  };
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMyBrand } from "@/lib/auth";
import { toCsv } from "@/lib/utils";

export async function GET() {
  const brand = await getMyBrand();
  if (!brand) return NextResponse.json({ error: "Marca não encontrada." }, { status: 404 });

  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*, campaigns(title), influencers(display_name)")
    .eq("brand_id", brand.id)
    .order("created_at", { ascending: false });

  const rows = (leads ?? []).map((lead) => ({
    nome: lead.name,
    email: lead.email,
    telefone: lead.phone,
    cidade: lead.city,
    campanha: (lead as { campaigns?: { title?: string } }).campaigns?.title ?? "",
    influenciador: (lead as { influencers?: { display_name?: string } }).influencers?.display_name ?? "",
    origem: lead.source,
    status: lead.status,
    data: lead.created_at,
  }));

  const csv = toCsv(rows);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${brand.slug}.csv"`,
    },
  });
}

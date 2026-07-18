import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireRole, getMyBrand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { EditCampaignForm } from "./EditCampaignForm";
import type { Campaign } from "@/lib/database.types";

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireRole("brand");
  const brand = await getMyBrand();
  if (!brand) redirect("/brand/profile");

  const { id } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("brand_id", brand.id)
    .single();

  if (!campaign) notFound();

  return (
    <DashboardShell role="brand" name={profile.name} title={`Editar · ${campaign.title}`}>
      <Link href="/brand/campaigns" className="text-sm font-medium text-[#0a3625] hover:underline">
        ‹ Voltar às campanhas
      </Link>

      <Card className="mt-4 max-w-3xl">
        <EditCampaignForm campaign={campaign as Campaign} />
      </Card>
    </DashboardShell>
  );
}

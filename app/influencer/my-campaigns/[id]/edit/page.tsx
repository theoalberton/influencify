import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { EditOwnCampaignForm } from "./EditOwnCampaignForm";
import type { Campaign } from "@/lib/database.types";

export default async function EditOwnCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireRole("influencer");
  const influencer = await getMyInfluencer();
  if (!influencer) redirect("/influencer/profile");

  const { id } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("influencer_id", influencer.id)
    .single();

  if (!campaign) notFound();

  return (
    <DashboardShell role="influencer" name={profile.name} title={`Editar · ${campaign.title}`}>
      <Link href="/influencer/my-campaigns" className="text-sm font-medium text-[#0a3625] hover:underline">
        ‹ Voltar às minhas campanhas
      </Link>

      <Card className="mt-4 max-w-3xl">
        <EditOwnCampaignForm campaign={campaign as Campaign} />
      </Card>
    </DashboardShell>
  );
}

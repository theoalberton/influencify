import { redirect } from "next/navigation";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { OwnCampaignForm } from "./CampaignForm";

export default async function NewOwnCampaignPage() {
  const profile = await requireRole("influencer");
  const influencer = await getMyInfluencer();
  if (!influencer) redirect("/influencer/profile");

  return (
    <DashboardShell role="influencer" name={profile.name} title="Nova campanha própria">
      <Card className="max-w-3xl">
        <p className="mb-5 rounded-xl bg-[#f0ede4] px-4 py-3 text-sm text-[#5f6b64]">
          Campanha própria é a oferta de um produto ou serviço <strong>seu</strong> (curso, mentoria, loja,
          comunidade...). Ela aparece no seu perfil público e os leads captados são só seus.
        </p>
        <OwnCampaignForm />
      </Card>
    </DashboardShell>
  );
}

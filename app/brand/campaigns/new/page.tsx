import { requireRole, getMyBrand } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { CampaignForm } from "./CampaignForm";

export default async function NewCampaignPage() {
  const profile = await requireRole("brand");
  const brand = await getMyBrand();
  if (!brand) redirect("/brand/profile");

  return (
    <DashboardShell role="brand" name={profile.name} title="Nova campanha">
      <Card className="max-w-3xl">
        <CampaignForm />
      </Card>
    </DashboardShell>
  );
}

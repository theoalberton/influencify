import { requireRole } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { SettingsForm } from "@/components/ui/SettingsForm";

export default async function InfluencerSettingsPage() {
  const profile = await requireRole("influencer");

  return (
    <DashboardShell role="influencer" name={profile.name} title="Configurações">
      <Card className="max-w-md">
        <SettingsForm profile={profile} />
      </Card>
    </DashboardShell>
  );
}

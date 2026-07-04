import { requireRole } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { SettingsForm } from "@/components/ui/SettingsForm";

export default async function BrandSettingsPage() {
  const profile = await requireRole("brand");

  return (
    <DashboardShell role="brand" name={profile.name} title="Configurações">
      <Card className="max-w-md">
        <SettingsForm profile={profile} />
      </Card>
    </DashboardShell>
  );
}

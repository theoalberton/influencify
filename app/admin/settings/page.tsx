import { requireRole } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { SettingsForm } from "@/components/ui/SettingsForm";
import { ChangePasswordForm } from "@/components/ui/ChangePasswordForm";

export default async function AdminSettingsPage() {
  const profile = await requireRole("admin");

  return (
    <DashboardShell role="admin" name={profile.name} title="Configurações">
      <div className="max-w-md space-y-6">
        <Card>
          <SettingsForm profile={profile} />
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-[#0a3625]">Alterar senha</h2>
          <ChangePasswordForm />
        </Card>
      </div>
    </DashboardShell>
  );
}

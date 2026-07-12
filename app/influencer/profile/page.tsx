import { requireRole, getMyInfluencer } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { ProfileForm } from "./ProfileForm";

export default async function InfluencerProfilePage() {
  const profile = await requireRole("influencer");
  const influencer = await getMyInfluencer();

  return (
    <DashboardShell role="influencer" name={profile.name} title="Meu perfil público">
      <Card className="max-w-3xl">
        {!influencer && (
          <p className="mb-5 rounded-lg bg-[#eef3ec] px-3 py-2 text-sm text-[#004741]">
            Complete seu perfil para liberar o dashboard e começar a divulgar ofertas.
          </p>
        )}
        <ProfileForm influencer={influencer} />
      </Card>
    </DashboardShell>
  );
}

import { requireRole, getMyBrand } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { BrandProfileForm } from "./ProfileForm";

export default async function BrandProfilePage() {
  const profile = await requireRole("brand");
  const brand = await getMyBrand();

  return (
    <DashboardShell role="brand" name={profile.name} title="Perfil da marca">
      <Card className="max-w-3xl">
        {!brand && (
          <p className="mb-5 rounded-lg bg-[#eef3ec] px-3 py-2 text-sm text-[#004741]">
            Complete o perfil da sua marca para começar a criar campanhas e cupons.
          </p>
        )}
        <BrandProfileForm brand={brand} />
      </Card>
    </DashboardShell>
  );
}

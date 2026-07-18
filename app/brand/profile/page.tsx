import { requireRole, getMyBrand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { ProfilePreviewCard } from "@/components/ui/ProfilePreviewCard";
import { BrandProfileForm } from "./ProfileForm";

export default async function BrandProfilePage() {
  const profile = await requireRole("brand");
  const brand = await getMyBrand();

  let campaignsCount = 0;
  let leadsCount = 0;
  if (brand) {
    const supabase = await createClient();
    const [{ count: campaigns }, { count: leads }] = await Promise.all([
      supabase
        .from("campaigns")
        .select("id", { count: "exact", head: true })
        .eq("brand_id", brand.id)
        .eq("status", "active"),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("brand_id", brand.id),
    ]);
    campaignsCount = campaigns ?? 0;
    leadsCount = leads ?? 0;
  }

  return (
    <DashboardShell role="brand" name={profile.name} title="Perfil da marca">
      <div className="max-w-3xl">
        {brand && (
          <ProfilePreviewCard
            imageUrl={brand.logo_url}
            name={brand.company_name}
            subtitle={brand.website}
            bio={brand.description}
            pills={[brand.segment, brand.instagram].filter((p): p is string => Boolean(p))}
            stats={[
              { value: String(campaignsCount), label: campaignsCount === 1 ? "campanha ativa" : "campanhas ativas" },
              { value: String(leadsCount), label: "leads captados" },
            ]}
          />
        )}

        <Card>
          {!brand && (
            <p className="mb-5 rounded-lg bg-[#eef3d6] px-3 py-2 text-sm text-[#0a3625]">
              Complete o perfil da sua marca para começar a criar campanhas e cupons.
            </p>
          )}
          <BrandProfileForm brand={brand} />
        </Card>
      </div>
    </DashboardShell>
  );
}

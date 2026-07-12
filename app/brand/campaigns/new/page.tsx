import { requireRole, getMyBrand } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { CampaignForm, type AmbassadorOption } from "./CampaignForm";
import type { Influencer } from "@/lib/database.types";

export default async function NewCampaignPage() {
  const profile = await requireRole("brand");
  const brand = await getMyBrand();
  if (!brand) redirect("/brand/profile");

  const supabase = await createClient();
  const { data: links } = await supabase
    .from("brand_influencers")
    .select("influencers(id, display_name, niche)")
    .eq("brand_id", brand.id)
    .eq("status", "active");

  const ambassadors: AmbassadorOption[] = (links ?? [])
    .map((l) => (l as unknown as { influencers: Pick<Influencer, "id" | "display_name" | "niche"> | null }).influencers)
    .filter((i): i is AmbassadorOption => i !== null);

  return (
    <DashboardShell role="brand" name={profile.name} title="Nova campanha">
      <Card className="max-w-3xl">
        <CampaignForm ambassadors={ambassadors} />
      </Card>
    </DashboardShell>
  );
}

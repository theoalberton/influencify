import { redirect } from "next/navigation";
import { requireRole, getMyBrand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Table";
import { formatDate, formatDiscount } from "@/lib/utils";
import { updateCampaignStatus } from "./actions";
import type { CampaignStatus } from "@/lib/database.types";

export default async function BrandCampaignsPage() {
  const profile = await requireRole("brand");
  const brand = await getMyBrand();
  if (!brand) redirect("/brand/profile");

  const supabase = await createClient();
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("brand_id", brand.id)
    .order("created_at", { ascending: false });

  return (
    <DashboardShell
      role="brand"
      name={profile.name}
      title="Campanhas"
      actions={
        <LinkButton href="/brand/campaigns/new" variant="primary">
          Nova campanha
        </LinkButton>
      }
    >
      {!campaigns || campaigns.length === 0 ? (
        <EmptyState title="Nenhuma campanha criada ainda" description="Crie sua primeira campanha para começar a captar leads." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{campaign.title}</h3>
                  <p className="text-sm text-slate-500">{campaign.product_name}</p>
                </div>
                <Badge tone={campaign.status}>{campaign.status}</Badge>
              </div>

              <p className="mt-2 text-sm font-medium text-indigo-600">
                {formatDiscount(campaign.discount_type, campaign.discount_value)}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {formatDate(campaign.start_date)} — {formatDate(campaign.end_date)}
              </p>

              <div className="mt-4 flex gap-2">
                {(["active", "paused", "ended"] as CampaignStatus[])
                  .filter((s) => s !== campaign.status)
                  .map((status) => (
                    <form key={status} action={updateCampaignStatus.bind(null, campaign.id, status)}>
                      <Button type="submit" size="sm" variant="secondary">
                        {status === "active" ? "Ativar" : status === "paused" ? "Pausar" : "Encerrar"}
                      </Button>
                    </form>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

import { redirect } from "next/navigation";
import { requireRole, getMyBrand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
            >
              <div className="relative aspect-video w-full bg-slate-100">
                {campaign.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={campaign.image_url} alt={campaign.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-fuchsia-100 text-2xl font-bold text-indigo-300">
                    {campaign.title.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                  {formatDiscount(campaign.discount_type, campaign.discount_value)}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-900">{campaign.title}</h3>
                    <p className="truncate text-sm text-slate-500">{campaign.product_name}</p>
                  </div>
                  <Badge tone={campaign.status}>{campaign.status}</Badge>
                </div>

                <p className="mt-2 text-xs text-slate-400">
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
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

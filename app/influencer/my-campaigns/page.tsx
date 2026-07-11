import { redirect } from "next/navigation";
import Link from "next/link";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Table";
import { CopyButton } from "@/components/ui/CopyButton";
import { formatDiscount } from "@/lib/utils";
import { updateOwnCampaignStatus } from "./actions";
import type { CampaignStatus } from "@/lib/database.types";

export default async function MyCampaignsPage() {
  const profile = await requireRole("influencer");
  const influencer = await getMyInfluencer();
  if (!influencer) redirect("/influencer/profile");

  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("influencer_id", influencer.id)
    .order("created_at", { ascending: false });

  const { data: links } = await supabase
    .from("campaign_influencers")
    .select("campaign_id, public_url")
    .eq("influencer_id", influencer.id);

  const linkByCampaign = new Map((links ?? []).map((l) => [l.campaign_id, l.public_url as string | null]));
  const isFree = profile.plan_type === "free";
  const atLimit = isFree && (campaigns?.length ?? 0) >= 1;

  return (
    <DashboardShell
      role="influencer"
      name={profile.name}
      title="Minhas campanhas"
      actions={
        atLimit ? (
          <LinkButton href="/upgrade" variant="secondary">
            Upgrade para criar mais
          </LinkButton>
        ) : (
          <LinkButton href="/influencer/my-campaigns/new" variant="primary">
            Nova campanha
          </LinkButton>
        )
      }
    >
      {isFree && (
        <p className="mb-5 rounded-2xl bg-white px-5 py-4 text-sm text-[#6e6e73] shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          Seu plano gratuito inclui <strong>1 campanha própria</strong>.{" "}
          <Link href="/upgrade" className="font-medium text-[#0071e3] hover:underline">
            Faça upgrade
          </Link>{" "}
          para criar quantas quiser e liberar o contato dos seus leads.
        </p>
      )}

      {!campaigns || campaigns.length === 0 ? (
        <EmptyState
          title="Você ainda não criou nenhuma campanha própria"
          description="Divulgue um produto ou serviço seu e capte leads direto do seu perfil público."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
              <div className="relative aspect-video w-full bg-[#f5f5f7]">
                {campaign.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={campaign.image_url} alt={campaign.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#e8e8ed] text-2xl font-semibold text-[#b0b0b8]">
                    {campaign.title.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
                  {formatDiscount(campaign.discount_type, campaign.discount_value)}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-[#1d1d1f]">{campaign.title}</h3>
                    <p className="truncate text-sm text-[#86868b]">{campaign.product_name}</p>
                  </div>
                  <Badge tone={campaign.status}>{campaign.status}</Badge>
                </div>

                {linkByCampaign.get(campaign.id) && (
                  <div className="mt-3 space-y-2">
                    <p className="break-all rounded-lg bg-[#f5f5f7] px-3 py-2 font-mono text-xs text-[#6e6e73]">
                      {linkByCampaign.get(campaign.id)}
                    </p>
                    <CopyButton value={linkByCampaign.get(campaign.id) ?? ""} />
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  {(["active", "paused", "ended"] as CampaignStatus[])
                    .filter((s) => s !== campaign.status)
                    .map((status) => (
                      <form key={status} action={updateOwnCampaignStatus.bind(null, campaign.id, status)}>
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

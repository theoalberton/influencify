import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireRole, getMyBrand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { inviteToCampaign, removeFromCampaign } from "./actions";
import type { CampaignInfluencer, Influencer } from "@/lib/database.types";

const INVITE_STATUS_LABEL: Record<string, string> = {
  invited: "convite enviado",
  active: "divulgando",
  paused: "pausado",
  removed: "recusou",
};

export default async function CampaignAmbassadorsPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireRole("brand");
  const brand = await getMyBrand();
  if (!brand) redirect("/brand/profile");

  const { id } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, title, status")
    .eq("id", id)
    .eq("brand_id", brand.id)
    .single();

  if (!campaign) notFound();

  const [{ data: ambassadorLinks }, { data: inviteRows }] = await Promise.all([
    supabase
      .from("brand_influencers")
      .select("influencers(id, display_name, niche, followers_count)")
      .eq("brand_id", brand.id)
      .eq("status", "active"),
    supabase.from("campaign_influencers").select("*").eq("campaign_id", campaign.id),
  ]);

  const ambassadors = (ambassadorLinks ?? [])
    .map(
      (l) =>
        (l as unknown as { influencers: Pick<Influencer, "id" | "display_name" | "niche" | "followers_count"> | null })
          .influencers
    )
    .filter((i): i is Pick<Influencer, "id" | "display_name" | "niche" | "followers_count"> => i !== null);

  const inviteByInfluencer = new Map(
    ((inviteRows ?? []) as CampaignInfluencer[]).map((r) => [r.influencer_id, r])
  );

  return (
    <DashboardShell role="brand" name={profile.name} title={`Embaixadores · ${campaign.title}`}>
      <Link href="/brand/campaigns" className="text-sm font-medium text-[#004741] hover:underline">
        ‹ Voltar às campanhas
      </Link>

      <Card className="mt-4 max-w-3xl">
        <p className="text-sm text-[#5f6b64]">
          Escolha quais dos seus embaixadores podem divulgar <strong>esta</strong> campanha. Cada influenciador
          recebe o convite no painel dele e a oferta só entra no perfil público depois que ele aceitar.
        </p>

        {ambassadors.length === 0 ? (
          <p className="mt-5 rounded-xl bg-[#f0ede4] px-4 py-3 text-sm text-[#5f6b64]">
            Você ainda não tem embaixadores ativos. Vincule influenciadores em{" "}
            <Link href="/brand/ambassadors" className="font-medium text-[#004741] hover:underline">
              Embaixadores
            </Link>
            .
          </p>
        ) : (
          <div className="mt-5 divide-y divide-black/5">
            {ambassadors.map((amb) => {
              const invite = inviteByInfluencer.get(amb.id);
              return (
                <div key={amb.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="font-medium text-[#113b34]">{amb.display_name}</p>
                    <p className="text-xs text-[#85918a]">
                      {[amb.niche, amb.followers_count ? `${amb.followers_count} seguidores` : null]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {invite && <Badge tone={invite.status}>{INVITE_STATUS_LABEL[invite.status] ?? invite.status}</Badge>}
                    {invite ? (
                      <form action={removeFromCampaign.bind(null, campaign.id, amb.id)}>
                        <Button type="submit" size="sm" variant="secondary">
                          Remover
                        </Button>
                      </form>
                    ) : (
                      <form action={inviteToCampaign.bind(null, campaign.id, amb.id)}>
                        <Button type="submit" size="sm">
                          Convidar
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </DashboardShell>
  );
}

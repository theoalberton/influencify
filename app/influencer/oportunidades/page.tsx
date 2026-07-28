import { redirect } from "next/navigation";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Table";
import { formatDiscount } from "@/lib/utils";
import { rewardSummary } from "@/lib/rewards";
import { ApplyButton } from "./ApplyButton";
import type { Brand, Campaign, CampaignInfluencer } from "@/lib/database.types";

type OpenCampaign = Campaign & { brands: Brand | null };

export default async function OportunidadesPage() {
  const profile = await requireRole("influencer");
  const influencer = await getMyInfluencer();
  if (!influencer) redirect("/influencer/profile");

  const supabase = await createClient();

  const [{ data: campaigns }, { data: myLinks }] = await Promise.all([
    supabase
      .from("campaigns")
      .select("*, brands(*)")
      .eq("is_open", true)
      .eq("status", "active")
      .not("brand_id", "is", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("campaign_influencers")
      .select("campaign_id, status")
      .eq("influencer_id", influencer.id),
  ]);

  const myStatus = new Map(
    ((myLinks ?? []) as Pick<CampaignInfluencer, "campaign_id" | "status">[]).map((l) => [l.campaign_id, l.status])
  );
  const list = ((campaigns ?? []) as OpenCampaign[]).filter((c) => c.brands);

  return (
    <DashboardShell role="influencer" name={profile.name} title="Oportunidades">
      <p className="max-w-2xl text-sm text-[#4d584d]">
        Campanhas abertas a candidaturas: você divulga e ganha por resultado, sem precisar de cachê nem de
        audiência grande. Escolha as que combinam com o seu público — a marca aprova e o seu link exclusivo é
        liberado.
      </p>

      {list.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Nenhuma campanha aberta no momento"
            description="Assim que uma marca abrir campanha para candidaturas, ela aparece aqui. Enquanto isso, crie uma campanha própria em Minhas campanhas."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((campaign) => {
            const brand = campaign.brands!;
            const status = myStatus.get(campaign.id);
            const reward = rewardSummary(campaign);

            return (
              <div key={campaign.id} className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
                <div className="relative aspect-video w-full bg-[#f4f6e8]">
                  {campaign.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={campaign.image_url} alt={campaign.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#e9ecd8] text-2xl font-semibold text-[#a3ac9c]">
                      {brand.company_name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  {reward && (
                    <span className="absolute left-2 top-2 rounded-full bg-[#ccda47] px-2.5 py-1 text-xs font-bold text-[#0a3625]">
                      {reward}
                    </span>
                  )}
                  <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
                    {formatDiscount(campaign.discount_type, campaign.discount_value)}
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#7a8578]">{brand.company_name}</p>
                  <h3 className="mt-1 truncate font-semibold text-[#0a3625]">{campaign.title}</h3>
                  {campaign.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-[#4d584d]">{campaign.description}</p>
                  )}

                  <div className="mt-4">
                    {status === "applied" ? (
                      <Badge tone="invited">candidatura enviada</Badge>
                    ) : status === "active" ? (
                      <Badge tone="converted">divulgando ✓</Badge>
                    ) : status === "removed" ? (
                      <Badge tone="removed">não aprovada</Badge>
                    ) : status ? (
                      <Badge tone={status}>{status}</Badge>
                    ) : (
                      <ApplyButton campaignId={campaign.id} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-8 rounded-2xl bg-[#f4f6e8] px-5 py-4 text-xs leading-relaxed text-[#4d584d]">
        <strong className="text-[#0a3625]">Lembre-se:</strong> divulgação remunerada é publicidade. Sinalize o
        conteúdo como <strong>#publi</strong> ou <strong>#publicidade</strong>, conforme exige o CONAR. O
        pagamento da recompensa é combinado e feito diretamente com a marca.
      </p>
    </DashboardShell>
  );
}

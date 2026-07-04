import { redirect } from "next/navigation";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { CopyButton } from "@/components/ui/CopyButton";
import type { Campaign, CampaignInfluencer, Referral } from "@/lib/database.types";

export default async function InfluencerReferralsPage() {
  const profile = await requireRole("influencer");
  const influencer = await getMyInfluencer();
  if (!influencer) redirect("/influencer/profile");

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const mainLink = `${siteUrl}/i/${influencer.slug}`;

  const { data: links } = await supabase
    .from("campaign_influencers")
    .select("*, campaigns(title)")
    .eq("influencer_id", influencer.id);

  const { data: referrals } = await supabase
    .from("referrals")
    .select("*")
    .eq("influencer_id", influencer.id);

  const referralByCode = new Map((referrals ?? []).map((r) => [r.referral_code, r]));
  const rows = (links ?? []) as (CampaignInfluencer & { campaigns: Pick<Campaign, "title"> | null })[];

  return (
    <DashboardShell role="influencer" name={profile.name} title="Links rastreáveis">
      <Card className="mb-6">
        <h2 className="text-sm font-semibold text-slate-900">Seu link de perfil</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm text-slate-600">{mainLink}</p>
          <CopyButton value={mainLink} />
        </div>
      </Card>

      {rows.length === 0 ? (
        <EmptyState
          title="Nenhum link de campanha gerado ainda"
          description="Vá em Campanhas e gere seu link para as ofertas disponíveis."
        />
      ) : (
        <Table>
          <Thead columns={["Campanha", "Código", "Cliques", "Leads", "Link"]} />
          <Tbody>
            {rows.map((link) => {
              const ref = referralByCode.get(link.referral_code) as Referral | undefined;
              return (
                <tr key={link.id}>
                  <Td>{link.campaigns?.title ?? "—"}</Td>
                  <Td className="font-mono text-xs">{link.referral_code}</Td>
                  <Td>{ref?.clicks ?? 0}</Td>
                  <Td>{ref?.leads_count ?? 0}</Td>
                  <Td>
                    <CopyButton value={link.public_url ?? ""} />
                  </Td>
                </tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </DashboardShell>
  );
}

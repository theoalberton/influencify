import { redirect } from "next/navigation";
import Link from "next/link";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LeadsLocked } from "@/components/ui/LeadsLocked";
import { LeadStatusSelect } from "@/components/ui/LeadStatusSelect";
import { LeadWhatsAppButton } from "@/components/ui/LeadWhatsAppButton";
import { hasLeadAccess, FREE_VISIBLE_LEADS } from "@/lib/plans";
import { formatDate, LEAD_STATUS_LABEL } from "@/lib/utils";
import type { Brand, Campaign, Lead } from "@/lib/database.types";

type LeadRow = Lead & {
  campaigns: Pick<Campaign, "title"> | null;
  brands: Pick<Brand, "company_name"> | null;
};

export default async function InfluencerLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ campaign?: string }>;
}) {
  const profile = await requireRole("influencer");
  const influencer = await getMyInfluencer();
  if (!influencer) redirect("/influencer/profile");

  const { campaign: campaignFilter } = await searchParams;

  const supabase = await createClient();
  const fullAccess = hasLeadAccess(profile);

  // Opções do filtro: campanhas que o influenciador divulga
  const { data: links } = await supabase
    .from("campaign_influencers")
    .select("campaigns(id, title)")
    .eq("influencer_id", influencer.id);

  const campaignOptions = (links ?? [])
    .map((l) => (l as unknown as { campaigns: Pick<Campaign, "id" | "title"> | null }).campaigns)
    .filter((c): c is Pick<Campaign, "id" | "title"> => c !== null);

  let query = supabase
    .from("leads")
    .select("*, campaigns(title), brands(company_name)", { count: "exact" })
    .eq("influencer_id", influencer.id);

  if (campaignFilter) query = query.eq("campaign_id", campaignFilter);

  const { data: leads, count } = fullAccess
    ? await query.order("created_at", { ascending: false })
    : await query.order("created_at", { ascending: true }).limit(FREE_VISIBLE_LEADS);

  const rows = (leads ?? []) as LeadRow[];
  const lockedCount = fullAccess ? 0 : Math.max(0, (count ?? 0) - rows.length);
  const filtering = Boolean(campaignFilter);

  return (
    <DashboardShell role="influencer" name={profile.name} title="Leads gerados">
      <form action="/influencer/leads" className="mb-5 flex flex-wrap items-center gap-2">
        <select
          name="campaign"
          defaultValue={campaignFilter ?? ""}
          className="rounded-full border border-[#dde0cb] bg-white px-4 py-2 text-sm text-[#0a3625] focus:border-[#0a3625] focus:outline-none"
        >
          <option value="">Todas as campanhas</option>
          {campaignOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <Button type="submit" size="sm" variant="secondary">
          Filtrar
        </Button>
        {filtering && (
          <Link href="/influencer/leads" className="text-sm font-medium text-[#0a3625] hover:underline">
            Limpar
          </Link>
        )}
      </form>

      {!fullAccess && rows.length > 0 && (
        <p className="mb-4 rounded-2xl bg-white px-5 py-3.5 text-sm text-[#4d584d] shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          Plano gratuito: você vê o contato completo dos seus <strong>{FREE_VISIBLE_LEADS} primeiros leads</strong>.
        </p>
      )}

      {rows.length === 0 ? (
        <EmptyState
          title={filtering ? "Nenhum lead nessa campanha" : "Nenhum lead ainda"}
          description={
            filtering ? "Tente outra campanha ou limpe o filtro." : "Compartilhe seus links de campanha para começar a captar leads."
          }
        />
      ) : (
        <Table>
          <Thead columns={["Nome", "Contato", "Campanha", "Status", "Data", "Ação"]} />
          <Tbody>
            {rows.map((lead) => (
              <tr key={lead.id}>
                <Td>{lead.name}</Td>
                <Td>
                  <div className="min-w-0">
                    <p className="truncate">{lead.email ?? "—"}</p>
                    {lead.phone && <p className="text-xs text-[#7a8578]">{lead.phone}</p>}
                  </div>
                </Td>
                <Td>
                  <div className="min-w-0">
                    <p className="truncate">{lead.campaigns?.title ?? "—"}</p>
                    {lead.brands?.company_name && (
                      <p className="text-xs text-[#7a8578]">{lead.brands.company_name}</p>
                    )}
                  </div>
                </Td>
                <Td>
                  {/* Campanha própria: o influenciador gerencia o status; de marca, só acompanha. */}
                  {lead.brand_id === null ? (
                    <LeadStatusSelect leadId={lead.id} status={lead.status} revalidate="/influencer/leads" />
                  ) : (
                    <Badge tone={lead.status}>{LEAD_STATUS_LABEL[lead.status] ?? lead.status}</Badge>
                  )}
                </Td>
                <Td>{formatDate(lead.created_at)}</Td>
                <Td>
                  {lead.brand_id === null ? (
                    <LeadWhatsAppButton phone={lead.phone} leadName={lead.name} campaignTitle={lead.campaigns?.title ?? null} />
                  ) : (
                    "—"
                  )}
                </Td>
              </tr>
            ))}
          </Tbody>
        </Table>
      )}

      {lockedCount > 0 && (
        <div className="mt-6">
          <LeadsLocked leadsCount={lockedCount} />
        </div>
      )}
    </DashboardShell>
  );
}

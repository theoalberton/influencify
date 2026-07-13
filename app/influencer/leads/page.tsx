import { redirect } from "next/navigation";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { LeadsLocked } from "@/components/ui/LeadsLocked";
import { hasLeadAccess, FREE_VISIBLE_LEADS } from "@/lib/plans";
import { formatDate } from "@/lib/utils";
import type { Brand, Campaign, Lead } from "@/lib/database.types";

type LeadRow = Lead & {
  campaigns: Pick<Campaign, "title"> | null;
  brands: Pick<Brand, "company_name"> | null;
};

export default async function InfluencerLeadsPage() {
  const profile = await requireRole("influencer");
  const influencer = await getMyInfluencer();
  if (!influencer) redirect("/influencer/profile");

  const supabase = await createClient();
  const fullAccess = hasLeadAccess(profile);

  const query = supabase
    .from("leads")
    .select("*, campaigns(title), brands(company_name)", { count: "exact" })
    .eq("influencer_id", influencer.id);

  const { data: leads, count } = fullAccess
    ? await query.order("created_at", { ascending: false })
    : await query.order("created_at", { ascending: true }).limit(FREE_VISIBLE_LEADS);

  const rows = (leads ?? []) as LeadRow[];
  const lockedCount = fullAccess ? 0 : Math.max(0, (count ?? 0) - rows.length);

  return (
    <DashboardShell role="influencer" name={profile.name} title="Leads gerados">
      {!fullAccess && rows.length > 0 && (
        <p className="mb-4 rounded-2xl bg-white px-5 py-3.5 text-sm text-[#4d584d] shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          Plano gratuito: você vê o contato completo dos seus <strong>{FREE_VISIBLE_LEADS} primeiros leads</strong>.
        </p>
      )}

      {rows.length === 0 ? (
        <EmptyState title="Nenhum lead ainda" description="Compartilhe seus links de campanha para começar a captar leads." />
      ) : (
        <Table>
          <Thead columns={["Nome", "Contato", "Marca", "Campanha", "Origem", "Status", "Data"]} />
          <Tbody>
            {rows.map((lead) => (
              <tr key={lead.id}>
                <Td>{lead.name}</Td>
                <Td>{lead.email || lead.phone || "—"}</Td>
                <Td>{lead.brands?.company_name ?? "—"}</Td>
                <Td>{lead.campaigns?.title ?? "—"}</Td>
                <Td className="capitalize">{lead.source ?? "—"}</Td>
                <Td>
                  <Badge tone={lead.status}>{lead.status}</Badge>
                </Td>
                <Td>{formatDate(lead.created_at)}</Td>
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

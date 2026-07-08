import { redirect } from "next/navigation";
import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { LeadsLocked } from "@/components/ui/LeadsLocked";
import { hasLeadAccess } from "@/lib/plans";
import { formatDate } from "@/lib/utils";
import type { Brand, Campaign, Lead } from "@/lib/database.types";

export default async function InfluencerLeadsPage() {
  const profile = await requireRole("influencer");
  const influencer = await getMyInfluencer();
  if (!influencer) redirect("/influencer/profile");

  const supabase = await createClient();

  if (!hasLeadAccess(profile)) {
    const { count } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("influencer_id", influencer.id);
    return (
      <DashboardShell role="influencer" name={profile.name} title="Leads gerados">
        <LeadsLocked leadsCount={count ?? 0} />
      </DashboardShell>
    );
  }
  const { data: leads } = await supabase
    .from("leads")
    .select("*, campaigns(title), brands(company_name)")
    .eq("influencer_id", influencer.id)
    .order("created_at", { ascending: false });

  const rows = (leads ?? []) as (Lead & { campaigns: Pick<Campaign, "title"> | null; brands: Pick<Brand, "company_name"> | null })[];

  return (
    <DashboardShell role="influencer" name={profile.name} title="Leads gerados">
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
    </DashboardShell>
  );
}

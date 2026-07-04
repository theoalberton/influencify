import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Brand, Campaign, Influencer, Lead } from "@/lib/database.types";

export default async function AdminLeadsPage() {
  const profile = await requireRole("admin");
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*, campaigns(title), brands(company_name), influencers(display_name)")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (leads ?? []) as (Lead & {
    campaigns: Pick<Campaign, "title"> | null;
    brands: Pick<Brand, "company_name"> | null;
    influencers: Pick<Influencer, "display_name"> | null;
  })[];

  return (
    <DashboardShell role="admin" name={profile.name} title="Leads da plataforma">
      {rows.length === 0 ? (
        <EmptyState title="Nenhum lead registrado ainda" />
      ) : (
        <Table>
          <Thead columns={["Nome", "Contato", "Marca", "Campanha", "Influenciador", "Status", "Data"]} />
          <Tbody>
            {rows.map((lead) => (
              <tr key={lead.id}>
                <Td>{lead.name}</Td>
                <Td>{lead.email || lead.phone || "—"}</Td>
                <Td>{lead.brands?.company_name ?? "—"}</Td>
                <Td>{lead.campaigns?.title ?? "—"}</Td>
                <Td>{lead.influencers?.display_name ?? "—"}</Td>
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

import { redirect } from "next/navigation";
import { requireRole, getMyBrand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import type { Campaign, Influencer, Lead } from "@/lib/database.types";

export default async function BrandLeadsPage() {
  const profile = await requireRole("brand");
  const brand = await getMyBrand();
  if (!brand) redirect("/brand/profile");

  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*, campaigns(title), influencers(display_name)")
    .eq("brand_id", brand.id)
    .order("created_at", { ascending: false });

  const rows = (leads ?? []) as (Lead & {
    campaigns: Pick<Campaign, "title"> | null;
    influencers: Pick<Influencer, "display_name"> | null;
  })[];

  return (
    <DashboardShell
      role="brand"
      name={profile.name}
      title="Leads"
      actions={
        <LinkButton href="/brand/leads/export" variant="secondary">
          Exportar CSV
        </LinkButton>
      }
    >
      {rows.length === 0 ? (
        <EmptyState title="Nenhum lead captado ainda" description="Vincule embaixadores e crie campanhas para começar." />
      ) : (
        <Table>
          <Thead columns={["Nome", "Contato", "Cidade", "Campanha", "Influenciador", "Origem", "Status", "Data"]} />
          <Tbody>
            {rows.map((lead) => (
              <tr key={lead.id}>
                <Td>{lead.name}</Td>
                <Td>{lead.email || lead.phone || "—"}</Td>
                <Td>{lead.city ?? "—"}</Td>
                <Td>{lead.campaigns?.title ?? "—"}</Td>
                <Td>{lead.influencers?.display_name ?? "—"}</Td>
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

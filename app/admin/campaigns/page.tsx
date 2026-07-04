import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { formatDiscount } from "@/lib/utils";
import type { Brand, Campaign } from "@/lib/database.types";

export default async function AdminCampaignsPage() {
  const profile = await requireRole("admin");
  const supabase = await createClient();
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*, brands(company_name)")
    .order("created_at", { ascending: false });

  const rows = (campaigns ?? []) as (Campaign & { brands: Pick<Brand, "company_name"> | null })[];

  return (
    <DashboardShell role="admin" name={profile.name} title="Campanhas">
      {rows.length === 0 ? (
        <EmptyState title="Nenhuma campanha cadastrada" />
      ) : (
        <Table>
          <Thead columns={["Campanha", "Marca", "Desconto", "Status"]} />
          <Tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <Td>{c.title}</Td>
                <Td>{c.brands?.company_name ?? "—"}</Td>
                <Td>{formatDiscount(c.discount_type, c.discount_value)}</Td>
                <Td>
                  <Badge tone={c.status}>{c.status}</Badge>
                </Td>
              </tr>
            ))}
          </Tbody>
        </Table>
      )}
    </DashboardShell>
  );
}

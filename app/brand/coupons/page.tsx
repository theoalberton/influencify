import { redirect } from "next/navigation";
import { requireRole, getMyBrand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { formatDiscount } from "@/lib/utils";

export default async function BrandCouponsPage() {
  const profile = await requireRole("brand");
  const brand = await getMyBrand();
  if (!brand) redirect("/brand/profile");

  const supabase = await createClient();
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("brand_id", brand.id)
    .order("created_at", { ascending: false });

  const counts = await Promise.all(
    (campaigns ?? []).map((c) =>
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("campaign_id", c.id)
    )
  );

  return (
    <DashboardShell role="brand" name={profile.name} title="Cupons">
      {!campaigns || campaigns.length === 0 ? (
        <EmptyState title="Nenhum cupom cadastrado ainda" description="Cupons são criados junto com cada campanha." />
      ) : (
        <Table>
          <Thead columns={["Campanha", "Cupom", "Desconto", "Status", "Leads gerados"]} />
          <Tbody>
            {campaigns.map((campaign, i) => (
              <tr key={campaign.id}>
                <Td>{campaign.title}</Td>
                <Td className="font-mono">{campaign.coupon_code ?? "—"}</Td>
                <Td>{formatDiscount(campaign.discount_type, campaign.discount_value)}</Td>
                <Td>
                  <Badge tone={campaign.status}>{campaign.status}</Badge>
                </Td>
                <Td>{counts[i]?.count ?? 0}</Td>
              </tr>
            ))}
          </Tbody>
        </Table>
      )}
    </DashboardShell>
  );
}

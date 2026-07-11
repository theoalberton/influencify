import { redirect } from "next/navigation";
import { requireRole, getMyBrand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { LeadsLocked } from "@/components/ui/LeadsLocked";
import { hasLeadAccess, FREE_VISIBLE_LEADS } from "@/lib/plans";
import { formatDate } from "@/lib/utils";
import type { Campaign, Influencer, Lead } from "@/lib/database.types";

type LeadRow = Lead & {
  campaigns: Pick<Campaign, "title"> | null;
  influencers: Pick<Influencer, "display_name"> | null;
};

export default async function BrandLeadsPage() {
  const profile = await requireRole("brand");
  const brand = await getMyBrand();
  if (!brand) redirect("/brand/profile");

  const supabase = await createClient();
  const fullAccess = hasLeadAccess(profile);

  // Plano gratuito: contato completo dos primeiros 10 leads; o restante fica
  // bloqueado com contagem visível (upsell).
  const query = supabase
    .from("leads")
    .select("*, campaigns(title), influencers(display_name)", { count: "exact" })
    .eq("brand_id", brand.id);

  const { data: leads, count } = fullAccess
    ? await query.order("created_at", { ascending: false })
    : await query.order("created_at", { ascending: true }).limit(FREE_VISIBLE_LEADS);

  const rows = (leads ?? []) as LeadRow[];
  const lockedCount = fullAccess ? 0 : Math.max(0, (count ?? 0) - rows.length);

  return (
    <DashboardShell
      role="brand"
      name={profile.name}
      title="Leads"
      actions={
        fullAccess ? (
          <LinkButton href="/brand/leads/export" variant="secondary">
            Exportar CSV
          </LinkButton>
        ) : undefined
      }
    >
      {!fullAccess && rows.length > 0 && (
        <p className="mb-4 rounded-2xl bg-white px-5 py-3.5 text-sm text-[#6e6e73] shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          Plano gratuito: você vê o contato completo dos seus <strong>{FREE_VISIBLE_LEADS} primeiros leads</strong>.
        </p>
      )}

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

      {lockedCount > 0 && (
        <div className="mt-6">
          <LeadsLocked leadsCount={lockedCount} />
        </div>
      )}
    </DashboardShell>
  );
}

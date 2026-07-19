import { redirect } from "next/navigation";
import Link from "next/link";
import { requireRole, getMyBrand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { Button, LinkButton } from "@/components/ui/Button";
import { LeadsLocked } from "@/components/ui/LeadsLocked";
import { LeadStatusSelect } from "@/components/ui/LeadStatusSelect";
import { LeadWhatsAppButton } from "@/components/ui/LeadWhatsAppButton";
import { hasLeadAccess, FREE_VISIBLE_LEADS } from "@/lib/plans";
import { formatDate } from "@/lib/utils";
import type { Campaign, Influencer, Lead } from "@/lib/database.types";

type LeadRow = Lead & {
  campaigns: Pick<Campaign, "title"> | null;
  influencers: Pick<Influencer, "display_name"> | null;
};

export default async function BrandLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ campaign?: string; influencer?: string }>;
}) {
  const profile = await requireRole("brand");
  const brand = await getMyBrand();
  if (!brand) redirect("/brand/profile");

  const { campaign: campaignFilter, influencer: influencerFilter } = await searchParams;

  const supabase = await createClient();
  const fullAccess = hasLeadAccess(profile);

  // Opções dos filtros
  const [{ data: campaignOptions }, { data: ambassadorLinks }] = await Promise.all([
    supabase.from("campaigns").select("id, title").eq("brand_id", brand.id).order("title"),
    supabase
      .from("brand_influencers")
      .select("influencers(id, display_name)")
      .eq("brand_id", brand.id),
  ]);

  const influencerOptions = (ambassadorLinks ?? [])
    .map((l) => (l as unknown as { influencers: Pick<Influencer, "id" | "display_name"> | null }).influencers)
    .filter((i): i is Pick<Influencer, "id" | "display_name"> => i !== null);

  // Plano gratuito: contato completo dos primeiros 10 leads; o restante fica
  // bloqueado com contagem visível (upsell).
  let query = supabase
    .from("leads")
    .select("*, campaigns(title), influencers(display_name)", { count: "exact" })
    .eq("brand_id", brand.id);

  if (campaignFilter) query = query.eq("campaign_id", campaignFilter);
  if (influencerFilter) query = query.eq("influencer_id", influencerFilter);

  const { data: leads, count } = fullAccess
    ? await query.order("created_at", { ascending: false })
    : await query.order("created_at", { ascending: true }).limit(FREE_VISIBLE_LEADS);

  const rows = (leads ?? []) as LeadRow[];
  const lockedCount = fullAccess ? 0 : Math.max(0, (count ?? 0) - rows.length);
  const filtering = Boolean(campaignFilter || influencerFilter);

  const selectClass =
    "rounded-full border border-[#dde0cb] bg-white px-4 py-2 text-sm text-[#0a3625] focus:border-[#0a3625] focus:outline-none";

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
      <form action="/brand/leads" className="mb-5 flex flex-wrap items-center gap-2">
        <select name="campaign" defaultValue={campaignFilter ?? ""} className={selectClass}>
          <option value="">Todas as campanhas</option>
          {(campaignOptions ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select name="influencer" defaultValue={influencerFilter ?? ""} className={selectClass}>
          <option value="">Todos os influenciadores</option>
          {influencerOptions.map((i) => (
            <option key={i.id} value={i.id}>
              {i.display_name}
            </option>
          ))}
        </select>
        <Button type="submit" size="sm" variant="secondary">
          Filtrar
        </Button>
        {filtering && (
          <Link href="/brand/leads" className="text-sm font-medium text-[#0a3625] hover:underline">
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
          title={filtering ? "Nenhum lead com esses filtros" : "Nenhum lead captado ainda"}
          description={
            filtering ? "Tente outra combinação ou limpe os filtros." : "Vincule embaixadores e crie campanhas para começar."
          }
        />
      ) : (
        <Table>
          <Thead columns={["Nome", "Contato", "Campanha", "Influenciador", "Status", "Data", "Ação"]} />
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
                <Td>{lead.campaigns?.title ?? "—"}</Td>
                <Td>{lead.influencers?.display_name ?? "—"}</Td>
                <Td>
                  <LeadStatusSelect leadId={lead.id} status={lead.status} revalidate="/brand/leads" />
                </Td>
                <Td>{formatDate(lead.created_at)}</Td>
                <Td>
                  <LeadWhatsAppButton phone={lead.phone} leadName={lead.name} campaignTitle={lead.campaigns?.title ?? null} />
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

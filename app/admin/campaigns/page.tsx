import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDiscount, formatDate } from "@/lib/utils";
import { CAMPAIGN_STATUS_LABEL, getCampaignRiskFlags } from "@/lib/moderation";
import { reviewCampaign } from "./actions";
import type { Brand, Campaign, Influencer } from "@/lib/database.types";

type Row = Campaign & {
  brands: Pick<Brand, "company_name"> | null;
  influencers: Pick<Influencer, "display_name"> | null;
};

export default async function AdminCampaignsPage() {
  const profile = await requireRole("admin");
  const supabase = await createClient();
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*, brands(company_name), influencers(display_name)")
    .order("created_at", { ascending: false });

  const rows = (campaigns ?? []) as Row[];
  const pending = rows.filter((c) => c.status === "under_review");
  const others = rows.filter((c) => c.status !== "under_review");

  return (
    <DashboardShell role="admin" name={profile.name} title="Campanhas">
      {/* Fila de moderação */}
      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-[#0a3625]">
            Aguardando revisão <Badge tone="under_review">{pending.length}</Badge>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((c) => {
              const owner = c.brands?.company_name ?? c.influencers?.display_name ?? "—";
              const flags = getCampaignRiskFlags(c.title, c.product_name, c.description);
              return (
                <div key={c.id} className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] ring-2 ring-violet-200">
                  <div className="relative aspect-video w-full bg-[#f4f6e8]">
                    {c.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.image_url} alt={c.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#e9ecd8] text-2xl font-semibold text-[#a3ac9c]">
                        {c.title.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#7a8578]">{owner}</p>
                    <h3 className="mt-1 font-semibold text-[#0a3625]">{c.title}</h3>
                    {c.description && <p className="mt-1 line-clamp-3 text-sm text-[#4d584d]">{c.description}</p>}
                    <p className="mt-2 text-xs text-[#7a8578]">
                      {formatDiscount(c.discount_type, c.discount_value)} · criada em {formatDate(c.created_at)}
                    </p>
                    {flags.length > 0 && (
                      <p className="mt-2 rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-800">
                        Retida por: <strong>{flags.join(", ")}</strong>
                      </p>
                    )}
                    <div className="mt-4 flex gap-2">
                      <form action={reviewCampaign.bind(null, c.id, "approve")} className="flex-1">
                        <Button type="submit" size="sm" className="w-full">
                          Aprovar e publicar
                        </Button>
                      </form>
                      <form action={reviewCampaign.bind(null, c.id, "reject")}>
                        <Button type="submit" size="sm" variant="secondary">
                          Reprovar
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Todas as campanhas */}
      {others.length === 0 && pending.length === 0 ? (
        <EmptyState title="Nenhuma campanha cadastrada" />
      ) : (
        <Table>
          <Thead columns={["Campanha", "Dono", "Desconto", "Status"]} />
          <Tbody>
            {others.map((c) => (
              <tr key={c.id}>
                <Td>{c.title}</Td>
                <Td>{c.brands?.company_name ?? c.influencers?.display_name ?? "—"}</Td>
                <Td>{formatDiscount(c.discount_type, c.discount_value)}</Td>
                <Td>
                  <Badge tone={c.status}>{CAMPAIGN_STATUS_LABEL[c.status] ?? c.status}</Badge>
                </Td>
              </tr>
            ))}
          </Tbody>
        </Table>
      )}
    </DashboardShell>
  );
}

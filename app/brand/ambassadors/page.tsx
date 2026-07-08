import { redirect } from "next/navigation";
import { requireRole, getMyBrand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AddAmbassadorForm } from "./AddAmbassadorForm";
import { updateAmbassadorStatus } from "./actions";
import type { BrandInfluencer, BrandInfluencerStatus, Influencer } from "@/lib/database.types";

export default async function BrandAmbassadorsPage() {
  const profile = await requireRole("brand");
  const brand = await getMyBrand();
  if (!brand) redirect("/brand/profile");

  const supabase = await createClient();
  const { data: ambassadors } = await supabase
    .from("brand_influencers")
    .select("*, influencers(*)")
    .eq("brand_id", brand.id)
    .order("created_at", { ascending: false });

  const rows = (ambassadors ?? []) as (BrandInfluencer & { influencers: Influencer })[];

  return (
    <DashboardShell role="brand" name={profile.name} title="Embaixadores">
      <Card className="mb-6">
        <h2 className="text-sm font-semibold text-slate-900">Vincular novo influenciador</h2>
        <p className="mt-1 text-sm text-slate-500">
          Peça para o influenciador o link público do perfil dele e cole abaixo.
        </p>
        <div className="mt-4">
          <AddAmbassadorForm />
        </div>
      </Card>

      {rows.length === 0 ? (
        <EmptyState title="Nenhum embaixador vinculado ainda" />
      ) : (
        <Table>
          <Thead columns={["Influenciador", "Nicho", "Seguidores", "Status", "Ações"]} />
          <Tbody>
            {rows.map((row) => {
              const inf = row.influencers;
              return (
                <tr key={row.id}>
                  <Td>{inf?.display_name ?? "—"}</Td>
                  <Td>{inf?.niche ?? "—"}</Td>
                  <Td>{inf?.followers_count ?? "—"}</Td>
                  <Td>
                    <Badge tone={row.status}>{row.status}</Badge>
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      {(["active", "paused", "removed"] as BrandInfluencerStatus[])
                        .filter((s) => s !== row.status)
                        .map((status) => (
                          <form key={status} action={updateAmbassadorStatus.bind(null, row.id, status)}>
                            <Button type="submit" size="sm" variant="secondary">
                              {status === "active" ? "Ativar" : status === "paused" ? "Pausar" : "Remover"}
                            </Button>
                          </form>
                        ))}
                    </div>
                  </Td>
                </tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </DashboardShell>
  );
}

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toggleInfluencerActive } from "@/lib/actions/admin";

export default async function AdminInfluencersPage() {
  const profile = await requireRole("admin");
  const supabase = await createClient();
  const { data: influencers } = await supabase.from("influencers").select("*").order("created_at", { ascending: false });

  return (
    <DashboardShell role="admin" name={profile.name} title="Influenciadores">
      {!influencers || influencers.length === 0 ? (
        <EmptyState title="Nenhum influenciador cadastrado" />
      ) : (
        <Table>
          <Thead columns={["Nome", "Slug", "Nicho", "Seguidores", "Status", "Ações"]} />
          <Tbody>
            {influencers.map((inf) => (
              <tr key={inf.id}>
                <Td>{inf.display_name}</Td>
                <Td className="font-mono text-xs">/i/{inf.slug}</Td>
                <Td>{inf.niche ?? "—"}</Td>
                <Td>{inf.followers_count ?? "—"}</Td>
                <Td>
                  <Badge tone={inf.is_active ? "active" : "removed"}>{inf.is_active ? "ativo" : "desativado"}</Badge>
                </Td>
                <Td>
                  <form action={toggleInfluencerActive.bind(null, inf.id, !inf.is_active)}>
                    <Button type="submit" size="sm" variant="secondary">
                      {inf.is_active ? "Desativar" : "Ativar"}
                    </Button>
                  </form>
                </Td>
              </tr>
            ))}
          </Tbody>
        </Table>
      )}
    </DashboardShell>
  );
}

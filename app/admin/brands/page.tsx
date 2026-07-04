import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toggleBrandActive } from "@/lib/actions/admin";

export default async function AdminBrandsPage() {
  const profile = await requireRole("admin");
  const supabase = await createClient();
  const { data: brands } = await supabase.from("brands").select("*").order("created_at", { ascending: false });

  return (
    <DashboardShell role="admin" name={profile.name} title="Marcas">
      {!brands || brands.length === 0 ? (
        <EmptyState title="Nenhuma marca cadastrada" />
      ) : (
        <Table>
          <Thead columns={["Empresa", "Segmento", "E-mail", "Status", "Ações"]} />
          <Tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <Td>{brand.company_name}</Td>
                <Td>{brand.segment ?? "—"}</Td>
                <Td>{brand.email ?? "—"}</Td>
                <Td>
                  <Badge tone={brand.is_active ? "active" : "removed"}>
                    {brand.is_active ? "ativa" : "desativada"}
                  </Badge>
                </Td>
                <Td>
                  <form action={toggleBrandActive.bind(null, brand.id, !brand.is_active)}>
                    <Button type="submit" size="sm" variant="secondary">
                      {brand.is_active ? "Desativar" : "Ativar"}
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

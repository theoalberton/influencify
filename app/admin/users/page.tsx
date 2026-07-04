import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const profile = await requireRole("admin");
  const supabase = await createClient();
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  return (
    <DashboardShell role="admin" name={profile.name} title="Usuários">
      {!users || users.length === 0 ? (
        <EmptyState title="Nenhum usuário cadastrado" />
      ) : (
        <Table>
          <Thead columns={["Nome", "E-mail", "Tipo", "Plano", "Status do plano", "Criado em"]} />
          <Tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <Td>{u.name}</Td>
                <Td>{u.email}</Td>
                <Td className="capitalize">{u.account_type}</Td>
                <Td className="capitalize">{u.plan_type}</Td>
                <Td>
                  <Badge tone={u.plan_status === "active" ? "active" : "paused"}>{u.plan_status}</Badge>
                </Td>
                <Td>{formatDate(u.created_at)}</Td>
              </tr>
            ))}
          </Tbody>
        </Table>
      )}
    </DashboardShell>
  );
}

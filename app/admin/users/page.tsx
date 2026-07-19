import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Table, Thead, Tbody, Td, EmptyState } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { hasLeadAccess } from "@/lib/plans";
import { grantPro, revokePro } from "./actions";
import type { Profile } from "@/lib/database.types";

const ACCOUNT_LABEL: Record<string, string> = {
  influencer: "influenciador",
  brand: "marca",
  admin: "admin",
};

const PLAN_STATUS_LABEL: Record<string, string> = {
  active: "ativo",
  trialing: "em teste",
  past_due: "atrasado",
  canceled: "cancelado",
};

export default async function AdminUsersPage() {
  const profile = await requireRole("admin");
  const supabase = await createClient();
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  const rows = (users ?? []) as Profile[];

  return (
    <DashboardShell role="admin" name={profile.name} title="Usuários">
      <p className="mb-5 max-w-2xl text-sm text-[#4d584d]">
        <strong>Conceder Pro</strong> libera todos os recursos pagos sem cobrança — ideal para parceiros e
        primeiros clientes em troca de depoimento. A cortesia não passa pela Kiwify e não é sobrescrita por
        webhook; <strong>Remover Pro</strong> volta a conta ao plano gratuito.
      </p>

      {rows.length === 0 ? (
        <EmptyState title="Nenhum usuário cadastrado" />
      ) : (
        <Table>
          <Thead columns={["Nome", "E-mail", "Tipo", "Plano", "Status", "Criado em", "Ações"]} />
          <Tbody>
            {rows.map((u) => {
              const isPro = hasLeadAccess(u) && u.account_type !== "admin";
              return (
                <tr key={u.id}>
                  <Td>{u.name}</Td>
                  <Td>{u.email}</Td>
                  <Td className="capitalize">{ACCOUNT_LABEL[u.account_type] ?? u.account_type}</Td>
                  <Td>
                    {u.account_type === "admin" ? (
                      "—"
                    ) : (
                      <Badge tone={isPro ? "converted" : "default"}>{isPro ? "Pro" : "gratuito"}</Badge>
                    )}
                  </Td>
                  <Td>
                    <Badge tone={u.plan_status === "active" ? "active" : "paused"}>
                      {PLAN_STATUS_LABEL[u.plan_status] ?? u.plan_status}
                    </Badge>
                  </Td>
                  <Td>{formatDate(u.created_at)}</Td>
                  <Td>
                    {u.account_type === "admin" ? (
                      "—"
                    ) : isPro ? (
                      <form action={revokePro.bind(null, u.id)}>
                        <Button type="submit" size="sm" variant="secondary">
                          Remover Pro
                        </Button>
                      </form>
                    ) : (
                      <form action={grantPro.bind(null, u.id)}>
                        <Button type="submit" size="sm" variant="primary">
                          Conceder Pro
                        </Button>
                      </form>
                    )}
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

import Link from "next/link";
import type { AccountType } from "@/lib/database.types";
import { logoutAction } from "@/lib/actions/auth";

const NAV: Record<AccountType, { href: string; label: string }[]> = {
  influencer: [
    { href: "/influencer/dashboard", label: "Dashboard" },
    { href: "/influencer/profile", label: "Meu perfil" },
    { href: "/influencer/campaigns", label: "Campanhas" },
    { href: "/influencer/leads", label: "Leads" },
    { href: "/influencer/referrals", label: "Links" },
    { href: "/influencer/settings", label: "Configurações" },
  ],
  brand: [
    { href: "/brand/dashboard", label: "Dashboard" },
    { href: "/brand/profile", label: "Perfil da marca" },
    { href: "/brand/campaigns", label: "Campanhas" },
    { href: "/brand/ambassadors", label: "Embaixadores" },
    { href: "/brand/coupons", label: "Cupons" },
    { href: "/brand/leads", label: "Leads" },
    { href: "/brand/settings", label: "Configurações" },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Usuários" },
    { href: "/admin/brands", label: "Marcas" },
    { href: "/admin/influencers", label: "Influenciadores" },
    { href: "/admin/campaigns", label: "Campanhas" },
    { href: "/admin/leads", label: "Leads" },
  ],
};

export function DashboardShell({
  role,
  name,
  title,
  actions,
  children,
}: {
  role: AccountType;
  name: string;
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="fixed hidden h-screen w-60 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
          <Link href="/" className="mb-8 px-2 text-lg font-bold text-indigo-600">
            Influencify
          </Link>
          <nav className="flex-1 space-y-1">
            {NAV[role].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-slate-200 pt-4">
            <p className="truncate px-3 text-xs text-slate-400">{name}</p>
            <form action={logoutAction}>
              <button className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100">
                Sair
              </button>
            </form>
          </div>
        </aside>

        <div className="flex-1 lg:pl-60">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            {actions}
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

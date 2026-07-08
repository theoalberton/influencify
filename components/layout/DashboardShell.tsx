import Link from "next/link";
import type { AccountType } from "@/lib/database.types";
import { logoutAction } from "@/lib/actions/auth";
import { NavLink } from "./NavLink";
import { icons, type IconName } from "./icons";

const NAV: Record<AccountType, { href: string; label: string; icon: IconName }[]> = {
  influencer: [
    { href: "/influencer/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/influencer/profile", label: "Meu perfil", icon: "profile" },
    { href: "/influencer/campaigns", label: "Campanhas", icon: "campaigns" },
    { href: "/influencer/leads", label: "Leads", icon: "leads" },
    { href: "/influencer/referrals", label: "Links", icon: "links" },
    { href: "/influencer/settings", label: "Configurações", icon: "settings" },
  ],
  brand: [
    { href: "/brand/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/brand/profile", label: "Perfil da marca", icon: "brands" },
    { href: "/brand/campaigns", label: "Campanhas", icon: "campaigns" },
    { href: "/brand/ambassadors", label: "Embaixadores", icon: "ambassadors" },
    { href: "/brand/coupons", label: "Cupons", icon: "coupons" },
    { href: "/brand/leads", label: "Leads", icon: "leads" },
    { href: "/brand/settings", label: "Configurações", icon: "settings" },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/admin/users", label: "Usuários", icon: "users" },
    { href: "/admin/brands", label: "Marcas", icon: "brands" },
    { href: "/admin/influencers", label: "Influenciadores", icon: "ambassadors" },
    { href: "/admin/campaigns", label: "Campanhas", icon: "campaigns" },
    { href: "/admin/leads", label: "Leads", icon: "leads" },
  ],
};

const ROLE_LABEL: Record<AccountType, string> = {
  influencer: "Influenciador",
  brand: "Marca",
  admin: "Admin",
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
    <div className="min-h-screen bg-slate-100/70">
      <div className="flex">
        <aside className="fixed hidden h-screen w-64 flex-col border-r border-slate-200/80 bg-white px-4 py-6 lg:flex">
          <Link
            href="/"
            className="mb-8 px-2 text-xl font-extrabold tracking-tight"
          >
            <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">
              Influencify
            </span>
          </Link>

          <nav className="flex-1 space-y-1">
            {NAV[role].map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} icon={icons[item.icon]} />
            ))}
          </nav>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white">
                {name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{name}</p>
                <p className="text-xs text-slate-400">{ROLE_LABEL[role]}</p>
              </div>
            </div>
            <form action={logoutAction}>
              <button className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="M9 5H6a2 2 0 00-2 2v10a2 2 0 002 2h3m5-4l4-4-4-4m4 4H9" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Sair
              </button>
            </form>
          </div>
        </aside>

        <div className="flex-1 lg:pl-64">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
            {actions}
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

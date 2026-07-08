"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <span className={cn("shrink-0", active ? "text-indigo-600" : "text-slate-400")}>{icon}</span>
      {label}
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />}
    </Link>
  );
}

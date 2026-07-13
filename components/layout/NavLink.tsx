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
        active ? "bg-[#0a3625] text-[#ccda47]" : "text-[#4d584d] hover:bg-black/5 hover:text-[#0a3625]"
      )}
    >
      <span className={cn("shrink-0", active ? "text-[#ccda47]" : "text-[#7a8578]")}>{icon}</span>
      {label}
    </Link>
  );
}

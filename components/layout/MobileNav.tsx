"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import { NavLink } from "./NavLink";
import { icons, type IconName } from "./icons";

export interface MobileNavItem {
  href: string;
  label: string;
  icon: IconName;
}

/**
 * Menu hambúrguer dos painéis — a sidebar só existe em telas grandes.
 * O drawer é renderizado via portal no <body>: o header usa backdrop-blur,
 * que criaria um containing block e prenderia o `fixed` dentro dele.
 */
export function MobileNav({ items, name, roleLabel }: { items: MobileNavItem[]; name: string; roleLabel: string }) {
  const [open, setOpen] = useState(false);

  // Trava o scroll do fundo enquanto o menu está aberto.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const drawer = (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Fundo escurecido fecha o menu */}
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/40"
      />

      <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white px-4 py-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between px-2">
          <Link href="/" onClick={() => setOpen(false)} className="text-lg font-semibold tracking-tight text-[#0a3625]">
            Influencify
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#4d584d] transition hover:bg-black/5"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Clique em qualquer link fecha o menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto" onClick={() => setOpen(false)}>
          {items.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} icon={icons[item.icon]} />
          ))}
        </nav>

        <div className="border-t border-black/5 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a3625] text-sm font-semibold text-white">
              {name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#0a3625]">{name}</p>
              <p className="text-xs text-[#7a8578]">{roleLabel}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#4d584d] transition hover:bg-black/5 hover:text-[#0a3625]">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M9 5H6a2 2 0 00-2 2v10a2 2 0 002 2h3m5-4l4-4-4-4m4 4H9" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sair
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-[#0a3625] transition hover:bg-black/5"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </svg>
      </button>

      {/* `document` só é acessado com o menu aberto — nunca no SSR. */}
      {open && createPortal(drawer, document.body)}
    </div>
  );
}

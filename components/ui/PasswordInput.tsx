"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    // olho aberto (senha visível)
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={1.7} />
    </svg>
  ) : (
    // olho riscado (senha oculta)
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M3 3l18 18M10.6 10.7a3 3 0 004.2 4.2M7.4 7.5C4.5 9.1 2.5 12 2.5 12S6 18.5 12 18.5c1.6 0 3-.4 4.3-1M9.9 5.8A8.6 8.6 0 0112 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 01-2.8 3.5"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Campo de senha com o "olhinho": alterna entre oculto (••••) e visível.
 * `className` estiliza o input — as telas de auth passam o estilo delas.
 */
export function PasswordInput({
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={cn(
          className ??
            "mt-1 w-full rounded-lg border border-[#dde0cb] px-3 py-2 text-sm focus:border-[#0a3625] focus:outline-none focus:ring-1 focus:ring-[#0a3625]",
          "pr-11"
        )}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        title={visible ? "Ocultar senha" : "Mostrar senha"}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#7a8578] transition hover:text-[#0a3625]"
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}

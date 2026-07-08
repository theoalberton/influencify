import Link from "next/link";

export function LeadsLocked({ leadsCount }: { leadsCount: number }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-1 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      {/* Linhas fictícias desfocadas ao fundo */}
      <div className="pointer-events-none select-none blur-[6px]" aria-hidden>
        <div className="divide-y divide-black/5">
          {["Maria S.", "João P.", "Ana C.", "Carlos M.", "Fernanda L."].map((fake) => (
            <div key={fake} className="flex items-center gap-6 px-6 py-4 text-sm text-[#6e6e73]">
              <span className="w-28 font-medium text-[#1d1d1f]">{fake}</span>
              <span>•••••@•••••.com</span>
              <span>(••) •••••-••••</span>
              <span className="ml-auto">há 2 dias</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 px-6 text-center backdrop-blur-[2px]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d1d1f] text-white">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth={1.8} />
            <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-[#1d1d1f]">
          {leadsCount > 0
            ? `Você tem ${leadsCount} lead${leadsCount === 1 ? "" : "s"} esperando`
            : "Seus leads aparecem aqui"}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-[#6e6e73]">
          O plano gratuito registra os leads, mas nome e contato completos são exclusivos dos planos pagos.
        </p>
        <Link
          href="/upgrade"
          className="mt-6 rounded-full bg-[#0071e3] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#0077ed]"
        >
          Fazer upgrade
        </Link>
      </div>
    </div>
  );
}

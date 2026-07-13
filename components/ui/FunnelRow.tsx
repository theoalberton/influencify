function pct(part: number, whole: number): string {
  if (whole === 0) return "—";
  return `${((part / whole) * 100).toFixed(1).replace(".", ",")}%`;
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="hidden h-5 w-5 shrink-0 text-[#dde0cb] sm:block" aria-hidden>
      <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Funil clique → lead → conversão dos últimos 30 dias. */
export function FunnelRow({ clicks, leads, converted }: { clicks: number; leads: number; converted: number }) {
  const stages = [
    { label: "Cliques", value: clicks, sub: "últimos 30 dias" },
    { label: "Leads", value: leads, sub: `${pct(leads, clicks)} dos cliques` },
    { label: "Convertidos", value: converted, sub: `${pct(converted, leads)} dos leads` },
  ];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <h2 className="text-sm font-semibold text-[#0a3625]">Funil de conversão</h2>
      <div className="mt-4 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex flex-1 items-center gap-4">
            {i > 0 && <Arrow />}
            <div className="flex-1 rounded-xl bg-[#f4f6e8] px-4 py-3">
              <p className="text-xs font-medium text-[#7a8578]">{stage.label}</p>
              <p className="mt-0.5 text-2xl font-semibold tracking-tight text-[#0a3625]">{stage.value}</p>
              <p className="text-xs text-[#7a8578]">{stage.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

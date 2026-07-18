import Link from "next/link";

export interface OnboardingStep {
  label: string;
  description: string;
  done: boolean;
  href: string;
  cta: string;
}

/** Card de primeiros passos — o pai só renderiza enquanto houver passo pendente. */
export function OnboardingChecklist({ steps }: { steps: OnboardingStep[] }) {
  const doneCount = steps.filter((s) => s.done).length;
  const next = steps.find((s) => !s.done);

  return (
    <div className="mb-5 overflow-hidden rounded-3xl bg-[#0a3625] text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#ccda47]">Primeiros passos</h2>
          <p className="text-sm text-white/60">
            {doneCount} de {steps.length} concluídos — complete para começar a receber leads.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {steps.map((step, i) => (
            <span
              key={i}
              className={`h-1.5 w-8 rounded-full ${step.done ? "bg-[#ccda47]" : "bg-white/15"}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div key={step.label} className={`bg-[#0a3625] p-5 ${step === next ? "bg-[#0d4230]" : ""}`}>
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  step.done ? "bg-[#ccda47] text-[#0a3625]" : "border border-white/30 text-white/50"
                }`}
              >
                {step.done ? "✓" : i + 1}
              </span>
              <p className={`text-sm font-semibold ${step.done ? "text-white/50 line-through" : "text-white"}`}>
                {step.label}
              </p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-white/55">{step.description}</p>
            {!step.done && (
              <Link
                href={step.href}
                className={`mt-3 inline-block rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  step === next
                    ? "bg-[#ccda47] text-[#0a3625] hover:brightness-105"
                    : "border border-white/25 text-white/80 hover:bg-white/10"
                }`}
              >
                {step.cta}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const STATS = [
  { value: "100%", label: "dos leads rastreados até a origem" },
  { value: "1 clique", label: "para o visitante resgatar o cupom" },
  { value: "CSV", label: "exportação pronta para remarketing" },
  { value: "LGPD", label: "consentimento registrado em cada lead" },
];

const STEPS = [
  {
    number: "01",
    title: "A marca cria a campanha",
    description: "Cupom, desconto, thumbnail e o link da loja. Em minutos, sem depender de agência.",
  },
  {
    number: "02",
    title: "O influenciador divulga",
    description: "Cada embaixador recebe um link rastreável exclusivo e um perfil público estilo link-in-bio.",
  },
  {
    number: "03",
    title: "O público troca dados pelo cupom",
    description: "Nome, e-mail e WhatsApp em troca do desconto — com consentimento LGPD registrado.",
  },
  {
    number: "04",
    title: "A marca ativa os leads",
    description: "Dashboard com origem de cada lead, desempenho por influenciador e exportação CSV.",
  },
];

const FEATURES = [
  {
    title: "Atribuição por influenciador",
    description: "Saiba exatamente quantos cliques e leads cada embaixador gerou, campanha por campanha.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path d="M4 19V10m5.5 9V5M15 19v-6m5 6V8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Perfil público premium",
    description: "Página estilo link-in-bio com as ofertas em cards visuais, pronta para colocar na bio.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth={2} />
        <path d="M5 20c.8-3.2 3.6-5 7-5s6.2 1.8 7 5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Links rastreáveis",
    description: "Cada campanha gera um código único por influenciador. UTM e origem chegam junto com o lead.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path d="M10 14a5 5 0 007.5.5l2-2a5 5 0 00-7-7l-1 1" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        <path d="M14 10a5 5 0 00-7.5-.5l-2 2a5 5 0 007 7l1-1" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Cupons em troca de dados",
    description: "O visitante não precisa criar conta: preenche o formulário, recebe o cupom na hora.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path d="M4 8a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 100-4V8z" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
        <path d="M13 7.5v2m0 5v2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Pronto para pixel",
    description: "Campos para Meta, TikTok e Google Tag em cada campanha. Remarketing desde o primeiro lead.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={2} />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} />
        <path d="M12 4V2m0 20v-2M4 12H2m20 0h-2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "LGPD nativo",
    description: "Consentimento explícito registrado em cada lead, pronto para auditoria.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
          Influencify
        </span>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-300 transition hover:text-white">
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Criar conta grátis
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-[140px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-40 h-[400px] w-[400px] rounded-full bg-fuchsia-600/20 blur-[120px]"
        />

        <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-16 text-center">
          <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            A ponte entre grandes marcas e grandes influenciadores
          </p>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Influência vira{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
              lead qualificado
            </span>
            . Todo clique, rastreado.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Influencify transforma a audiência dos seus embaixadores em uma base de leads própria: o público resgata
            cupons exclusivos, a marca recebe nome, e-mail e WhatsApp — com origem, campanha e influenciador
            identificados em cada registro.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-indigo-500/40 hover:brightness-110"
            >
              Sou marca — quero leads
              <ArrowIcon />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Sou influenciador — quero monetizar
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative mx-auto max-w-5xl px-6 pb-20">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-slate-950/90 px-6 py-6 text-center">
                <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/5 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">Como funciona</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Da campanha ao lead em quatro passos
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-indigo-400/40 hover:bg-white/[0.06]"
              >
                <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-3xl font-extrabold text-transparent">
                  {step.number}
                </span>
                <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">Plataforma</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Feita para operações sérias de marketing de influência
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 text-indigo-300 ring-1 ring-inset ring-white/10">
                {feature.icon}
              </div>
              <h3 className="mt-4 font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600 via-indigo-700 to-fuchsia-700 px-8 py-16 text-center shadow-2xl shadow-indigo-900/40">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[500px] -translate-x-1/2 rounded-full bg-white/20 blur-[100px]"
          />
          <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">
            Sua audiência já confia em você.
            <br />
            Transforme essa confiança em resultado.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-indigo-100">
            Crie sua conta gratuita, publique a primeira campanha e veja os primeiros leads chegarem hoje.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition hover:bg-slate-100"
            >
              Começar agora — é grátis
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <span className="text-sm font-bold text-slate-400">Influencify</span>
          <p className="text-xs text-slate-500">Marketing de influência com atribuição de verdade.</p>
        </div>
      </footer>
    </div>
  );
}

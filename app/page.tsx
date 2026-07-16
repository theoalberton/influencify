import Link from "next/link";

const STEPS = [
  {
    number: "1",
    title: "A marca cria a oferta",
    description: "Cupom, desconto e link da loja em minutos. Escolhe quais influenciadores vão divulgar.",
  },
  {
    number: "2",
    title: "O influenciador posta o link",
    description: "Cada um recebe um link exclusivo e um perfil público com as ofertas, pronto pra bio.",
  },
  {
    number: "3",
    title: "O público troca o cupom por contato",
    description: "Nome, e-mail e WhatsApp em troca do desconto — com consentimento LGPD registrado.",
  },
  {
    number: "4",
    title: "Você vê exatamente quem vendeu",
    description: "Cada lead com origem, influenciador e campanha. Nada de achismo. Exporta em CSV.",
  },
];

const BENEFITS = [
  {
    title: "Saiba exatamente quem vendeu",
    description: "Chega de dividir o crédito no chute. Cada lead mostra de qual influenciador e campanha veio.",
  },
  {
    title: "Um link na bio que capta clientes",
    description: "O influenciador ganha uma página pública com as ofertas — bonita e feita pra converter.",
  },
  {
    title: "Cada clique tem dono",
    description: "Link único por influenciador. Origem e UTM chegam grudados em cada lead que entra.",
  },
  {
    title: "O desconto que vira contato",
    description: "O visitante não cria conta: preenche, recebe o cupom na hora, e o contato fica com você.",
  },
  {
    title: "Seus leads viram anúncio",
    description: "Meta, TikTok e Google Pixel em cada campanha, e exportação CSV pra remarketing.",
  },
  {
    title: "Tranquilo com a LGPD",
    description: "Consentimento explícito registrado em cada lead. Pronto pra auditoria, sem dor de cabeça.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#0a3625] antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <span className="text-[17px] font-semibold tracking-tight">Influencify</span>
          <nav className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-[#0a3625]/80 transition hover:text-[#0a3625]">
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#ccda47] px-4 py-1.5 text-sm font-bold text-[#0a3625] transition hover:brightness-105"
            >
              Criar conta
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero — a dor direta */}
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-24 text-center sm:pt-32">
        <p className="mb-6 inline-block rounded-full bg-[#f4f6e8] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#4d584d]">
          Marketing de influência com atribuição de verdade
        </p>
        <h1 className="text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
          A influência sem prova é{" "}
          <span className="inline-block -rotate-1 rounded-xl bg-[#ccda47] px-3 leading-[1.15]">dinheiro no escuro.</span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-[#4d584d] sm:text-xl">
          A Influencify transforma cada post dos seus influenciadores em <strong className="text-[#0a3625]">leads
          com nome e contato</strong> — e mostra exatamente quem vendeu o quê. A marca enxerga o retorno. O
          influenciador prova o seu valor.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-full bg-[#ccda47] px-8 py-3.5 text-[15px] font-bold text-[#0a3625] transition hover:-translate-y-px hover:brightness-105"
          >
            Começar grátis
          </Link>
          <Link
            href="/login"
            className="rounded-full px-7 py-3 text-[15px] font-medium text-[#0a3625] transition hover:underline"
          >
            Já tenho conta ›
          </Link>
        </div>
        <p className="mt-4 text-sm text-[#7a8578]">Grátis para começar · sem cartão · seus primeiros leads em minutos</p>
      </section>

      {/* Agitação da dor — o antes */}
      <section className="border-y border-black/5 bg-[#0a3625] py-16 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-[#ccda47]">
            Você reconhece isso?
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              "Você paga o cachê do influenciador e torce pra dar certo — sem nenhum número no fim.",
              "Curtida e visualização não pagam boleto. Mas é só isso que você tem pra mostrar.",
              "Dez influenciadores na campanha e nenhuma ideia de qual deles realmente vendeu.",
            ].map((pain) => (
              <p key={pain} className="text-[15px] leading-relaxed text-white/80">
                <span className="mb-2 block text-2xl text-[#ccda47]">“</span>
                {pain}
              </p>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-lg font-semibold text-white">
            Influência é o único investimento de marketing que a maioria faz de olhos fechados. A Influencify acende a
            luz.
          </p>
        </div>
      </section>

      {/* Dois públicos, com dor */}
      <section className="py-24">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 md:grid-cols-2">
          <div className="rounded-3xl bg-[#f4f6e8] p-10">
            <p className="text-sm font-bold uppercase tracking-widest text-[#7a8578]">Para marcas</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight">
              Quanto a sua última campanha com influenciador realmente vendeu?
            </h2>
            <p className="mt-4 leading-relaxed text-[#4d584d]">
              Se você hesitou pra responder, esse é o problema. Pare de pagar cachê e torcer: veja o nome de cada lead,
              de qual influenciador ele veio, e invista onde dá retorno de verdade.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-block rounded-full bg-[#0a3625] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[#145238]"
            >
              Criar conta de marca
            </Link>
          </div>

          <div className="rounded-3xl bg-[#f4f6e8] p-10">
            <p className="text-sm font-bold uppercase tracking-widest text-[#7a8578]">Para influenciadores</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight">
              Sua audiência confia em você. Mas você consegue provar isso pra marca?
            </h2>
            <p className="mt-4 leading-relaxed text-[#4d584d]">
              Curtida não renova contrato. Com a Influencify você mostra números concretos de conversão e negocia o
              próximo cachê com dados na mão — não com print de story. E ainda vende seus próprios produtos.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-block rounded-full bg-[#0a3625] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[#145238]"
            >
              Criar perfil de influenciador
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-[#f4f6e8] py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-4xl font-bold tracking-tight">Do post ao lead, tudo rastreado.</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#4d584d]">
            Quatro passos entre a campanha e saber, com nome e sobrenome, quem ela trouxe.
          </p>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.number}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ccda47] text-sm font-bold text-[#0a3625]">
                  {step.number}
                </div>
                <h3 className="mt-5 text-[17px] font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4d584d]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-4xl font-bold tracking-tight">Tudo que você precisa pra parar de chutar.</h2>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="rounded-3xl bg-[#f4f6e8] p-8">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ccda47]">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-[#0a3625]">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="mt-4 text-[17px] font-bold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4d584d]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final — redução de risco */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="rounded-3xl bg-[#0a3625] px-8 py-16 text-center sm:px-16">
          <h2 className="text-4xl font-bold tracking-tight text-[#ccda47] sm:text-5xl">
            Comece a medir a sua próxima campanha.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
            Grátis para começar, sem cartão. Crie sua conta e veja seus primeiros leads chegarem em minutos.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-full bg-[#ccda47] px-8 py-3.5 text-[15px] font-bold text-[#0a3625] transition hover:-translate-y-px hover:brightness-105"
          >
            Criar conta grátis
          </Link>
        </div>
      </section>

      <footer className="border-t border-black/5 bg-[#f4f6e8]">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-[#7a8578] sm:flex-row">
          <span>Influencify — Marketing de influência com atribuição de verdade.</span>
          <span className="flex gap-4">
            <Link href="/termos" className="hover:underline">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:underline">
              Privacidade
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}

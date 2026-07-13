import Link from "next/link";

const STEPS = [
  {
    number: "1",
    title: "A marca cria a campanha",
    description: "Cupom, desconto, imagem e o link da loja. Em minutos, sem depender de agência.",
  },
  {
    number: "2",
    title: "O influenciador divulga",
    description: "Cada embaixador recebe um link rastreável exclusivo e um perfil público elegante.",
  },
  {
    number: "3",
    title: "O público resgata o cupom",
    description: "Nome, e-mail e WhatsApp em troca do desconto — com consentimento LGPD registrado.",
  },
  {
    number: "4",
    title: "A marca ativa os leads",
    description: "Origem de cada lead, desempenho por influenciador e exportação CSV.",
  },
];

const FEATURES = [
  {
    title: "Atribuição por influenciador",
    description: "Saiba exatamente quantos cliques e leads cada embaixador gerou, campanha por campanha.",
  },
  {
    title: "Perfil público elegante",
    description: "Página estilo link-in-bio com as ofertas em cards visuais, pronta para colocar na bio.",
  },
  {
    title: "Links rastreáveis",
    description: "Cada campanha gera um código único por influenciador. UTM e origem chegam junto com o lead.",
  },
  {
    title: "Cupons em troca de dados",
    description: "O visitante não precisa criar conta: preenche o formulário, recebe o cupom na hora.",
  },
  {
    title: "Pronto para remarketing",
    description: "Campos para Meta, TikTok e Google Tag em cada campanha, e exportação CSV dos leads.",
  },
  {
    title: "LGPD nativo",
    description: "Consentimento explícito registrado em cada lead, pronto para auditoria.",
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

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-24 pt-24 text-center sm:pt-32">
        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
          Influência que vira{" "}
          <span className="inline-block -rotate-1 rounded-xl bg-[#ccda47] px-3 leading-[1.15]">resultado.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#4d584d] sm:text-xl">
          A audiência dos seus embaixadores resgata cupons exclusivos. Você recebe leads com nome, contato e origem —
          rastreados do clique à conversão.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-full bg-[#ccda47] px-7 py-3 text-[15px] font-bold text-[#0a3625] transition hover:-translate-y-px hover:brightness-105"
          >
            Começar agora
          </Link>
          <Link
            href="/login"
            className="rounded-full px-7 py-3 text-[15px] font-medium text-[#0a3625] transition hover:underline"
          >
            Já tenho conta ›
          </Link>
        </div>
      </section>

      {/* Product framing — two audiences */}
      <section className="bg-[#f4f6e8] py-24">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
            <p className="text-sm font-medium text-[#4d584d]">Para marcas</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Cada real investido em influência, medido.
            </h2>
            <p className="mt-4 leading-relaxed text-[#4d584d]">
              Pare de medir influência por curtidas. Veja quantos leads reais cada embaixador gera, com contato
              completo e consentimento para remarketing.
            </p>
            <Link href="/register" className="mt-6 inline-block text-[15px] font-medium text-[#0a3625] hover:underline">
              Criar conta de marca ›
            </Link>
          </div>

          <div className="rounded-3xl bg-white p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
            <p className="text-sm font-medium text-[#4d584d]">Para influenciadores</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Prove o valor da sua audiência.
            </h2>
            <p className="mt-4 leading-relaxed text-[#4d584d]">
              Um perfil público com as ofertas dos seus patrocinadores e números concretos de conversão para
              apresentar às próximas marcas.
            </p>
            <Link href="/register" className="mt-6 inline-block text-[15px] font-medium text-[#0a3625] hover:underline">
              Criar perfil de influenciador ›
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-center text-4xl font-semibold tracking-tight">Como funciona.</h2>
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.number}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a3625] text-sm font-semibold text-white">
                {step.number}
              </div>
              <h3 className="mt-5 text-[17px] font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4d584d]">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#f4f6e8] py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-4xl font-semibold tracking-tight">
            Feito para operações sérias.
          </h2>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-3xl bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
                <h3 className="text-[17px] font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4d584d]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — bloco bottle green com wattle, a assinatura da marca */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="rounded-3xl bg-[#0a3625] px-8 py-16 text-center sm:px-16">
          <h2 className="text-4xl font-bold tracking-tight text-[#ccda47] sm:text-5xl">
            Sua audiência já confia em você.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
            Transforme essa confiança em uma base de leads própria. Grátis para começar.
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

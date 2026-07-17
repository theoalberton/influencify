import Link from "next/link";
import { PLAN_PRICING } from "@/lib/plans";

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

const FAQ = [
  {
    q: "O que é a Influencify?",
    a: "É uma plataforma de gestão de campanhas de marketing de influência. A marca cria ofertas com cupom, escolhe quais influenciadores vão divulgar, e cada pessoa que resgata o cupom vira um lead identificado — com a origem rastreada até o influenciador que trouxe.",
  },
  {
    q: "Preciso pagar para começar?",
    a: "Não. O plano gratuito permite criar campanhas, links rastreáveis e perfil público, e você vê o contato completo dos seus 10 primeiros leads. Do 11º em diante, o contato fica bloqueado até assinar um plano pago. Não pedimos cartão no cadastro.",
  },
  {
    q: "Quem paga: a marca ou o influenciador?",
    a: "Os dois têm plano próprio, cada um com o seu preço. A marca assina para desbloquear os leads dos seus embaixadores; o influenciador assina para desbloquear os leads que ele gerou e criar campanhas próprias ilimitadas. O consumidor final nunca paga nada.",
  },
  {
    q: "Os leads captados são meus ou da plataforma?",
    a: "São seus. A Influencify é a ferramenta que capta e organiza — nós não vendemos, alugamos nem compartilhamos esses contatos com ninguém. Você exporta tudo em CSV quando quiser.",
  },
  {
    q: "Sou influenciador mas não tenho marca patrocinadora. Serve pra mim?",
    a: "Serve. Você pode criar campanhas próprias para divulgar o seu produto ou serviço (curso, mentoria, loja, comunidade) e captar leads direto do seu perfil público, sem depender de nenhuma marca. O plano gratuito inclui 1 campanha própria.",
  },
  {
    q: "Como funciona o pagamento e posso cancelar?",
    a: "A assinatura é mensal, com 7 dias de teste grátis, processada por gateway de pagamento (Pix, boleto ou cartão). Você cancela quando quiser e mantém o acesso até o fim do período já pago — sem multa nem fidelidade.",
  },
  {
    q: "Está de acordo com a LGPD?",
    a: "Sim. Cada lead só é registrado após consentimento explícito do visitante, que fica gravado junto ao contato. Publicamos Termos de Uso e Política de Privacidade, e cada conta só acessa os próprios dados.",
  },
  {
    q: "Preciso saber programar ou instalar algo?",
    a: "Não. Tudo funciona pelo navegador: você cria a campanha, o sistema gera os links e a página pública automaticamente. Se quiser usar pixel de remarketing, é só colar o ID do Meta, TikTok ou Google no campo da campanha.",
  },
  {
    q: "Como o influenciador ganha por indicar outros influenciadores?",
    a: "Todo influenciador tem um link de convite pessoal. A cada 3 influenciadores que se cadastrarem por esse link e assinarem o plano Pro, ele resgata R$ 50, pagos via Pix.",
  },
];

function Check({ className = "text-[#0a3625]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 shrink-0 ${className}`}>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Mockup do dashboard real, desenhado em CSS — a prova de que o produto existe. */
function ProductShot() {
  const bars = [30, 45, 38, 62, 55, 78, 70, 92];
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_-15px_rgba(10,54,37,0.45)] ring-1 ring-black/5">
      {/* barra do navegador */}
      <div className="flex items-center gap-2 border-b border-black/5 bg-[#f4f6e8] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#dde0cb]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#dde0cb]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#dde0cb]" />
        <span className="ml-3 rounded-md bg-white px-3 py-1 text-[11px] text-[#7a8578]">influencify.app/brand/dashboard</span>
      </div>

      <div className="flex">
        {/* sidebar */}
        <div className="hidden w-40 shrink-0 border-r border-black/5 p-3 sm:block">
          <p className="px-2 text-sm font-bold text-[#0a3625]">Influencify</p>
          <div className="mt-4 space-y-1.5">
            {["Dashboard", "Campanhas", "Embaixadores", "Leads"].map((item, i) => (
              <p
                key={item}
                className={`rounded-lg px-2 py-1.5 text-[11px] font-medium ${
                  i === 0 ? "bg-[#0a3625] text-[#ccda47]" : "text-[#7a8578]"
                }`}
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* conteúdo */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Leads captados", value: "1.284" },
              { label: "Cliques", value: "9.417" },
              { label: "Conversão", value: "13,6%" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-[#f4f6e8] p-3">
                <p className="text-[9px] font-medium text-[#7a8578]">{stat.label}</p>
                <p className="mt-0.5 text-lg font-bold tracking-tight text-[#0a3625]">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* gráfico */}
          <div className="mt-3 rounded-xl bg-[#f4f6e8] p-3">
            <p className="text-[9px] font-medium text-[#7a8578]">Leads por influenciador</p>
            <div className="mt-3 flex h-20 items-end gap-1.5">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm bg-[#ccda47]" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          {/* tabela */}
          <div className="mt-3 space-y-1.5">
            {[
              ["Mariana S.", "@mari.fit", "Cupom FIT20"],
              ["Rafael T.", "@rafa.tech", "Cupom TECH10"],
              ["Juliana P.", "@ju.beauty", "Cupom BEAUTY15"],
            ].map(([name, inf, coupon]) => (
              <div key={name} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] ring-1 ring-black/5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0a3625] text-[8px] font-bold text-[#ccda47]">
                  {name[0]}
                </span>
                <span className="font-semibold text-[#0a3625]">{name}</span>
                <span className="text-[#7a8578]">via {inf}</span>
                <span className="ml-auto rounded-full bg-[#eef3d6] px-2 py-0.5 font-medium text-[#0a3625]">{coupon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#0a3625] antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <span className="text-[17px] font-semibold tracking-tight">Influencify</span>
          <nav className="flex items-center gap-5 sm:gap-6">
            <Link href="#como-funciona" className="hidden text-sm text-[#0a3625]/80 transition hover:text-[#0a3625] sm:block">
              Como funciona
            </Link>
            <Link href="#planos" className="hidden text-sm text-[#0a3625]/80 transition hover:text-[#0a3625] sm:block">
              Planos
            </Link>
            <Link href="#faq" className="hidden text-sm text-[#0a3625]/80 transition hover:text-[#0a3625] sm:block">
              FAQ
            </Link>
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
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center sm:pt-28">
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
            href="#planos"
            className="rounded-full px-7 py-3 text-[15px] font-medium text-[#0a3625] transition hover:underline"
          >
            Ver planos ›
          </Link>
        </div>
        <p className="mt-4 text-sm text-[#7a8578]">Grátis para começar · sem cartão · seus primeiros leads em minutos</p>
      </section>

      {/* Prova do produto */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <ProductShot />
      </section>

      {/* Agitação da dor */}
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

      {/* Dois públicos */}
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
      <section id="como-funciona" className="scroll-mt-14 bg-[#f4f6e8] py-24">
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
                  <Check />
                </div>
                <h3 className="mt-4 text-[17px] font-bold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4d584d]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos — preço transparente */}
      <section id="planos" className="scroll-mt-14 bg-[#f4f6e8] py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-4xl font-bold tracking-tight">Preço na mesa, sem pegadinha.</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#4d584d]">
            Comece de graça. Só pague quando os leads já estiverem chegando.
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-white p-8">
              <h3 className="text-lg font-bold">Gratuito</h3>
              <p className="mt-1 text-3xl font-bold tracking-tight">R$ 0</p>
              <p className="mt-1 text-xs text-[#7a8578]">para sempre · sem cartão</p>
              <ul className="mt-6 space-y-3 text-sm text-[#4d584d]">
                {[
                  "Campanhas e links rastreáveis",
                  "Perfil público do influenciador",
                  "Contato dos 10 primeiros leads",
                  "1 campanha própria (influenciador)",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-8 ring-2 ring-[#ccda47]">
              <h3 className="text-lg font-bold">{PLAN_PRICING.influencer.label}</h3>
              <p className="mt-1 text-3xl font-bold tracking-tight">{PLAN_PRICING.influencer.price}</p>
              <p className="mt-1 text-xs text-[#7a8578]">7 dias grátis · cancele quando quiser</p>
              <ul className="mt-6 space-y-3 text-sm text-[#4d584d]">
                {[
                  "Tudo do plano gratuito",
                  "Contato completo de todos os leads",
                  "Campanhas próprias ilimitadas",
                  "Desempenho detalhado por campanha",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-3xl bg-[#0a3625] p-8 text-white">
              <span className="absolute -top-3 right-8 rounded-full bg-[#ccda47] px-3 py-1 text-xs font-bold text-[#0a3625]">
                Mais completo
              </span>
              <h3 className="text-lg font-bold">{PLAN_PRICING.brand.label}</h3>
              <p className="mt-1 text-3xl font-bold tracking-tight text-[#ccda47]">{PLAN_PRICING.brand.price}</p>
              <p className="mt-1 text-xs text-white/50">7 dias grátis · cancele quando quiser</p>
              <ul className="mt-6 space-y-3 text-sm text-white/80">
                {[
                  "Tudo do plano gratuito",
                  "Contato completo de todos os leads",
                  "Exportação CSV para remarketing",
                  "Desempenho por influenciador",
                  "Pixel Meta, TikTok e Google",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="text-[#ccda47]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/register"
              className="inline-block rounded-full bg-[#0a3625] px-8 py-3.5 text-[15px] font-semibold text-white transition hover:bg-[#145238]"
            >
              Criar minha conta grátis
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-14 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-4xl font-bold tracking-tight">Perguntas frequentes.</h2>
          <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">
                  {item.q}
                  <span className="shrink-0 text-2xl font-light text-[#7a8578] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 pr-8 text-[15px] leading-relaxed text-[#4d584d]">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-[#7a8578]">
            Ficou alguma dúvida?{" "}
            <a href="mailto:theodormartinez@gmail.com" className="font-medium text-[#0a3625] hover:underline">
              Fale com a gente
            </a>
            .
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
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

      {/* Rodapé institucional */}
      <footer className="border-t border-black/5 bg-[#f4f6e8]">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-[17px] font-bold tracking-tight">Influencify</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#4d584d]">
                A plataforma que transforma marketing de influência em leads rastreados, do clique à conversão.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#7a8578]">Plataforma</p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#4d584d]">
                <li>
                  <Link href="#como-funciona" className="transition hover:text-[#0a3625]">
                    Como funciona
                  </Link>
                </li>
                <li>
                  <Link href="#planos" className="transition hover:text-[#0a3625]">
                    Planos e preços
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="transition hover:text-[#0a3625]">
                    Perguntas frequentes
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="transition hover:text-[#0a3625]">
                    Entrar
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#7a8578]">Para você</p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#4d584d]">
                <li>
                  <Link href="/register" className="transition hover:text-[#0a3625]">
                    Sou uma marca
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="transition hover:text-[#0a3625]">
                    Sou influenciador
                  </Link>
                </li>
                <li>
                  <a href="mailto:theodormartinez@gmail.com" className="transition hover:text-[#0a3625]">
                    Falar com o suporte
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#7a8578]">Legal</p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#4d584d]">
                <li>
                  <Link href="/termos" className="transition hover:text-[#0a3625]">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="/privacidade" className="transition hover:text-[#0a3625]">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <a href="mailto:theodormartinez@gmail.com" className="transition hover:text-[#0a3625]">
                    Encarregado de dados (LGPD)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-3 border-t border-black/10 pt-8 text-xs text-[#7a8578] sm:flex-row">
            <span>© {new Date().getFullYear()} Influencify. Todos os direitos reservados.</span>
            <span>Contato: theodormartinez@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

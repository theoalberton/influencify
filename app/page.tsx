import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-lg font-bold text-indigo-600">Influencify</span>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Entrar
          </Link>
          <LinkButton href="/register" size="sm">
            Criar conta grátis
          </LinkButton>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-16 pt-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Transforme a audiência do seu influenciador em leads de verdade
        </h1>
        <p className="mt-5 text-lg text-slate-600">
          Um perfil público com os cupons dos seus patrocinadores. O visitante deixa nome, e-mail e telefone para
          resgatar o desconto — e a marca recebe um lead qualificado e rastreado até a origem.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <LinkButton href="/register">Sou influenciador</LinkButton>
          <LinkButton href="/register" variant="secondary">
            Sou marca
          </LinkButton>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-6 pb-24 sm:grid-cols-3">
        <Card>
          <h3 className="font-semibold text-slate-900">Perfil público rastreável</h3>
          <p className="mt-2 text-sm text-slate-500">
            Cada influenciador tem um link próprio (/i/seu-nome) com todas as ofertas dos patrocinadores.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold text-slate-900">Cupom em troca de dados</h3>
          <p className="mt-2 text-sm text-slate-500">
            O visitante preenche um formulário rápido e recebe o cupom na hora — sem precisar criar conta.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold text-slate-900">Leads prontos para remarketing</h3>
          <p className="mt-2 text-sm text-slate-500">
            A marca vê a origem de cada lead (influenciador, campanha, UTM) e exporta tudo em CSV.
          </p>
        </Card>
      </section>
    </div>
  );
}

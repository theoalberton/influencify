import Link from "next/link";

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] antialiased">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="text-[17px] font-semibold tracking-tight">
            Influencify
          </Link>
          <Link href="/" className="text-sm text-[#0071e3] hover:underline">
            Voltar ao início
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-[#86868b]">Última atualização: {updated}</p>
        <div className="prose-legal mt-10 space-y-8 text-[15px] leading-relaxed text-[#424245]">{children}</div>
      </main>

      <footer className="border-t border-black/5 bg-[#f5f5f7]">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-6 py-8 text-xs text-[#86868b]">
          <span>Influencify</span>
          <span className="flex gap-4">
            <Link href="/termos" className="hover:underline">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:underline">
              Política de Privacidade
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold tracking-tight text-[#1d1d1f]">{title}</h2>
      {children}
    </section>
  );
}

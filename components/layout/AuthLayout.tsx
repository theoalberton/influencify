import Link from "next/link";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f7]">
      <header className="flex justify-center py-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[#1d1d1f]">
          Influencify
        </Link>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pb-16">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          {children}
        </div>
      </main>

      <footer className="flex justify-center gap-4 pb-8 text-center text-xs text-[#86868b]">
        <Link href="/termos" className="hover:underline">
          Termos de Uso
        </Link>
        <Link href="/privacidade" className="hover:underline">
          Política de Privacidade
        </Link>
      </footer>
    </div>
  );
}

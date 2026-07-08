import Link from "next/link";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-slate-950 lg:block">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-1/4 h-[400px] w-[400px] rounded-full bg-indigo-600/30 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-fuchsia-600/20 blur-[100px]"
        />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
              Influencify
            </span>
          </Link>

          <div>
            <h2 className="max-w-md text-3xl font-extrabold leading-tight text-white">
              Todo clique da sua audiência vira um lead com nome, contato e origem.
            </h2>
            <p className="mt-4 max-w-md text-slate-400">
              Cupons exclusivos, links rastreáveis e dashboards de atribuição — em uma única plataforma.
            </p>
          </div>

          <p className="text-xs text-slate-500">Marketing de influência com atribuição de verdade.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center bg-white px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

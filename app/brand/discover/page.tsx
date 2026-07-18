import { redirect } from "next/navigation";
import Link from "next/link";
import { requireRole, getMyBrand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Table";
import { formatFollowers } from "@/lib/utils";
import { linkInfluencer } from "./actions";
import type { Influencer } from "@/lib/database.types";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const profile = await requireRole("brand");
  const brand = await getMyBrand();
  if (!brand) redirect("/brand/profile");

  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const supabase = await createClient();

  let request = supabase
    .from("influencers")
    .select("*")
    .eq("is_active", true)
    .order("followers_count", { ascending: false, nullsFirst: false })
    .limit(60);

  if (query) {
    request = request.or(`display_name.ilike.%${query}%,niche.ilike.%${query}%,city.ilike.%${query}%`);
  }

  const [{ data: influencers }, { data: myLinks }] = await Promise.all([
    request,
    supabase.from("brand_influencers").select("influencer_id, status").eq("brand_id", brand.id),
  ]);

  const linkedIds = new Map((myLinks ?? []).map((l) => [l.influencer_id, l.status as string]));
  const list = (influencers ?? []) as Influencer[];

  return (
    <DashboardShell role="brand" name={profile.name} title="Descobrir influenciadores">
      <p className="max-w-2xl text-sm text-[#4d584d]">
        Encontre criadores por nome, nicho ou cidade e vincule como embaixadores da sua marca. Depois é só
        convidá-los para as campanhas certas.
      </p>

      <form className="mt-5 flex max-w-xl gap-2" action="/brand/discover">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Buscar por nome, nicho ou cidade..."
          className="w-full rounded-full border border-[#dde0cb] bg-white px-5 py-2.5 text-sm text-[#0a3625] placeholder:text-[#a3ac9c] focus:border-[#0a3625] focus:outline-none focus:ring-2 focus:ring-[#0a3625]/10"
        />
        <Button type="submit" variant="primary">
          Buscar
        </Button>
      </form>

      {list.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title={query ? `Nada encontrado para “${query}”` : "Nenhum influenciador cadastrado ainda"}
            description={
              query
                ? "Tente outro termo — ou limpe a busca para ver todos."
                : "Assim que influenciadores criarem perfil na Influencify, eles aparecem aqui."
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((inf) => {
            const linkStatus = linkedIds.get(inf.id);
            return (
              <div key={inf.id} className="rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-4">
                  {inf.profile_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={inf.profile_image_url}
                      alt={inf.display_name}
                      className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-[#f4f6e8]"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0a3625] text-lg font-bold text-[#ccda47]">
                      {inf.display_name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#0a3625]">{inf.display_name}</p>
                    <p className="truncate text-xs text-[#7a8578]">
                      {[inf.niche, inf.city].filter(Boolean).join(" · ") || "—"}
                    </p>
                    {inf.followers_count ? (
                      <p className="text-xs font-medium text-[#4d584d]">
                        {formatFollowers(inf.followers_count)} seguidores
                      </p>
                    ) : null}
                  </div>
                </div>

                {inf.bio && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#4d584d]">{inf.bio}</p>}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {linkStatus === "active" ? (
                    <Badge tone="converted">embaixador ✓</Badge>
                  ) : linkStatus ? (
                    <Badge tone={linkStatus}>{linkStatus === "paused" ? "pausado" : "removido"}</Badge>
                  ) : (
                    <form action={linkInfluencer.bind(null, inf.id)}>
                      <Button type="submit" size="sm" variant="primary">
                        Vincular como embaixador
                      </Button>
                    </form>
                  )}
                  <Link
                    href={`/i/${inf.slug}/midia-kit`}
                    target="_blank"
                    className="text-xs font-medium text-[#0a3625] hover:underline"
                  >
                    Ver mídia kit ›
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}

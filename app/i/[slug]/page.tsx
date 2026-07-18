import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDiscount, formatFollowers, INFLUENCER_PUBLIC_COLUMNS } from "@/lib/utils";
import type { Brand, Campaign, CampaignInfluencer } from "@/lib/database.types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: influencer } = await supabase
    .from("influencers")
    .select("display_name, bio, profile_image_url")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!influencer) return { title: "Perfil não encontrado" };

  const description =
    influencer.bio ?? `Cupons e ofertas exclusivas de ${influencer.display_name}. Resgate o seu desconto.`;

  return {
    title: `Cupons de ${influencer.display_name}`,
    description,
    openGraph: {
      title: `Cupons de ${influencer.display_name}`,
      description,
      ...(influencer.profile_image_url ? { images: [influencer.profile_image_url] } : {}),
    },
  };
}

/** Normaliza handle salvo com ou sem @ para montar o link da rede. */
function handleToUrl(base: string, handle: string): string {
  return `${base}${handle.replace(/^@/, "").trim()}`;
}

function SocialPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
    >
      {label}
    </a>
  );
}

export default async function InfluencerPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: influencer } = await supabase
    .from("influencers")
    .select(INFLUENCER_PUBLIC_COLUMNS)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!influencer) notFound();

  const { data: links } = await supabase
    .from("campaign_influencers")
    .select("*, campaigns(*, brands(*))")
    .eq("influencer_id", influencer.id)
    .eq("status", "active");

  const offers = (links ?? [])
    .map((l) => ({
      link: l as CampaignInfluencer,
      campaign: (l as unknown as { campaigns: Campaign & { brands: Brand | null } }).campaigns,
    }))
    .filter((o) => o.campaign && o.campaign.status === "active");

  const stats: { value: string; label: string }[] = [
    { value: String(offers.length), label: offers.length === 1 ? "oferta" : "ofertas" },
  ];
  if (influencer.followers_count) {
    stats.push({ value: formatFollowers(influencer.followers_count), label: "seguidores" });
  }
  if (influencer.niche) {
    stats.push({ value: influencer.niche, label: "nicho" });
  }

  return (
    <div className="min-h-screen bg-[#f4f6e8]">
      {/* Capa estilo Instagram: bottle green com brilhos wattle */}
      <div className="relative overflow-hidden bg-[#0a3625] pb-20 pt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ccda47]/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#ccda47]/10 blur-3xl"
        />

        <div className="relative mx-auto flex max-w-lg flex-col items-center px-4 text-center">
          {influencer.profile_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={influencer.profile_image_url}
              alt={influencer.display_name}
              width={112}
              height={112}
              className="h-28 w-28 rounded-full object-cover ring-4 ring-[#ccda47] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#ccda47] text-3xl font-bold text-[#0a3625] ring-4 ring-[#ccda47] shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
              {influencer.display_name.slice(0, 1).toUpperCase()}
            </div>
          )}

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">{influencer.display_name}</h1>
          {influencer.bio && <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/75">{influencer.bio}</p>}

          {(influencer.instagram || influencer.tiktok || influencer.youtube) && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {influencer.instagram && (
                <SocialPill href={handleToUrl("https://instagram.com/", influencer.instagram)} label="Instagram" />
              )}
              {influencer.tiktok && (
                <SocialPill href={handleToUrl("https://tiktok.com/@", influencer.tiktok)} label="TikTok" />
              )}
              {influencer.youtube && (
                <SocialPill href={handleToUrl("https://youtube.com/@", influencer.youtube)} label="YouTube" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Linha de estatísticas sobreposta, como o header do Instagram */}
      <div className="mx-auto -mt-10 max-w-lg px-4">
        <div className="flex divide-x divide-black/5 rounded-2xl bg-white py-4 shadow-[0_8px_30px_rgba(10,54,37,0.12)]">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-1 flex-col items-center px-2 text-center">
              <span className="truncate text-lg font-bold tracking-tight text-[#0a3625]">{stat.value}</span>
              <span className="text-xs text-[#7a8578]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feed de ofertas */}
      <div className="mx-auto max-w-lg px-4 pb-16 pt-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {offers.length === 0 ? (
            <p className="col-span-full py-8 text-center text-sm text-[#7a8578]">
              Nenhuma oferta disponível no momento. Volte em breve!
            </p>
          ) : (
            offers.map(({ link, campaign }) => {
              // Campanha de marca mostra a marca; campanha própria mostra o
              // produto/nome do influenciador.
              const ownerName =
                campaign.brands?.company_name ?? campaign.product_name ?? influencer.display_name;
              const ownerImage = campaign.brands?.logo_url ?? (campaign.brands ? null : influencer.profile_image_url);

              return (
                <a
                  key={link.id}
                  href={`/i/${influencer.slug}/oferta/${campaign.slug}?ref=${link.referral_code}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)]"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-[#f4f6e8]">
                    {campaign.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={campaign.image_url}
                        alt={campaign.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#e9ecd8] text-3xl font-semibold text-[#a3ac9c]">
                        {ownerName?.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                      {formatDiscount(campaign.discount_type, campaign.discount_value)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3.5">
                    {ownerImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={ownerImage}
                        alt={ownerName ?? ""}
                        className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-black/5"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f6e8] text-xs font-semibold text-[#7a8578] ring-1 ring-black/5">
                        {ownerName?.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[#0a3625]">{campaign.title}</p>
                      <p className="truncate text-xs text-[#7a8578]">{ownerName}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#ccda47] px-3 py-1.5 text-xs font-bold text-[#0a3625]">
                      Pegar cupom
                    </span>
                  </div>
                </a>
              );
            })
          )}
        </div>

        <p className="mt-12 text-center text-xs text-[#a3ac9c]">
          Feito com{" "}
          <Link href="/" className="font-semibold text-[#7a8578] hover:underline">
            Influencify
          </Link>
        </p>
      </div>
    </div>
  );
}

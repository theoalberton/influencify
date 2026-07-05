import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDiscount } from "@/lib/utils";
import type { Brand, Campaign, CampaignInfluencer } from "@/lib/database.types";

export default async function InfluencerPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: influencer } = await supabase
    .from("influencers")
    .select("*")
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
      campaign: (l as unknown as { campaigns: Campaign & { brands: Brand } }).campaigns,
    }))
    .filter((o) => o.campaign && o.campaign.status === "active");

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-12">
      <div className="mx-auto max-w-lg">
        <div className="flex flex-col items-center text-center">
          {influencer.profile_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={influencer.profile_image_url}
              alt={influencer.display_name}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600 ring-4 ring-white shadow">
              {influencer.display_name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <h1 className="mt-4 text-2xl font-bold text-slate-900">{influencer.display_name}</h1>
          {influencer.bio && <p className="mt-1 max-w-sm text-sm text-slate-600">{influencer.bio}</p>}

          <div className="mt-3 flex gap-3 text-sm text-slate-500">
            {influencer.instagram && <span>{influencer.instagram}</span>}
            {influencer.tiktok && <span>{influencer.tiktok}</span>}
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {offers.length === 0 ? (
            <p className="col-span-full text-center text-sm text-slate-400">Nenhuma oferta disponível no momento.</p>
          ) : (
            offers.map(({ link, campaign }) => (
              <a
                key={link.id}
                href={`/i/${influencer.slug}/oferta/${campaign.slug}?ref=${link.referral_code}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  {campaign.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={campaign.image_url}
                      alt={campaign.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-fuchsia-100 text-3xl font-bold text-indigo-300">
                      {campaign.brands?.company_name?.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                    {formatDiscount(campaign.discount_type, campaign.discount_value)}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3">
                  {campaign.brands?.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={campaign.brands.logo_url}
                      alt={campaign.brands.company_name}
                      className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-400 ring-1 ring-slate-200">
                      {campaign.brands?.company_name?.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{campaign.title}</p>
                    <p className="truncate text-xs text-slate-500">{campaign.brands?.company_name}</p>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>

        <p className="mt-12 text-center text-xs text-slate-300">Feito com Influencify</p>
      </div>
    </div>
  );
}

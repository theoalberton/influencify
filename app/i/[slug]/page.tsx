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

        <div className="mt-10 space-y-4">
          {offers.length === 0 ? (
            <p className="text-center text-sm text-slate-400">Nenhuma oferta disponível no momento.</p>
          ) : (
            offers.map(({ link, campaign }) => (
              <a
                key={link.id}
                href={`/i/${influencer.slug}/oferta/${campaign.slug}?ref=${link.referral_code}`}
                className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  {campaign.brands?.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={campaign.brands.logo_url}
                      alt={campaign.brands.company_name}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-400 ring-1 ring-slate-200">
                      {campaign.brands?.company_name?.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
                      {campaign.brands?.company_name}
                    </p>
                    <p className="font-semibold text-slate-900">{campaign.title}</p>
                    <p className="text-sm text-slate-500">{formatDiscount(campaign.discount_type, campaign.discount_value)}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white">Ver oferta</span>
              </a>
            ))
          )}
        </div>

        <p className="mt-12 text-center text-xs text-slate-300">Feito com Influencify</p>
      </div>
    </div>
  );
}

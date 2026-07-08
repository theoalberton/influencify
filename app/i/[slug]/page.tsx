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
    <div className="min-h-screen bg-[#f5f5f7] px-4 py-12">
      <div className="mx-auto max-w-lg">
        <div className="flex flex-col items-center text-center">
          {influencer.profile_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={influencer.profile_image_url}
              alt={influencer.display_name}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1d1d1f] text-2xl font-semibold text-white ring-4 ring-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
              {influencer.display_name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#1d1d1f]">{influencer.display_name}</h1>
          {influencer.bio && <p className="mt-1 max-w-sm text-sm text-[#6e6e73]">{influencer.bio}</p>}

          <div className="mt-3 flex gap-3 text-sm text-[#86868b]">
            {influencer.instagram && <span>{influencer.instagram}</span>}
            {influencer.tiktok && <span>{influencer.tiktok}</span>}
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {offers.length === 0 ? (
            <p className="col-span-full text-center text-sm text-[#86868b]">Nenhuma oferta disponível no momento.</p>
          ) : (
            offers.map(({ link, campaign }) => (
              <a
                key={link.id}
                href={`/i/${influencer.slug}/oferta/${campaign.slug}?ref=${link.referral_code}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)]"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-[#f5f5f7]">
                  {campaign.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={campaign.image_url}
                      alt={campaign.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#e8e8ed] text-3xl font-semibold text-[#b0b0b8]">
                      {campaign.brands?.company_name?.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                    {formatDiscount(campaign.discount_type, campaign.discount_value)}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3.5">
                  {campaign.brands?.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={campaign.brands.logo_url}
                      alt={campaign.brands.company_name}
                      className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-black/5"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f5f7] text-xs font-semibold text-[#86868b] ring-1 ring-black/5">
                      {campaign.brands?.company_name?.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#1d1d1f]">{campaign.title}</p>
                    <p className="truncate text-xs text-[#86868b]">{campaign.brands?.company_name}</p>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>

        <p className="mt-12 text-center text-xs text-[#b0b0b8]">Feito com Influencify</p>
      </div>
    </div>
  );
}

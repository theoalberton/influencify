import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { formatDiscount, INFLUENCER_PUBLIC_COLUMNS } from "@/lib/utils";
import { hashRequestIp, requestUserAgent } from "@/lib/track";
import { LeadForm } from "./LeadForm";
import type { Brand, Campaign, CampaignInfluencer } from "@/lib/database.types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; offerSlug: string }>;
}): Promise<Metadata> {
  const { slug, offerSlug } = await params;
  const supabase = await createClient();

  const [{ data: influencer }, { data: campaign }] = await Promise.all([
    supabase.from("influencers").select("display_name").eq("slug", slug).eq("is_active", true).single(),
    supabase
      .from("campaigns")
      .select("title, product_name, discount_type, discount_value, image_url, brands(company_name)")
      .eq("slug", offerSlug)
      .eq("status", "active")
      .single(),
  ]);

  if (!influencer || !campaign) return { title: "Oferta não encontrada" };

  const typed = campaign as unknown as Campaign & { brands: Pick<Brand, "company_name"> | null };
  const discount = formatDiscount(typed.discount_type, typed.discount_value);
  const origin = typed.brands?.company_name ?? influencer.display_name;
  const title = `${discount} em ${typed.product_name ?? typed.title}`;
  const description = `Cupom exclusivo de ${influencer.display_name} para ${origin}. Resgate o seu desconto em segundos.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(typed.image_url ? { images: [typed.image_url] } : {}),
    },
  };
}

export default async function OfferPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; offerSlug: string }>;
  searchParams: Promise<{ ref?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string }>;
}) {
  const { slug, offerSlug } = await params;
  const query = await searchParams;

  const supabase = await createClient();

  const { data: influencer } = await supabase
    .from("influencers")
    .select(INFLUENCER_PUBLIC_COLUMNS)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!influencer) notFound();

  let campaignInfluencer: CampaignInfluencer | null = null;

  // Só links ATIVOS são públicos — convite pendente ou recusado não abre a oferta.
  if (query.ref) {
    const { data } = await supabase
      .from("campaign_influencers")
      .select("*")
      .eq("referral_code", query.ref)
      .eq("influencer_id", influencer.id)
      .eq("status", "active")
      .single();
    campaignInfluencer = data;
  }

  if (!campaignInfluencer) {
    const { data: campaignBySlug } = await supabase.from("campaigns").select("id").eq("slug", offerSlug).single();
    if (campaignBySlug) {
      const { data } = await supabase
        .from("campaign_influencers")
        .select("*")
        .eq("campaign_id", campaignBySlug.id)
        .eq("influencer_id", influencer.id)
        .eq("status", "active")
        .single();
      campaignInfluencer = data;
    }
  }

  if (!campaignInfluencer) notFound();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*, brands(*)")
    .eq("id", campaignInfluencer.campaign_id)
    .eq("slug", offerSlug)
    .eq("status", "active")
    .single();

  if (!campaign) notFound();

  const typedCampaign = campaign as Campaign & { brands: Brand | null };

  await supabase.from("clicks").insert({
    campaign_id: typedCampaign.id,
    influencer_id: influencer.id,
    referral_code: campaignInfluencer.referral_code,
    ip_hash: await hashRequestIp(),
    user_agent: await requestUserAgent(),
    source: query.utm_source ?? "profile",
  });

  const campaignUtm = [query.utm_source, query.utm_medium, query.utm_campaign].filter(Boolean).join("/");

  return (
    <div className="min-h-screen bg-[#f4f6e8] px-4 py-12">
      {typedCampaign.meta_pixel_id && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${typedCampaign.meta_pixel_id.replace(/[^0-9]/g, "")}');
          fbq('track', 'PageView');
          fbq('track', 'ViewContent', { content_name: ${JSON.stringify(typedCampaign.title)} });`}
        </Script>
      )}
      <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        {typedCampaign.image_url && (
          <div className="aspect-video w-full bg-[#f4f6e8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={typedCampaign.image_url} alt={typedCampaign.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center gap-2">
            {typedCampaign.brands?.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={typedCampaign.brands.logo_url}
                alt={typedCampaign.brands.company_name}
                className="h-6 w-6 rounded-full object-cover ring-1 ring-black/5"
              />
            )}
            <p className="text-xs font-medium text-[#7a8578]">
              {typedCampaign.brands
                ? `${typedCampaign.brands.company_name} · via ${influencer.display_name}`
                : `Oferta de ${influencer.display_name}${typedCampaign.product_name ? ` · ${typedCampaign.product_name}` : ""}`}
            </p>
          </div>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#0a3625]">{typedCampaign.title}</h1>
          <p className="mt-2 text-sm font-semibold text-[#0a3625]">
            {formatDiscount(typedCampaign.discount_type, typedCampaign.discount_value)}
          </p>
          {typedCampaign.description && <p className="mt-2 text-sm text-[#4d584d]">{typedCampaign.description}</p>}

          <div className="mt-6 border-t border-black/5 pt-6">
            <LeadForm
              campaignId={typedCampaign.id}
              brandId={typedCampaign.brand_id ?? ""}
              influencerId={influencer.id}
              referralCode={campaignInfluencer.referral_code}
              requiredFields={typedCampaign.required_fields}
              source="profile"
              campaignUtm={campaignUtm}
              metaPixelId={typedCampaign.meta_pixel_id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

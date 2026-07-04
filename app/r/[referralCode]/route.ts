import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ referralCode: string }> }
) {
  const { referralCode } = await params;
  const supabase = await createClient();

  const { data: link } = await supabase
    .from("campaign_influencers")
    .select("referral_code, campaigns(slug), influencers(slug)")
    .eq("referral_code", referralCode)
    .single();

  if (!link) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const campaignSlug = (link as unknown as { campaigns: { slug: string } | null }).campaigns?.slug;
  const influencerSlug = (link as unknown as { influencers: { slug: string } | null }).influencers?.slug;

  if (!campaignSlug || !influencerSlug) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const target = new URL(`/i/${influencerSlug}/oferta/${campaignSlug}`, request.url);
  target.searchParams.set("ref", referralCode);
  request.nextUrl.searchParams.forEach((value, key) => {
    if (key.startsWith("utm_")) target.searchParams.set(key, value);
  });

  return NextResponse.redirect(target);
}

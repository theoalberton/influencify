import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://influencify-eight.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/register`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/login`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/termos`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacidade`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Perfis públicos ativos entram no índice (leitura anônima permitida por RLS).
  const supabase = await createClient();
  const { data: influencers } = await supabase
    .from("influencers")
    .select("slug")
    .eq("is_active", true)
    .limit(5000);

  const profileRoutes: MetadataRoute.Sitemap = (influencers ?? []).map((inf) => ({
    url: `${siteUrl}/i/${inf.slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...profileRoutes];
}

import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://influencify-eight.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Painéis e rotas de sessão não devem ser indexados.
      disallow: ["/admin/", "/brand/", "/influencer/", "/api/", "/upgrade", "/auth/", "/r/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

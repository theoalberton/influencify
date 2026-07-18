import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Display jovem e marcante para títulos; sans geométrica e amigável no corpo.
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans-app",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://influencify-eight.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Influencify — Marketing de influência com atribuição de verdade",
    template: "%s · Influencify",
  },
  description:
    "Transforme cada post dos seus influenciadores em leads com nome e contato — e saiba exatamente quem vendeu o quê. Grátis para começar.",
  openGraph: {
    type: "website",
    siteName: "Influencify",
    locale: "pt_BR",
    title: "Influencify — Marketing de influência com atribuição de verdade",
    description:
      "Transforme cada post dos seus influenciadores em leads com nome e contato — e saiba exatamente quem vendeu o quê.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

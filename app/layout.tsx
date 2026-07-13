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

export const metadata: Metadata = {
  title: "Influencify — Transforme audiência em leads",
  description:
    "Influenciadores divulgam cupons de marcas, o público resgata deixando seus dados, e tudo fica rastreado do clique ao lead.",
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

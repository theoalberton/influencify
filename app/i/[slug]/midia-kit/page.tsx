import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatFollowers, INFLUENCER_PUBLIC_COLUMNS } from "@/lib/utils";

interface PublicStats {
  total_clicks: number;
  total_leads: number;
  converted_leads: number;
  active_campaigns: number;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: influencer } = await supabase
    .from("influencers")
    .select("display_name")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!influencer) return { title: "Mídia kit não encontrado" };
  return {
    title: `Mídia kit de ${influencer.display_name}`,
    description: `Números reais de conversão de ${influencer.display_name}, medidos pela Influencify: cliques, leads e campanhas.`,
  };
}

export default async function MediaKitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: influencer } = await supabase
    .from("influencers")
    .select(INFLUENCER_PUBLIC_COLUMNS)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!influencer) notFound();

  const { data: statsData } = await supabase.rpc("public_influencer_stats", { profile_slug: slug });
  const stats = ((statsData as PublicStats[] | null)?.[0] ?? {
    total_clicks: 0,
    total_leads: 0,
    converted_leads: 0,
    active_campaigns: 0,
  }) as PublicStats;

  const conversion =
    Number(stats.total_clicks) > 0
      ? ((Number(stats.total_leads) / Number(stats.total_clicks)) * 100).toFixed(1).replace(".", ",")
      : null;

  const cards = [
    { value: String(stats.total_clicks), label: "cliques rastreados" },
    { value: String(stats.total_leads), label: "leads captados" },
    { value: conversion ? `${conversion}%` : "—", label: "taxa de conversão clique → lead" },
    { value: String(stats.active_campaigns), label: "campanhas ativas" },
  ];

  return (
    <div className="min-h-screen bg-[#0a3625]">
      <div className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ccda47]/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#ccda47]/10 blur-3xl" />

        <div className="relative mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ccda47]/80">Mídia kit</p>

          {influencer.profile_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={influencer.profile_image_url}
              alt={influencer.display_name}
              width={112}
              height={112}
              className="mx-auto mt-6 h-28 w-28 rounded-full object-cover ring-4 ring-[#ccda47]"
            />
          ) : (
            <div className="mx-auto mt-6 flex h-28 w-28 items-center justify-center rounded-full bg-[#ccda47] text-3xl font-bold text-[#0a3625]">
              {influencer.display_name.slice(0, 1).toUpperCase()}
            </div>
          )}

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">{influencer.display_name}</h1>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-white/70">
            {influencer.niche && <span className="rounded-full bg-white/10 px-3 py-1">{influencer.niche}</span>}
            {influencer.followers_count ? (
              <span className="rounded-full bg-white/10 px-3 py-1">
                {formatFollowers(influencer.followers_count)} seguidores
              </span>
            ) : null}
            {influencer.city && <span className="rounded-full bg-white/10 px-3 py-1">{influencer.city}</span>}
          </div>

          {influencer.bio && <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/70">{influencer.bio}</p>}

          {/* Números medidos — o argumento de venda */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cards.map((card) => (
              <div key={card.label} className="rounded-2xl bg-white/5 px-4 py-5 ring-1 ring-white/10">
                <p className="text-3xl font-bold tracking-tight text-[#ccda47]">{card.value}</p>
                <p className="mt-1 text-xs leading-snug text-white/60">{card.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40">
            Números medidos automaticamente pela Influencify — não são autodeclarados.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`/i/${influencer.slug}`}
              className="rounded-full bg-[#ccda47] px-7 py-3 text-sm font-bold text-[#0a3625] transition hover:brightness-105"
            >
              Ver perfil e ofertas
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Sou marca — quero trabalhar com influenciadores
            </Link>
          </div>

          <p className="mt-14 text-xs text-white/40">
            Feito com{" "}
            <Link href="/" className="font-semibold text-white/60 hover:underline">
              Influencify
            </Link>{" "}
            — marketing de influência com atribuição de verdade.
          </p>
        </div>
      </div>
    </div>
  );
}

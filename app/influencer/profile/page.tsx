import { requireRole, getMyInfluencer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/Card";
import { ProfilePreviewCard } from "@/components/ui/ProfilePreviewCard";
import { formatFollowers } from "@/lib/utils";
import { ProfileForm } from "./ProfileForm";

export default async function InfluencerProfilePage() {
  const profile = await requireRole("influencer");
  const influencer = await getMyInfluencer();

  let offersCount = 0;
  let leadsCount = 0;
  if (influencer) {
    const supabase = await createClient();
    const [{ count: offers }, { count: leads }] = await Promise.all([
      supabase
        .from("campaign_influencers")
        .select("id", { count: "exact", head: true })
        .eq("influencer_id", influencer.id)
        .eq("status", "active"),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("influencer_id", influencer.id),
    ]);
    offersCount = offers ?? 0;
    leadsCount = leads ?? 0;
  }

  return (
    <DashboardShell role="influencer" name={profile.name} title="Meu perfil público">
      <div className="max-w-3xl">
        {influencer && (
          <ProfilePreviewCard
            imageUrl={influencer.profile_image_url}
            name={influencer.display_name}
            subtitle={`influencify.app/i/${influencer.slug}`}
            bio={influencer.bio}
            pills={[influencer.niche, influencer.city].filter((p): p is string => Boolean(p))}
            stats={[
              { value: String(offersCount), label: offersCount === 1 ? "oferta ativa" : "ofertas ativas" },
              { value: String(leadsCount), label: "leads gerados" },
              ...(influencer.followers_count
                ? [{ value: formatFollowers(influencer.followers_count), label: "seguidores" }]
                : []),
            ]}
          />
        )}

        <Card>
          {!influencer && (
            <p className="mb-5 rounded-lg bg-[#eef3d6] px-3 py-2 text-sm text-[#0a3625]">
              Complete seu perfil para liberar o dashboard e começar a divulgar ofertas.
            </p>
          )}
          <ProfileForm influencer={influencer} />
        </Card>
      </div>
    </DashboardShell>
  );
}

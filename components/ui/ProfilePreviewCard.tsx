/**
 * Preview estilo Instagram do perfil — mostra em tempo real (a cada save)
 * como o público vê o influenciador ou a marca.
 */
export function ProfilePreviewCard({
  imageUrl,
  name,
  subtitle,
  bio,
  stats,
  pills,
}: {
  imageUrl: string | null;
  name: string;
  subtitle?: string | null;
  bio?: string | null;
  stats: { value: string; label: string }[];
  pills?: string[];
}) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl bg-[#0a3625] px-6 py-8 text-white">
      <div aria-hidden className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#ccda47]/15 blur-2xl" />

      <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-[#ccda47]"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#ccda47] text-3xl font-bold text-[#0a3625]">
            {name.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h2 className="truncate text-2xl font-bold tracking-tight">{name}</h2>
          {subtitle && <p className="mt-0.5 truncate text-sm text-[#ccda47]">{subtitle}</p>}
          {bio && <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-white/70">{bio}</p>}
          {pills && pills.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {pills.map((pill) => (
                <span key={pill} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                  {pill}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 gap-6 sm:flex-col sm:gap-3 sm:text-right">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-right">
              <p className="text-xl font-bold tracking-tight text-[#ccda47]">{stat.value}</p>
              <p className="text-xs text-white/55">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

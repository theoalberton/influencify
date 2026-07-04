-- ============================================================================
-- Influencify — schema inicial (MVP)
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- profiles: 1 linha por usuário autenticado (auth.users), guarda o "papel"
-- ----------------------------------------------------------------------------
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  account_type text not null check (account_type in ('influencer', 'brand', 'admin')),
  name text not null,
  email text not null,
  phone text,
  avatar_url text,
  plan_type text not null default 'free' check (plan_type in ('free', 'influencer', 'brand', 'premium')),
  plan_status text not null default 'active' check (plan_status in ('active', 'trialing', 'past_due', 'canceled')),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- influencers: perfil público de domínio, 1:1 com profiles (account_type=influencer)
-- ----------------------------------------------------------------------------
create table influencers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  slug text not null unique,
  display_name text not null,
  bio text,
  instagram text,
  tiktok text,
  youtube text,
  followers_count integer,
  niche text,
  city text,
  country text,
  profile_image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index influencers_slug_idx on influencers (slug);

-- ----------------------------------------------------------------------------
-- brands
-- ----------------------------------------------------------------------------
create table brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  company_name text not null,
  slug text not null unique,
  segment text,
  website text,
  instagram text,
  contact_name text,
  email text,
  phone text,
  logo_url text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- campaigns: ofertas/cupons cadastrados por uma marca
-- ----------------------------------------------------------------------------
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands (id) on delete cascade,
  title text not null,
  slug text not null,
  product_name text,
  description text,
  image_url text,
  discount_type text not null check (discount_type in ('percentage', 'fixed', 'free_shipping', 'custom')),
  discount_value text,
  coupon_code text,
  destination_url text,
  start_date date,
  end_date date,
  status text not null default 'active' check (status in ('active', 'paused', 'ended')),
  required_fields jsonb not null default '["name", "email"]'::jsonb,
  meta_pixel_id text,
  tiktok_pixel_id text,
  google_tag_id text,
  internal_notes text,
  created_at timestamptz not null default now(),
  unique (brand_id, slug)
);

create index campaigns_brand_idx on campaigns (brand_id);
create index campaigns_status_idx on campaigns (status);

-- ----------------------------------------------------------------------------
-- brand_influencers: vínculo de embaixador (marca <-> influenciador)
-- ----------------------------------------------------------------------------
create table brand_influencers (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands (id) on delete cascade,
  influencer_id uuid not null references influencers (id) on delete cascade,
  status text not null default 'invited' check (status in ('invited', 'active', 'paused', 'removed')),
  commission_type text,
  commission_value numeric,
  created_at timestamptz not null default now(),
  unique (brand_id, influencer_id)
);

-- ----------------------------------------------------------------------------
-- campaign_influencers: liga um influenciador a uma campanha específica,
-- gerando o referral_code / link público único daquela dupla.
-- ----------------------------------------------------------------------------
create table campaign_influencers (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns (id) on delete cascade,
  influencer_id uuid not null references influencers (id) on delete cascade,
  referral_code text not null unique,
  public_url text,
  status text not null default 'active' check (status in ('active', 'paused', 'removed')),
  created_at timestamptz not null default now(),
  unique (campaign_id, influencer_id)
);

create index campaign_influencers_code_idx on campaign_influencers (referral_code);

-- ----------------------------------------------------------------------------
-- referrals: contador agregado por código (1:1 com campaign_influencers.referral_code,
-- mas mantido em tabela própria para permitir cadeias de indicação no futuro)
-- ----------------------------------------------------------------------------
create table referrals (
  id uuid primary key default gen_random_uuid(),
  referral_code text not null unique,
  influencer_id uuid references influencers (id) on delete cascade,
  campaign_id uuid references campaigns (id) on delete cascade,
  parent_referral_code text,
  clicks integer not null default 0,
  leads_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- leads: dado do visitante final capturado ao resgatar um cupom
-- ----------------------------------------------------------------------------
create table leads (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns (id) on delete set null,
  brand_id uuid references brands (id) on delete set null,
  influencer_id uuid references influencers (id) on delete set null,
  referral_code text,
  name text not null,
  email text,
  phone text,
  city text,
  consent boolean not null default false,
  source text,
  medium text,
  campaign_utm text,
  status text not null default 'new' check (status in ('new', 'sent', 'converted', 'lost')),
  coupon_revealed boolean not null default false,
  clicked_store boolean not null default false,
  created_at timestamptz not null default now()
);

create index leads_brand_idx on leads (brand_id);
create index leads_influencer_idx on leads (influencer_id);
create index leads_campaign_idx on leads (campaign_id);

-- ----------------------------------------------------------------------------
-- clicks: log bruto de cliques em links rastreáveis
-- ----------------------------------------------------------------------------
create table clicks (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns (id) on delete cascade,
  influencer_id uuid references influencers (id) on delete cascade,
  referral_code text,
  ip_hash text,
  user_agent text,
  source text,
  created_at timestamptz not null default now()
);

create index clicks_referral_code_idx on clicks (referral_code);

-- ----------------------------------------------------------------------------
-- plans: catálogo de planos (sem cobrança real no MVP)
-- ----------------------------------------------------------------------------
create table plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('free', 'influencer', 'brand', 'premium')),
  price numeric not null default 0,
  lead_limit integer,
  campaign_limit integer,
  ambassador_limit integer,
  features jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

insert into plans (name, type, price, lead_limit, campaign_limit, ambassador_limit, features) values
  ('Gratuito', 'free', 0, 50, 1, 1, '["Perfil público básico"]'),
  ('Influenciador', 'influencer', 49.90, 1000, 10, null, '["Perfil público", "Links rastreáveis", "Dashboard de leads"]'),
  ('Marca', 'brand', 199.90, 5000, 20, 20, '["Campanhas ilimitadas por período", "Export CSV", "Pixel de remarketing"]'),
  ('Premium', 'premium', 499.90, null, null, null, '["Tudo do plano Marca", "Suporte prioritário", "Automação de WhatsApp/e-mail"]');

-- ----------------------------------------------------------------------------
-- Triggers: mantém referrals.clicks / referrals.leads_count agregados
-- ----------------------------------------------------------------------------
create or replace function bump_referral_clicks() returns trigger
language plpgsql security definer as $$
begin
  update referrals set clicks = clicks + 1 where referral_code = new.referral_code;
  return new;
end;
$$;

create trigger clicks_bump_referral
  after insert on clicks
  for each row execute function bump_referral_clicks();

create or replace function bump_referral_leads() returns trigger
language plpgsql security definer as $$
begin
  if new.referral_code is not null then
    update referrals set leads_count = leads_count + 1 where referral_code = new.referral_code;
  end if;
  return new;
end;
$$;

create trigger leads_bump_referral
  after insert on leads
  for each row execute function bump_referral_leads();

-- Permite ao visitante (anon) marcar que clicou para ir à loja, sem liberar
-- update geral da linha de lead (que fica restrito a marca/admin via RLS).
create or replace function mark_lead_clicked_store(p_lead_id uuid) returns void
language plpgsql security definer as $$
begin
  update leads set clicked_store = true where id = p_lead_id;
end;
$$;

grant execute on function mark_lead_clicked_store(uuid) to anon, authenticated;

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table profiles enable row level security;
alter table influencers enable row level security;
alter table brands enable row level security;
alter table campaigns enable row level security;
alter table brand_influencers enable row level security;
alter table campaign_influencers enable row level security;
alter table referrals enable row level security;
alter table leads enable row level security;
alter table clicks enable row level security;
alter table plans enable row level security;

-- helper: papel do usuário logado
create or replace function auth_account_type() returns text
language sql stable security definer as $$
  select account_type from profiles where user_id = auth.uid();
$$;

-- helper: id da linha influencers do usuário logado
create or replace function auth_influencer_id() returns uuid
language sql stable security definer as $$
  select id from influencers where user_id = auth.uid();
$$;

-- helper: id da linha brands do usuário logado
create or replace function auth_brand_id() returns uuid
language sql stable security definer as $$
  select id from brands where user_id = auth.uid();
$$;

-- profiles ---------------------------------------------------------------
create policy "profiles: read own or admin" on profiles for select
  using (user_id = auth.uid() or auth_account_type() = 'admin');
create policy "profiles: insert own" on profiles for insert
  with check (user_id = auth.uid());
create policy "profiles: update own or admin" on profiles for update
  using (user_id = auth.uid() or auth_account_type() = 'admin');

-- influencers --------------------------------------------------------------
create policy "influencers: public read active" on influencers for select
  using (is_active = true or user_id = auth.uid() or auth_account_type() = 'admin');
create policy "influencers: insert own" on influencers for insert
  with check (user_id = auth.uid());
create policy "influencers: update own or admin" on influencers for update
  using (user_id = auth.uid() or auth_account_type() = 'admin');

-- brands ---------------------------------------------------------------------
create policy "brands: public read active" on brands for select
  using (is_active = true or user_id = auth.uid() or auth_account_type() = 'admin');
create policy "brands: insert own" on brands for insert
  with check (user_id = auth.uid());
create policy "brands: update own or admin" on brands for update
  using (user_id = auth.uid() or auth_account_type() = 'admin');

-- campaigns --------------------------------------------------------------
create policy "campaigns: public read active" on campaigns for select
  using (status = 'active' or brand_id = auth_brand_id() or auth_account_type() = 'admin');
create policy "campaigns: brand manages own" on campaigns for insert
  with check (brand_id = auth_brand_id());
create policy "campaigns: brand updates own or admin" on campaigns for update
  using (brand_id = auth_brand_id() or auth_account_type() = 'admin');
create policy "campaigns: brand deletes own or admin" on campaigns for delete
  using (brand_id = auth_brand_id() or auth_account_type() = 'admin');

-- brand_influencers --------------------------------------------------------
create policy "brand_influencers: read own side or admin" on brand_influencers for select
  using (brand_id = auth_brand_id() or influencer_id = auth_influencer_id() or auth_account_type() = 'admin');
create policy "brand_influencers: brand inserts" on brand_influencers for insert
  with check (brand_id = auth_brand_id());
create policy "brand_influencers: brand updates or admin" on brand_influencers for update
  using (brand_id = auth_brand_id() or auth_account_type() = 'admin');

-- campaign_influencers -------------------------------------------------------
create policy "campaign_influencers: public read" on campaign_influencers for select
  using (true);
create policy "campaign_influencers: brand inserts for own campaign" on campaign_influencers for insert
  with check (exists (select 1 from campaigns c where c.id = campaign_id and c.brand_id = auth_brand_id()));
create policy "campaign_influencers: brand or admin updates" on campaign_influencers for update
  using (
    exists (select 1 from campaigns c where c.id = campaign_id and c.brand_id = auth_brand_id())
    or auth_account_type() = 'admin'
  );

-- referrals ------------------------------------------------------------------
create policy "referrals: public read" on referrals for select using (true);
create policy "referrals: brand or influencer or admin insert" on referrals for insert
  with check (
    influencer_id = auth_influencer_id()
    or auth_account_type() in ('admin', 'brand')
  );

-- leads ------------------------------------------------------------------
create policy "leads: public insert" on leads for insert with check (true);
create policy "leads: read scoped or admin" on leads for select
  using (brand_id = auth_brand_id() or influencer_id = auth_influencer_id() or auth_account_type() = 'admin');
create policy "leads: brand or admin update status" on leads for update
  using (brand_id = auth_brand_id() or auth_account_type() = 'admin');

-- clicks -----------------------------------------------------------------
create policy "clicks: public insert" on clicks for insert with check (true);
create policy "clicks: read scoped or admin" on clicks for select
  using (
    influencer_id = auth_influencer_id()
    or auth_account_type() = 'admin'
    or exists (select 1 from campaigns c where c.id = campaign_id and c.brand_id = auth_brand_id())
  );

-- plans ------------------------------------------------------------------
create policy "plans: public read" on plans for select using (true);

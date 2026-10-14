-- Ryfe inventory schema
-- Run this in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.sets (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  series text not null default 'Scarlet & Violet',
  code text,
  release_date date,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create type public.product_type as enum ('single', 'sealed', 'accessory');
create type public.product_status as enum ('in_stock', 'reserved', 'sold');

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  set_id uuid references public.sets(id) on delete set null,
  type public.product_type not null default 'single',
  status public.product_status not null default 'in_stock',
  name text not null,
  description text,
  image_url text,
  collector_number text,
  rarity text,
  condition text,
  quantity integer not null default 1,
  cost numeric(12,2) not null default 0,
  asking_price numeric(12,2) not null default 0,
  sold_price numeric(12,2),
  date_acquired date,
  date_sold date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_set_id_idx on public.products (set_id);
create index if not exists products_type_idx on public.products (type);
create index if not exists products_status_idx on public.products (status);
create index if not exists products_name_idx on public.products using gin (to_tsvector('simple', name));

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute procedure public.set_updated_at();

-- Public catalog view hides cost, sold price, and dates.
create or replace view public.catalog_products as
select
  p.id,
  p.set_id,
  p.type,
  p.status,
  p.name,
  p.description,
  p.image_url,
  p.collector_number,
  p.rarity,
  p.condition,
  p.quantity,
  p.asking_price,
  p.created_at,
  s.slug as set_slug,
  s.name as set_name,
  s.series as set_series
from public.products p
left join public.sets s on s.id = p.set_id
where p.status != 'sold';

alter table public.sets enable row level security;
alter table public.products enable row level security;

drop policy if exists "public can read sets" on public.sets;
create policy "public can read sets"
  on public.sets for select
  using (true);

-- Products table is not directly readable with the anon key.
-- The app uses the catalog view publicly and the service role for admin.

grant select on public.sets to anon, authenticated;
grant select on public.catalog_products to anon, authenticated;

insert into public.sets (slug, name, series, code, sort_order) values
  ('mega-evolution', 'Mega Evolution', 'Mega Evolution', 'MEG', 10),
  ('white-flare', 'White Flare', 'Scarlet & Violet', 'WHT', 20),
  ('black-bolt', 'Black Bolt', 'Scarlet & Violet', 'BLK', 30),
  ('destined-rivals', 'Destined Rivals', 'Scarlet & Violet', 'DRI', 40),
  ('journey-together', 'Journey Together', 'Scarlet & Violet', 'JTG', 50),
  ('prismatic-evolutions', 'Prismatic Evolutions', 'Scarlet & Violet', 'PRE', 60),
  ('surging-sparks', 'Surging Sparks', 'Scarlet & Violet', 'SSP', 70),
  ('stellar-crown', 'Stellar Crown', 'Scarlet & Violet', 'SCR', 80),
  ('shrouded-fable', 'Shrouded Fable', 'Scarlet & Violet', 'SFA', 90),
  ('twilight-masquerade', 'Twilight Masquerade', 'Scarlet & Violet', 'TWM', 100),
  ('temporal-forces', 'Temporal Forces', 'Scarlet & Violet', 'TEF', 110),
  ('paldean-fates', 'Paldean Fates', 'Scarlet & Violet', 'PAF', 120),
  ('paradox-rift', 'Paradox Rift', 'Scarlet & Violet', 'PAR', 130),
  ('151', '151', 'Scarlet & Violet', 'MEW', 140),
  ('obsidian-flames', 'Obsidian Flames', 'Scarlet & Violet', 'OBF', 150),
  ('paldea-evolved', 'Paldea Evolved', 'Scarlet & Violet', 'PAL', 160),
  ('scarlet-violet', 'Scarlet & Violet', 'Scarlet & Violet', 'SVI', 170),
  ('crown-zenith', 'Crown Zenith', 'Sword & Shield', 'CRZ', 200),
  ('silver-tempest', 'Silver Tempest', 'Sword & Shield', 'SIT', 210),
  ('lost-origin', 'Lost Origin', 'Sword & Shield', 'LOR', 220),
  ('pokemon-go', 'Pokémon GO', 'Sword & Shield', 'PGO', 230),
  ('astral-radiance', 'Astral Radiance', 'Sword & Shield', 'ASR', 240),
  ('brilliant-stars', 'Brilliant Stars', 'Sword & Shield', 'BRS', 250),
  ('fusion-strike', 'Fusion Strike', 'Sword & Shield', 'FST', 260),
  ('evolving-skies', 'Evolving Skies', 'Sword & Shield', 'EVS', 270),
  ('chilling-reign', 'Chilling Reign', 'Sword & Shield', 'CRE', 280),
  ('battle-styles', 'Battle Styles', 'Sword & Shield', 'BST', 290),
  ('shining-fates', 'Shining Fates', 'Sword & Shield', 'SHF', 300),
  ('vivid-voltage', 'Vivid Voltage', 'Sword & Shield', 'VIV', 310),
  ('champions-path', 'Champion''s Path', 'Sword & Shield', 'CPA', 320),
  ('darkness-ablaze', 'Darkness Ablaze', 'Sword & Shield', 'DAA', 330),
  ('rebel-clash', 'Rebel Clash', 'Sword & Shield', 'RCL', 340),
  ('sword-shield', 'Sword & Shield', 'Sword & Shield', 'SSH', 350),
  ('classic', 'Classic / Vintage', 'Vintage', null, 900),
  ('accessories', 'Accessories', 'Accessories', null, 980),
  ('uncategorized', 'Uncategorized', 'Other', null, 990)
on conflict (slug) do nothing;

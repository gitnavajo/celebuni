-- CelebUni MVP schema (Supabase Postgres)
-- Paste into Supabase SQL Editor or run as a migration.

-- Extensions commonly used in Supabase projects
create extension if not exists "pgcrypto";

-- Enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'celebrity_category') then
    create type public.celebrity_category as enum ('actor', 'voice_actor', 'musician');
  end if;
  if not exists (select 1 from pg_type where typname = 'appearance_type') then
    create type public.appearance_type as enum ('con', 'panel', 'photo_op');
  end if;
end $$;

-- Tables
create table if not exists public.celebrities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text,
  image_url text,
  tmdb_id integer unique,
  category public.celebrity_category not null,
  created_at timestamptz not null default now()
);

create table if not exists public.appearances (
  id uuid primary key default gen_random_uuid(),
  celebrity_id uuid not null references public.celebrities(id) on delete cascade,
  event_name text not null,
  event_date date,
  location text,
  type public.appearance_type not null,
  url text,
  created_at timestamptz not null default now()
);

create table if not exists public.fan_mail_addresses (
  id uuid primary key default gen_random_uuid(),
  celebrity_id uuid not null references public.celebrities(id) on delete cascade,
  address text not null,
  verified boolean not null default false,
  source text,
  last_updated timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text,
  published_at timestamptz,
  author text,
  created_at timestamptz not null default now()
);

-- Indexes for search + joins
create index if not exists celebrities_name_idx on public.celebrities using gin (to_tsvector('english', name));
create index if not exists celebrities_slug_idx on public.celebrities (slug);
create index if not exists appearances_celebrity_id_idx on public.appearances (celebrity_id);
create index if not exists fan_mail_addresses_celebrity_id_idx on public.fan_mail_addresses (celebrity_id);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc nulls last);

-- Row Level Security
alter table public.celebrities enable row level security;
alter table public.appearances enable row level security;
alter table public.fan_mail_addresses enable row level security;
alter table public.blog_posts enable row level security;

-- Public read access (anon + authenticated)
drop policy if exists "public read celebrities" on public.celebrities;
create policy "public read celebrities"
on public.celebrities
for select
to anon, authenticated
using (true);

drop policy if exists "public read appearances" on public.appearances;
create policy "public read appearances"
on public.appearances
for select
to anon, authenticated
using (true);

drop policy if exists "public read fan mail" on public.fan_mail_addresses;
create policy "public read fan mail"
on public.fan_mail_addresses
for select
to anon, authenticated
using (true);

drop policy if exists "public read blog posts" on public.blog_posts;
create policy "public read blog posts"
on public.blog_posts
for select
to anon, authenticated
using (true);

-- Writes are intentionally NOT allowed yet.
-- Later, add admin-only policies (e.g. using custom JWT claims) for insert/update/delete.


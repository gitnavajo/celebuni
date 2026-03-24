-- Add a simple "bio + link" field for clean MVP launch.

alter table public.celebrities
add column if not exists official_url text;

create index if not exists celebrities_official_url_idx on public.celebrities (official_url);


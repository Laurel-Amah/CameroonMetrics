-- Daily commodities snapshot (FMP cron; public read for Markets page)

create table if not exists public.commodities_daily_cache (
  id integer primary key default 1 check (id = 1),
  quotes jsonb not null,
  previous_quotes jsonb,
  fetched_at timestamptz not null default now()
);

alter table public.commodities_daily_cache enable row level security;

drop policy if exists "commodities_daily_cache_select_public" on public.commodities_daily_cache;
create policy "commodities_daily_cache_select_public"
  on public.commodities_daily_cache for select
  to anon, authenticated
  using (true);

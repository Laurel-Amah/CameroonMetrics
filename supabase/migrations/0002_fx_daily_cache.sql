-- Daily FX snapshot cache (filled by backend cron; public read for Markets page)

create table if not exists public.fx_daily_cache (
  id integer primary key default 1 check (id = 1),
  base_currency text not null,
  rate_date date not null,
  rates jsonb not null,
  previous_rates jsonb,
  fetched_at timestamptz not null default now()
);

alter table public.fx_daily_cache enable row level security;

drop policy if exists "fx_daily_cache_select_public" on public.fx_daily_cache;
create policy "fx_daily_cache_select_public"
  on public.fx_daily_cache for select
  to anon, authenticated
  using (true);

-- Writes use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS); no insert/update policies for anon.

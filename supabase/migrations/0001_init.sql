-- CameroonMetrics articles + storage (run in Supabase SQL editor or via CLI)

create extension if not exists "pgcrypto";

do $$ begin
  create type public.article_status as enum ('draft', 'published');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status public.article_status not null default 'draft',
  title text not null,
  category text not null,
  preview text not null,
  image_src text not null default '',
  what_happened text not null default '',
  why_it_matters text not null default '',
  investor_insight text not null default '',
  source_url text,
  source_name text,
  source_author text,
  source_published_at text,
  original_input text,
  suggested_image_url text,
  ai_model text,
  ai_generated_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);

create index if not exists articles_status_published_at_idx
  on public.articles (status, published_at desc nulls last);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  NEW.updated_at := now();
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

alter table public.articles enable row level security;

drop policy if exists "articles_select_published_anon" on public.articles;
create policy "articles_select_published_anon"
  on public.articles for select
  to anon
  using (status = 'published');

drop policy if exists "articles_select_all_authenticated" on public.articles;
create policy "articles_select_all_authenticated"
  on public.articles for select
  to authenticated
  using (true);

drop policy if exists "articles_insert_authenticated" on public.articles;
create policy "articles_insert_authenticated"
  on public.articles for insert
  to authenticated
  with check (true);

drop policy if exists "articles_update_authenticated" on public.articles;
create policy "articles_update_authenticated"
  on public.articles for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "articles_delete_authenticated" on public.articles;
create policy "articles_delete_authenticated"
  on public.articles for delete
  to authenticated
  using (true);

-- Storage bucket for editor-uploaded hero images
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;

drop policy if exists "article_images_public_read" on storage.objects;
create policy "article_images_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'article-images');

drop policy if exists "article_images_authenticated_upload" on storage.objects;
create policy "article_images_authenticated_upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'article-images');

drop policy if exists "article_images_authenticated_update" on storage.objects;
create policy "article_images_authenticated_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'article-images');

drop policy if exists "article_images_authenticated_delete" on storage.objects;
create policy "article_images_authenticated_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'article-images');

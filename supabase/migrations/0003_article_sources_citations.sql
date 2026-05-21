-- Multiple sources + free-form citations on articles

alter table public.articles
  add column if not exists sources jsonb not null default '[]'::jsonb;

alter table public.articles
  add column if not exists citations text;

-- Backfill legacy single-source columns into sources[0]
update public.articles
set sources = jsonb_build_array(
  jsonb_strip_nulls(
    jsonb_build_object(
      'url', source_url,
      'name', source_name,
      'author', source_author,
      'publishedAt', source_published_at
    )
  )
)
where sources = '[]'::jsonb
  and (
    source_url is not null
    or source_name is not null
    or source_author is not null
    or source_published_at is not null
  );

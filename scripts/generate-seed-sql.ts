import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { editorialSeedArticles } from "../src/data/mock-articles";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function dollar(tag: string, str: string) {
  return `$${tag}$${str}$${tag}$`;
}

const lines: string[] = [
  "-- CameroonMetrics seed data",
  "--",
  "-- Run order (Supabase SQL editor):",
  "--   1) Paste and run: supabase/migrations/0001_init.sql  (creates public.articles, RLS, storage bucket)",
  "--   2) Paste and run: this file (seed.sql)",
  "--",
  "do $$",
  "begin",
  "  if not exists (",
  "    select 1",
  "    from information_schema.tables",
  "    where table_schema = 'public'",
  "      and table_name = 'articles'",
  "  ) then",
  "    raise exception 'public.articles does not exist. Run supabase/migrations/0001_init.sql first, then run seed.sql again.';",
  "  end if;",
  "end $$;",
  "",
  "delete from public.articles where slug in ('cmr-cocoa-export-2026','ceeac-harmonization','douala-port-throughput','solar-ppa-yaounde','bank-npl-trend','fintech-remittance');",
  "",
];

editorialSeedArticles.forEach((a, i) => {
  const tag = `s${i}`;
  lines.push(`insert into public.articles (`);
  lines.push(
    `  slug, status, title, category, preview, image_src, what_happened, why_it_matters, investor_insight, published_at`,
  );
  lines.push(`) values (`);
  lines.push(`  '${a.id.replace(/'/g, "''")}',`);
  lines.push(`  'published',`);
  lines.push(`  ${dollar(`${tag}t`, a.title)},`);
  lines.push(`  '${a.category.replace(/'/g, "''")}',`);
  lines.push(`  ${dollar(`${tag}p`, a.preview)},`);
  lines.push(`  '${a.imageSrc.replace(/'/g, "''")}',`);
  lines.push(`  ${dollar(`${tag}w`, a.whatHappened)},`);
  lines.push(`  ${dollar(`${tag}y`, a.whyItMatters)},`);
  lines.push(`  ${dollar(`${tag}i`, a.investorInsight)},`);
  lines.push(`  '${a.publishedAt}T12:00:00Z'::timestamptz`);
  lines.push(`);`);
  lines.push("");
});

writeFileSync(join(root, "supabase", "seed.sql"), lines.join("\n"), "utf8");
console.log("Wrote supabase/seed.sql");

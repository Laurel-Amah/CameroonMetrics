import type { Article, ArticlePreview, ArticleSource } from "@/types/article";
import type { ArticleCategory } from "@/types/article";

export type ArticleRow = {
  id: string;
  slug: string;
  status: "draft" | "published";
  title: string;
  category: string;
  preview: string;
  image_src: string;
  what_happened: string;
  why_it_matters: string;
  investor_insight: string;
  source_url: string | null;
  source_name: string | null;
  source_author: string | null;
  source_published_at: string | null;
  original_input: string | null;
  suggested_image_url: string | null;
  ai_model: string | null;
  ai_generated_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

function rowSource(row: ArticleRow): ArticleSource | undefined {
  const s: ArticleSource = {};
  if (row.source_url) s.url = row.source_url;
  if (row.source_name) s.name = row.source_name;
  if (row.source_author) s.author = row.source_author;
  if (row.source_published_at) s.publishedAt = row.source_published_at;
  if (!s.url && !s.name && !s.author && !s.publishedAt) return undefined;
  return s;
}

function publishedDateOnly(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function rowToArticlePreview(row: ArticleRow): ArticlePreview {
  return {
    id: row.slug,
    title: row.title,
    category: row.category as ArticleCategory,
    publishedAt: publishedDateOnly(row.published_at),
    preview: row.preview,
    imageSrc: row.image_src,
    source: rowSource(row),
  };
}

export function rowToArticle(row: ArticleRow): Article {
  const preview = rowToArticlePreview(row);
  return {
    ...preview,
    whatHappened: row.what_happened,
    whyItMatters: row.why_it_matters,
    investorInsight: row.investor_insight,
  };
}

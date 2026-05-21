import {
  primarySource,
  sourcesFromRow,
} from "@/lib/article-sources";
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
  sources: unknown;
  citations: string | null;
  original_input: string | null;
  suggested_image_url: string | null;
  ai_model: string | null;
  ai_generated_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

function rowSources(row: ArticleRow): ArticleSource[] {
  return sourcesFromRow(row);
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
    source: primarySource(rowSources(row)),
  };
}

export function rowToArticle(row: ArticleRow): Article {
  const preview = rowToArticlePreview(row);
  const sources = rowSources(row);
  return {
    ...preview,
    whatHappened: row.what_happened,
    whyItMatters: row.why_it_matters,
    investorInsight: row.investor_insight,
    sources: sources.length > 0 ? sources : undefined,
    citations: row.citations?.trim() || undefined,
  };
}

import type { ArticlePreview } from "@/types/article";

export function sortArticlesByDateDesc(
  articles: ArticlePreview[],
): ArticlePreview[] {
  return [...articles].sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt),
  );
}

export function pickFeaturedArticle(
  articles: ArticlePreview[],
): ArticlePreview | undefined {
  const sorted = sortArticlesByDateDesc(articles);
  return sorted[0];
}

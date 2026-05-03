import type { ArticleCategory, ArticlePreview } from "@/types/article";

/** Category chips on the home Market Wire (fixed order; not derived from data). */
export const HOME_WIRE_CATEGORIES: ArticleCategory[] = [
  "Banking",
  "Energy",
  "Markets",
  "Policy",
  "Tech",
  "Trade",
];

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

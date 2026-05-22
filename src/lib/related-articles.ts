import type { ArticlePreview } from "@/types/article";

const DEFAULT_LIMIT = 3;

function byNewest(a: ArticlePreview, b: ArticlePreview): number {
  return (
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Prefer same-category stories, then fill with other recent published articles.
 */
export function pickRelatedArticles(
  current: Pick<ArticlePreview, "id" | "category">,
  pool: ArticlePreview[],
  limit = DEFAULT_LIMIT,
): ArticlePreview[] {
  const others = pool.filter((a) => a.id !== current.id);
  if (others.length === 0) return [];

  const sameCategory = others
    .filter((a) => a.category === current.category)
    .sort(byNewest);
  const otherCategories = others
    .filter((a) => a.category !== current.category)
    .sort(byNewest);

  return [...sameCategory, ...otherCategories].slice(0, limit);
}

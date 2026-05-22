/** Canonical article categories — keep in sync with admin, AI schema, and styles. */
export const ARTICLE_CATEGORIES = [
  "Policy",
  "Entrepreneurship",
  "Real Estate",
  "Banking",
  "Agriculture",
  "Trade",
  "Markets",
  "Energy",
  "Tech",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

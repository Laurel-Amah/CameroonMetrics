export type ArticleCategory =
  | "Markets"
  | "Policy"
  | "Energy"
  | "Banking"
  | "Trade"
  | "Tech";

/** Original reporting / syndication credits (optional for desk originals). */
export type ArticleSource = {
  url?: string;
  name?: string;
  author?: string;
  publishedAt?: string;
};

/** Card / list fields */
export type ArticlePreview = {
  /** Public URL segment (matches DB `slug`). */
  id: string;
  title: string;
  category: ArticleCategory;
  publishedAt: string;
  preview: string;
  /** Path under `public/`, e.g. `/images/articles/trade-cocoa.svg` */
  imageSrc: string;
  source?: ArticleSource;
};

/** Full article for detail view (mock-backed) */
export type Article = ArticlePreview & {
  whatHappened: string;
  whyItMatters: string;
  investorInsight: string;
};

import { ArticleCard } from "@/components/home/ArticleCard";
import type { ArticlePreview } from "@/types/article";

type Props = {
  articles: ArticlePreview[];
  category: ArticlePreview["category"];
};

export function RelatedArticles({ articles, category }: Props) {
  if (articles.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="rounded-2xl border border-line bg-surface/90 p-6 shadow-card ring-1 ring-brand/10 sm:p-8"
    >
      <h2
        id="related-heading"
        className="font-serif text-xl font-semibold tracking-tight text-ink sm:text-2xl"
      >
        Related coverage
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        More in <span className="font-semibold text-ink">{category}</span> and
        recent desk briefings.
      </p>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <li key={article.id} className="min-h-0">
            <ArticleCard article={article} variant="compact" />
          </li>
        ))}
      </ul>
    </section>
  );
}

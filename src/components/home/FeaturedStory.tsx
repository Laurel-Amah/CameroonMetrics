import Link from "next/link";
import type { ArticlePreview } from "@/types/article";
import { ArticleCardImage } from "@/components/home/ArticleCardImage";
import { ArticleSourceVia } from "@/components/home/ArticleSourceVia";
import {
  categoryTagClass,
  categoryStripeBgClass,
  categoryTopBorderClass,
} from "@/lib/category-styles";
import { formatArticleDate, formatRelativeArticleDate } from "@/lib/format-date";

type Props = {
  article: ArticlePreview;
};

export function FeaturedStory({ article }: Props) {
  const tagClass = categoryTagClass[article.category];
  const topBorder = categoryTopBorderClass[article.category];
  const stripeBg = categoryStripeBgClass[article.category];
  const absolute = formatArticleDate(article.publishedAt);
  const relative = formatRelativeArticleDate(article.publishedAt);

  return (
    <section aria-labelledby="featured-heading" className="mb-14 sm:mb-16">
      <div className="mb-6 flex flex-col gap-2 border-b border-brand/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-ink-subtle">
            Desk
          </p>
          <h2
            id="featured-heading"
            className="mt-2 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Featured story
          </h2>
        </div>
        <p className="max-w-md text-[13px] leading-relaxed text-ink-muted sm:text-right sm:text-sm">
          Desk pick from the latest publish window—sourced reporting with full
          credits on each briefing.
        </p>
      </div>

      <Link
        href={`/article/${article.id}`}
        className="group block rounded-2xl outline-none ring-offset-2 ring-offset-surface-soft transition-[transform,box-shadow] duration-300 ease-refined focus-visible:ring-2 focus-visible:ring-brand"
      >
        <article
          className={`relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface-card shadow-panel ring-1 ring-line/70 transition-all duration-300 ease-refined will-change-transform group-hover:-translate-y-0.5 group-hover:border-brand/20 group-hover:shadow-card-hover lg:flex-row lg:items-stretch border-t-[3px] lg:border-t-0 ${topBorder}`}
        >
          <div
            className={`hidden w-1 shrink-0 lg:block ${stripeBg}`}
            aria-hidden
          />
          <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-surface-soft sm:aspect-[2.1/1] lg:order-2 lg:aspect-auto lg:h-auto lg:min-h-[280px] lg:w-[44%]">
              <ArticleCardImage
                src={article.imageSrc}
                alt=""
                fill
                priority
                className="object-cover transition duration-500 ease-refined group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8 lg:order-1 lg:max-w-[min(56%,32rem)] lg:justify-center lg:py-10 lg:pl-10 lg:pr-8">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] sm:text-xs">
                <span
                  className={`rounded px-2 py-0.5 font-semibold uppercase tracking-wide ${tagClass}`}
                >
                  {article.category}
                </span>
                <time
                  dateTime={article.publishedAt}
                  className="text-ink-subtle"
                  title={absolute}
                >
                  {relative}
                </time>
              </div>
              <h2 className="mt-5 font-serif text-2xl font-semibold leading-tight tracking-tight text-ink transition-colors duration-200 group-hover:text-brand sm:text-[1.65rem] sm:leading-snug lg:text-[1.85rem]">
                {article.title}
              </h2>
              <ArticleSourceVia source={article.source} className="mt-2" />
              <p className="mt-4 text-[0.98rem] leading-relaxed text-ink-muted sm:text-base sm:leading-relaxed">
                {article.preview}
              </p>
              <span className="mt-6 inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-brand transition-colors duration-200 group-hover:text-brand-muted">
                Read full analysis
                <span
                  className="ml-1.5 translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                >
                  →
                </span>
              </span>
            </div>
          </div>
        </article>
      </Link>
    </section>
  );
}

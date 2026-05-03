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

export type ArticleCardVariant = "lead" | "standard" | "compact";

type Props = {
  article: ArticlePreview;
  variant?: ArticleCardVariant;
};

export function ArticleCard({
  article,
  variant = "standard",
}: Props) {
  const tagClass = categoryTagClass[article.category];
  const topBorder = categoryTopBorderClass[article.category];
  const stripeBg = categoryStripeBgClass[article.category];
  const relative = formatRelativeArticleDate(article.publishedAt);
  const absolute = formatArticleDate(article.publishedAt);
  const imgAlt = "";

  const metaRow = (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] sm:text-xs">
      <span
        className={`rounded px-2 py-0.5 font-semibold uppercase tracking-wide ${tagClass}`}
      >
        {article.category}
      </span>
      <time dateTime={article.publishedAt} className="text-ink-subtle" title={absolute}>
        {relative}
      </time>
    </div>
  );

  if (variant === "lead") {
    return (
      <Link
        href={`/article/${article.id}`}
        className="group block h-full rounded-2xl outline-none ring-offset-2 ring-offset-surface-soft transition-[color,transform,box-shadow] duration-300 ease-refined focus-visible:ring-2 focus-visible:ring-brand"
      >
        <article
          className={`relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface-card shadow-card ring-1 ring-line/70 transition-all duration-300 ease-refined will-change-transform group-hover:-translate-y-0.5 group-hover:border-brand/20 group-hover:shadow-card-hover lg:flex-row lg:items-stretch lg:gap-0 lg:p-0 border-t-[3px] lg:border-t-0 ${topBorder}`}
        >
          <div className={`hidden w-1 shrink-0 lg:block ${stripeBg}`} aria-hidden />
          <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-surface-soft sm:aspect-[2.15/1] lg:order-3 lg:aspect-auto lg:h-auto lg:min-h-[260px] lg:w-[40%]">
              <ArticleCardImage
                src={article.imageSrc}
                alt={imgAlt}
                fill
                priority
                className="object-cover transition duration-500 ease-refined group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-1 flex-col p-5 sm:p-6 lg:order-1 lg:w-[min(52%,28rem)] lg:shrink-0 lg:justify-center lg:py-8 lg:pl-8 lg:pr-6">
              {metaRow}
              <h2 className="mt-4 font-serif text-xl font-semibold leading-snug tracking-tight text-ink transition-colors duration-200 group-hover:text-brand sm:text-2xl sm:leading-snug lg:text-[1.65rem] lg:leading-tight">
                {article.title}
              </h2>
              <ArticleSourceVia source={article.source} className="mt-2" />
            </div>
            <div className="flex flex-1 flex-col border-t border-line p-5 pt-4 sm:p-6 sm:pt-5 lg:order-2 lg:border-l lg:border-t-0 lg:justify-center lg:py-8 lg:pl-8 lg:pr-8">
              <p className="line-clamp-4 text-sm leading-relaxed text-ink-muted lg:line-clamp-none lg:text-[0.95rem] lg:leading-relaxed">
                {article.preview}
              </p>
              <span className="mt-5 inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-brand transition-colors duration-200 group-hover:text-brand-muted lg:mt-auto">
                Full story
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
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/article/${article.id}`}
        className="group block h-full rounded-2xl outline-none ring-offset-2 ring-offset-surface-soft transition-[color,transform,box-shadow] duration-300 ease-refined focus-visible:ring-2 focus-visible:ring-brand"
      >
        <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface-card shadow-card ring-1 ring-line/70 transition-all duration-300 ease-refined group-hover:border-brand/20 group-hover:shadow-card-hover">
          <div className={`h-1 w-full shrink-0 ${stripeBg}`} aria-hidden />
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-line bg-surface-soft">
            <ArticleCardImage
              src={article.imageSrc}
              alt={imgAlt}
              fill
              className="object-cover transition duration-500 ease-refined group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex flex-1 flex-col p-4">
            {metaRow}
            <h2 className="mt-2.5 font-serif text-base font-semibold leading-snug tracking-tight text-ink transition-colors duration-200 group-hover:text-brand">
              {article.title}
            </h2>
            <ArticleSourceVia source={article.source} className="mt-1.5" />
            <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-relaxed text-ink-muted">
              {article.preview}
            </p>
            <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
              Read Briefing →
            </span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link
      href={`/article/${article.id}`}
      className="group block h-full rounded-2xl outline-none ring-offset-2 ring-offset-surface-soft transition-[color,transform,box-shadow] duration-300 ease-refined focus-visible:ring-2 focus-visible:ring-brand"
    >
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface-card shadow-card ring-1 ring-line/70 transition-all duration-300 ease-refined will-change-transform group-hover:-translate-y-1 group-hover:border-brand/20 group-hover:shadow-card-hover">
        <div className={`h-1 w-full shrink-0 ${stripeBg}`} aria-hidden />
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-line bg-surface-soft">
          <ArticleCardImage
            src={article.imageSrc}
            alt={imgAlt}
            fill
            className="object-cover transition duration-500 ease-refined group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          {metaRow}
          <h2 className="mt-3 font-serif text-lg font-semibold leading-snug tracking-tight text-ink transition-colors duration-200 group-hover:text-brand sm:text-[1.125rem] sm:leading-snug">
            {article.title}
          </h2>
          <ArticleSourceVia source={article.source} className="mt-2" />
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-muted">
            {article.preview}
          </p>
          <span className="mt-5 inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-brand transition-colors duration-200 group-hover:text-brand-muted">
            Read briefing
            <span
              className="ml-1.5 translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </span>
        </div>
      </article>
    </Link>
  );
}

import Link from "next/link";
import { ArticleCardImage } from "@/components/home/ArticleCardImage";
import { ArticleSourceVia } from "@/components/home/ArticleSourceVia";
import { categoryStripeBgClass, categoryTagClass } from "@/lib/category-styles";
import { formatArticleDate, formatRelativeArticleDate } from "@/lib/format-date";
import type { ArticlePreview } from "@/types/article";

function wireIndex(n: number): string {
  return String(n).padStart(2, "0");
}

type SharedProps = {
  article: ArticlePreview;
  index: number;
};

export function WireStoryLead({ article, index }: SharedProps) {
  const tagClass = categoryTagClass[article.category];
  const stripeBg = categoryStripeBgClass[article.category];
  const absolute = formatArticleDate(article.publishedAt);
  const relative = formatRelativeArticleDate(article.publishedAt);

  return (
    <li>
      <Link
        href={`/article/${article.id}`}
        className="group block rounded-2xl outline-none ring-offset-2 ring-offset-surface focus-visible:ring-2 focus-visible:ring-brand"
      >
        <article className="relative overflow-hidden rounded-2xl border border-line/90 bg-surface-card shadow-card ring-1 ring-line/60 transition-all duration-300 ease-refined group-hover:border-brand/25 group-hover:shadow-card-hover">
          <div
            className={`absolute inset-x-0 top-0 h-[3px] ${stripeBg}`}
            aria-hidden
          />
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[4.5rem_minmax(0,1fr)] lg:gap-8 lg:p-8">
            <div className="flex items-start gap-4 lg:flex-col lg:items-start lg:gap-3">
              <span
                className="font-mono text-[2rem] font-medium leading-none tracking-tight text-brand/20 transition-colors duration-300 group-hover:text-brand/35 sm:text-[2.35rem]"
                aria-hidden
              >
                {wireIndex(index)}
              </span>
              <span className="hidden h-px w-8 bg-line lg:block" aria-hidden />
            </div>

            <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
              <div className="flex min-w-0 flex-col justify-center">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${tagClass}`}
                  >
                    {article.category}
                  </span>
                  <span className="text-ink-subtle" aria-hidden>
                    ·
                  </span>
                  <time
                    dateTime={article.publishedAt}
                    className="text-[11px] font-medium tabular-nums text-ink-subtle"
                    title={absolute}
                  >
                    {relative}
                  </time>
                </div>
                <h3 className="mt-3 font-serif text-xl font-semibold leading-snug tracking-tight text-ink transition-colors duration-200 group-hover:text-brand sm:text-2xl lg:text-[1.65rem] lg:leading-tight">
                  {article.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-muted sm:text-[0.95rem]">
                  {article.preview}
                </p>
                <ArticleSourceVia source={article.source} className="mt-3" />
                <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                  Read briefing
                  <span
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    →
                  </span>
                </span>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line/80 bg-surface-soft lg:aspect-[5/4]">
                <ArticleCardImage
                  src={article.imageSrc}
                  alt=""
                  fill
                  priority={index === 1}
                  className="object-cover transition duration-500 ease-refined group-hover:scale-[1.02]"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </li>
  );
}

export function WireStoryItem({ article, index }: SharedProps) {
  const tagClass = categoryTagClass[article.category];
  const stripeBg = categoryStripeBgClass[article.category];
  const absolute = formatArticleDate(article.publishedAt);
  const relative = formatRelativeArticleDate(article.publishedAt);

  return (
    <li>
      <Link
        href={`/article/${article.id}`}
        className="group block rounded-xl outline-none ring-offset-2 ring-offset-surface focus-visible:ring-2 focus-visible:ring-brand"
      >
        <article className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 rounded-xl border border-transparent px-1 py-5 transition-all duration-300 ease-refined sm:grid-cols-[3rem_5.5rem_minmax(0,1fr)] sm:gap-5 sm:py-6 group-hover:border-line/80 group-hover:bg-surface-card/80 sm:px-3">
          <div className="flex flex-col items-start pt-0.5">
            <span
              className="font-mono text-sm font-medium tabular-nums tracking-tight text-brand/25 transition-colors duration-300 group-hover:text-brand/45 sm:text-base"
              aria-hidden
            >
              {wireIndex(index)}
            </span>
            <div
              className={`mt-3 hidden h-full min-h-[3rem] w-px sm:block ${stripeBg} opacity-40`}
              aria-hidden
            />
          </div>

          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-lg border border-line/70 bg-surface-soft sm:block">
            <ArticleCardImage
              src={article.imageSrc}
              alt=""
              fill
              className="object-cover transition duration-500 ease-refined group-hover:scale-[1.03]"
            />
          </div>

          <div className="min-w-0 border-l border-transparent pl-0 sm:border-l-0 sm:pl-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${tagClass}`}
              >
                {article.category}
              </span>
              <time
                dateTime={article.publishedAt}
                className="text-[10px] font-medium tabular-nums text-ink-subtle"
                title={absolute}
              >
                {relative}
              </time>
            </div>
            <h3 className="mt-2 font-serif text-base font-semibold leading-snug tracking-tight text-ink transition-colors duration-200 group-hover:text-brand sm:text-lg">
              {article.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-muted">
              {article.preview}
            </p>
          </div>
        </article>
      </Link>
    </li>
  );
}

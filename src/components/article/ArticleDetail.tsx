import Image from "next/image";
import type { Article, ArticlePreview } from "@/types/article";
import { ArticleBackLink } from "@/components/article/ArticleBackLink";
import { ArticleCredits } from "@/components/article/ArticleCredits";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { ArticleImageCredit } from "@/components/article/ArticleImageCredit";
import { ARTICLE_SECTION_LABELS } from "@/lib/article-sections";
import { categoryTagClass } from "@/lib/category-styles";
import { formatArticleDate, formatRelativeArticleDate } from "@/lib/format-date";

type Props = {
  article: Article;
  related?: ArticlePreview[];
};

function Section({
  kicker,
  children,
}: {
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-surface/90 p-6 shadow-card ring-1 ring-brand/10 sm:p-8">
      <h2 className="border-b border-brand/15 pb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
        {kicker}
      </h2>
      <div className="mt-6 max-w-none text-[1.05rem] font-normal leading-[1.72] text-ink sm:text-lg sm:leading-[1.75]">
        {children}
      </div>
    </section>
  );
}

export function ArticleDetail({ article, related = [] }: Props) {
  const tagClass = categoryTagClass[article.category];
  const absolute = formatArticleDate(article.publishedAt);
  const relative = formatRelativeArticleDate(article.publishedAt);

  return (
    <article className="border-b border-brand/15 bg-surface-soft/50">
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-9 sm:px-6 sm:pb-28 sm:pt-11 lg:max-w-[46rem] lg:px-8 lg:pb-32 lg:pt-14">
        <ArticleBackLink />

        <header className="mt-9 border-b border-line pb-10 sm:mt-11 sm:pb-12">
          <h1 className="max-w-[20ch] font-serif text-[1.95rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:max-w-none sm:text-[2.4rem] sm:leading-[1.08] lg:text-[2.6rem]">
            {article.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-3 gap-y-2">
            <span
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] shadow-sm ${tagClass}`}
            >
              {article.category}
            </span>
            <span className="hidden h-3 w-px bg-line sm:block" aria-hidden />
            <time
              dateTime={article.publishedAt}
              className="text-sm font-medium tabular-nums tracking-wide text-ink-muted"
              title={absolute}
            >
              {absolute}
              <span className="font-normal text-ink-subtle"> · </span>
              {relative}
            </time>
          </div>
          <p className="mt-8 max-w-2xl text-lg font-normal leading-[1.65] text-ink-muted sm:text-xl sm:leading-relaxed">
            {article.preview}
          </p>
        </header>

        {article.imageSrc ? (
          <figure className="mt-10 sm:mt-11">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-line bg-surface shadow-card sm:aspect-[2.05/1]">
              <Image
                src={article.imageSrc}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 46rem"
                priority
                unoptimized
              />
            </div>
            <ArticleImageCredit imageSrc={article.imageSrc} source={article.source} />
          </figure>
        ) : null}

        <div className="mt-12 space-y-6 sm:mt-14 sm:space-y-7">
          <Section kicker={ARTICLE_SECTION_LABELS.whatHappened}>
            <p className="text-pretty text-ink">{article.whatHappened}</p>
          </Section>
          <Section kicker={ARTICLE_SECTION_LABELS.whyItMatters}>
            <p className="text-pretty text-ink">{article.whyItMatters}</p>
          </Section>
          <Section kicker={ARTICLE_SECTION_LABELS.investorInsight}>
            <p className="text-pretty text-ink">{article.investorInsight}</p>
          </Section>
        </div>

        <div className="mt-12 sm:mt-14">
          <ArticleCredits
            sources={article.sources}
            source={article.source}
            citations={article.citations}
          />
        </div>

        {related.length > 0 ? (
          <div className="mt-12 sm:mt-14">
            <RelatedArticles articles={related} category={article.category} />
          </div>
        ) : null}

        <footer className="mt-14 border-t border-line pt-10 sm:mt-16 sm:pt-12">
          <ArticleBackLink />
        </footer>
      </div>
    </article>
  );
}

import type { ArticleSource } from "@/types/article";
import { formatArticleDate } from "@/lib/format-date";

function hasCredits(s?: ArticleSource) {
  if (!s) return false;
  return !!(s.url?.trim() || s.name?.trim() || s.author?.trim() || s.publishedAt?.trim());
}

type Props = {
  source?: ArticleSource;
};

export function ArticleCredits({ source }: Props) {
  if (!hasCredits(source)) return null;

  const dateLabel =
    source?.publishedAt && source.publishedAt.length >= 8
      ? formatArticleDate(source.publishedAt)
      : source?.publishedAt?.trim() || null;

  return (
    <section
      className="rounded-xl border border-line bg-surface/90 p-6 shadow-card ring-1 ring-brand/5 sm:p-8"
      aria-labelledby="credits-heading"
    >
      <h2
        id="credits-heading"
        className="border-b border-line pb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-subtle"
      >
        Source and credits
      </h2>
      <dl className="mt-6 space-y-4 text-sm leading-relaxed text-ink">
        {source?.name?.trim() ? (
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Publication
            </dt>
            <dd className="mt-1">{source.name.trim()}</dd>
          </div>
        ) : null}
        {source?.author?.trim() ? (
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Author
            </dt>
            <dd className="mt-1">{source.author.trim()}</dd>
          </div>
        ) : null}
        {dateLabel ? (
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Original date
            </dt>
            <dd className="mt-1">{dateLabel}</dd>
          </div>
        ) : null}
        {source?.url?.trim() ? (
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Original story
            </dt>
            <dd className="mt-1 break-all">
              <a
                href={source.url.trim()}
                className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition-colors hover:text-brand-muted"
                rel="noopener noreferrer"
                target="_blank"
              >
                {source.url.trim()}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-6 text-xs leading-relaxed text-ink-subtle">
        CameroonMetrics analysis is original synthesis. Facts attributed to the
        source above; interpretation is the desk&apos;s own.
      </p>
    </section>
  );
}

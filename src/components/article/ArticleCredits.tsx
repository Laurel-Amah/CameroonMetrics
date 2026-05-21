import type { ArticleSource } from "@/types/article";
import { hasSourceContent } from "@/lib/article-sources";
import { formatArticleDate } from "@/lib/format-date";

type Props = {
  source?: ArticleSource;
  sources?: ArticleSource[];
  citations?: string;
};

function SourceBlock({
  source,
  index,
  total,
}: {
  source: ArticleSource;
  index: number;
  total: number;
}) {
  const dateLabel =
    source.publishedAt && source.publishedAt.length >= 8
      ? formatArticleDate(source.publishedAt)
      : source.publishedAt?.trim() || null;

  return (
    <div
      className={
        total > 1 ? "border-t border-line pt-6 first:border-0 first:pt-0" : ""
      }
    >
      {total > 1 ? (
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Source {index + 1}
        </p>
      ) : null}
      <dl className="space-y-4 text-sm leading-relaxed text-ink">
        {source.name?.trim() ? (
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Publication
            </dt>
            <dd className="mt-1">{source.name.trim()}</dd>
          </div>
        ) : null}
        {source.author?.trim() ? (
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
        {source.url?.trim() ? (
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
    </div>
  );
}

export function ArticleCredits({ source, sources, citations }: Props) {
  const list =
    sources && sources.length > 0
      ? sources.filter(hasSourceContent)
      : source && hasSourceContent(source)
        ? [source]
        : [];

  const citationsText = citations?.trim();
  if (list.length === 0 && !citationsText) return null;

  return (
    <section
      className="rounded-xl border border-line bg-surface/90 p-6 shadow-card ring-1 ring-brand/5 sm:p-8"
      aria-labelledby="credits-heading"
    >
      <h2
        id="credits-heading"
        className="border-b border-line pb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-subtle"
      >
        Sources and credits
      </h2>

      {list.length > 0 ? (
        <div className="mt-6 space-y-6">
          {list.map((s, i) => (
            <SourceBlock key={i} source={s} index={i} total={list.length} />
          ))}
        </div>
      ) : null}

      {citationsText ? (
        <div className={list.length > 0 ? "mt-8 border-t border-line pt-6" : "mt-6"}>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Citations
          </h3>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">
            {citationsText}
          </p>
        </div>
      ) : null}

      <p className="mt-6 text-xs leading-relaxed text-ink-subtle">
        CameroonMetrics analysis is original synthesis. Facts attributed to sources
        above; interpretation is the desk&apos;s own.
      </p>
    </section>
  );
}

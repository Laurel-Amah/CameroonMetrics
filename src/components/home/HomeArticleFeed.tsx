import { WireStoryItem, WireStoryLead } from "@/components/home/WireStoryCard";
import type { ArticlePreview } from "@/types/article";

type Props = {
  articles: ArticlePreview[];
  /** Omit IDs from the wire (e.g. the home featured story). */
  excludeArticleIds?: string[];
};

export function HomeArticleFeed({
  articles,
  excludeArticleIds = [],
}: Props) {
  const exclude = new Set(excludeArticleIds);
  const visible = articles.filter((a) => !exclude.has(a.id));

  if (visible.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line/90 bg-surface-soft/60 px-6 py-14 text-center text-sm leading-relaxed text-ink-muted">
        No stories on the wire yet.
      </p>
    );
  }

  const [lead, ...rest] = visible;

  return (
    <div className="space-y-0">
      <ul className="space-y-6 sm:space-y-8">
        <WireStoryLead article={lead} index={1} />
      </ul>

      {rest.length > 0 ? (
        <div className="mt-8 border-t border-line/70 pt-2 sm:mt-10">
          <p className="mb-1 px-1 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-ink-subtle/90">
            On the wire
          </p>
          <ul className="divide-y divide-line/60">
            {rest.map((article, i) => (
              <WireStoryItem key={article.id} article={article} index={i + 2} />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

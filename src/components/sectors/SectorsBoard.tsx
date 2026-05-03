import { ArticleCard } from "@/components/home/ArticleCard";
import {
  articlesForSector,
  SECTOR_DEFINITIONS,
} from "@/data/sector-definitions";
import type { ArticlePreview } from "@/types/article";

type Props = {
  articles: ArticlePreview[];
};

export function SectorsBoard({ articles }: Props) {
  return (
    <div className="space-y-14 sm:space-y-16">
      {SECTOR_DEFINITIONS.map((sector) => {
        const list = articlesForSector(sector, articles).slice(0, 3);
        return (
          <section
            key={sector.id}
            id={sector.id}
            aria-labelledby={`${sector.id}-heading`}
            className="scroll-mt-28"
          >
            <div className="border-b border-brand/15 pb-5">
              <h2
                id={`${sector.id}-heading`}
                className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
              >
                {sector.label}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
                {sector.blurb}
              </p>
            </div>
            {list.length === 0 ? (
              <p className="mt-8 rounded-xl border border-dashed border-brand/25 bg-brand-soft/40 px-5 py-10 text-center text-sm text-ink-muted">
                No mock stories mapped to this sector yet.
              </p>
            ) : (
              <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3">
                {list.map((article) => (
                  <li key={article.id}>
                    <ArticleCard article={article} variant="compact" />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

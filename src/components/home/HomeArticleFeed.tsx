"use client";

import { useMemo, useState } from "react";
import { ArticleCard, type ArticleCardVariant } from "@/components/home/ArticleCard";
import { categoryDotClass } from "@/lib/category-styles";
import { HOME_WIRE_CATEGORIES } from "@/lib/home-feed";
import type { ArticleCategory, ArticlePreview } from "@/types/article";

type Props = {
  articles: ArticlePreview[];
  /** Omit IDs from the wire (e.g. the home featured story). */
  excludeArticleIds?: string[];
};

const ALL = "All" as const;
type FilterValue = typeof ALL | ArticleCategory;

function resolveVariant(index: number, total: number): ArticleCardVariant {
  if (total >= 3 && index === 0) return "lead";
  if (total > 3 && index > 0 && index % 3 === 0) return "compact";
  return "standard";
}

/** Column span in the 12-column grid for balanced rows after the lead story */
function gridColumnClass(
  index: number,
  total: number,
  variant: ArticleCardVariant,
): string {
  if (variant === "lead") return "lg:col-span-12";

  const useLead = total >= 3;
  const rest = useLead ? total - 1 : total;
  const rIndex = useLead ? index - 1 : index;

  if (!useLead) {
    if (total === 1) return "lg:col-span-12";
    return "lg:col-span-6";
  }

  if (total === 3 && index > 0) return "lg:col-span-6";

  const rem = rest % 3;
  const lastRowLen = rem === 0 ? 3 : rem;
  const lastStart = rest - lastRowLen;

  if (rIndex >= lastStart) {
    if (rem === 1) return "lg:col-span-12";
    if (rem === 2) return "lg:col-span-6";
  }
  return "lg:col-span-4";
}

function smColumnSpan(
  variant: ArticleCardVariant,
  lgColumnClass: string,
  total: number,
): string {
  if (variant === "lead") return "sm:col-span-2";
  if (total === 1) return "sm:col-span-2";
  if (lgColumnClass.includes("lg:col-span-12")) return "sm:col-span-2";
  return "";
}

export function HomeArticleFeed({
  articles,
  excludeArticleIds = [],
}: Props) {
  const [active, setActive] = useState<FilterValue>(ALL);

  const exclude = useMemo(
    () => new Set(excludeArticleIds),
    [excludeArticleIds],
  );

  const wireArticles = useMemo(
    () => articles.filter((a) => !exclude.has(a.id)),
    [articles, exclude],
  );

  const chips = useMemo(
    () => [ALL, ...HOME_WIRE_CATEGORIES] as FilterValue[],
    [],
  );

  const visible = useMemo(() => {
    const pool =
      active === ALL
        ? wireArticles
        : wireArticles.filter((a) => a.category === active);
    return pool;
  }, [wireArticles, active]);

  return (
    <div className="space-y-11 sm:space-y-14">
      <div className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-subtle">
          Filter by category
        </p>
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            className="flex flex-wrap gap-2.5 sm:gap-3"
            role="tablist"
            aria-label="Article categories"
          >
            {chips.map((label) => {
              const selected = active === label;
              const dotClass =
                label !== ALL
                  ? categoryDotClass[label]
                  : "bg-brand/70";

              return (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(label)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all duration-300 ease-refined focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft ${
                    selected
                      ? "border-brand/35 bg-brand text-white shadow-sm ring-1 ring-brand/25"
                      : "border-line bg-surface/95 text-ink-muted ring-1 ring-line/70 hover:border-brand/25 hover:bg-surface-card hover:text-ink"
                  }`}
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full shadow-sm ${selected ? "bg-white/95 ring-1 ring-white/40" : dotClass}`}
                    aria-hidden
                  />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-surface-soft/90 px-6 py-12 text-center text-sm leading-relaxed text-ink-muted shadow-sm ring-1 ring-line/60">
          No stories in this category yet.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-9 lg:grid-cols-12 lg:gap-x-9 lg:gap-y-11">
          {visible.map((article, index) => {
            const variant = resolveVariant(index, visible.length);
            const colClass = gridColumnClass(index, visible.length, variant);
            const smClass = smColumnSpan(variant, colClass, visible.length);
            return (
              <li
                key={article.id}
                className={`min-h-[1px] ${smClass} ${colClass}`.trim()}
              >
                <ArticleCard article={article} variant={variant} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

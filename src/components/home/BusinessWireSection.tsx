import Link from "next/link";
import { HomeArticleFeed } from "@/components/home/HomeArticleFeed";
import type { ArticlePreview } from "@/types/article";

type Props = {
  articles: ArticlePreview[];
  excludeArticleIds?: string[];
};

export function BusinessWireSection({
  articles,
  excludeArticleIds = [],
}: Props) {
  const exclude = new Set(excludeArticleIds);
  const wireCount = articles.filter((a) => !exclude.has(a.id)).length;

  return (
    <section
      className="relative overflow-hidden rounded-[1.35rem] border border-line/90 bg-surface shadow-panel ring-1 ring-brand/[0.08]"
      aria-labelledby="feed-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(30,58,95,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,58,95,0.04)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_85%_70%_at_50%_0%,#000_20%,transparent_75%)]"
        aria-hidden
      />

      <header className="relative border-b border-line/80">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
        <div className="bg-gradient-to-br from-brand/[0.06] via-surface to-teal-600/[0.04] px-5 py-8 sm:px-9 sm:py-10 lg:px-11">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="min-w-0 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-teal-600/20 bg-teal-600/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-800">
                  <span
                    className="relative flex h-1.5 w-1.5"
                    aria-hidden
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-600" />
                  </span>
                  Live desk
                </span>
                <span className="font-mono text-[11px] font-medium tabular-nums tracking-wide text-ink-subtle">
                  {wireCount} {wireCount === 1 ? "briefing" : "briefings"}
                </span>
              </div>

              <div>
                <h2
                  id="feed-heading"
                  className="font-serif text-[1.75rem] font-semibold tracking-[-0.03em] text-ink sm:text-4xl sm:tracking-[-0.035em]"
                >
                  Business Wire
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-muted sm:text-[0.95rem]">
                  Numbered briefings, newest first—structured for owners and
                  operators who need context fast.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:items-end">
              <Link
                href="/sectors"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-brand/20 bg-surface/90 px-4 py-2.5 text-xs font-semibold text-brand shadow-sm ring-1 ring-brand/10 transition-all duration-300 ease-refined hover:border-brand/35 hover:bg-brand-soft hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:text-sm"
              >
                Browse by sector
                <span aria-hidden className="text-brand/70">
                  →
                </span>
              </Link>
              <p className="max-w-[14rem] text-right text-[11px] leading-relaxed text-ink-subtle sm:text-xs">
                Policy, real estate, agriculture, banking & more
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative px-5 py-8 sm:px-9 sm:py-10 lg:px-11">
        <HomeArticleFeed
          articles={articles}
          excludeArticleIds={excludeArticleIds}
        />
      </div>
    </section>
  );
}

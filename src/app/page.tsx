import { FeaturedStory } from "@/components/home/FeaturedStory";
import { HomeArticleFeed } from "@/components/home/HomeArticleFeed";
import { getPublishedPreviewsForPublicSite } from "@/lib/db/articles";
import { pickFeaturedArticle } from "@/lib/home-feed";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const articles = await getPublishedPreviewsForPublicSite();
  const featured = pickFeaturedArticle(articles);
  const wireExclude = featured ? [featured.id] : [];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-11 sm:px-6 sm:pb-28 sm:pt-14 lg:px-8 lg:pb-32 lg:pt-16">
      <header className="relative mb-12 max-w-3xl sm:mb-14 lg:mb-16">
        <div
          className="pointer-events-none absolute -right-8 -top-6 h-32 w-32 rounded-full bg-teal-400/15 blur-3xl sm:h-40 sm:w-40"
          aria-hidden
        />
        <div className="relative rounded-2xl border border-line bg-surface-card py-8 pl-6 pr-6 shadow-card ring-1 ring-brand/10 sm:py-10 sm:pl-8 sm:pr-10">
          <div
            className="pointer-events-none absolute left-0 top-6 h-[calc(100%-3rem)] w-[3px] rounded-full bg-gradient-to-b from-brand via-teal-600 to-indigo-500 sm:top-8 sm:h-[calc(100%-4rem)]"
            aria-hidden
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand sm:text-xs">
            Today&apos;s desk
          </p>
          <h1 className="mt-4 max-w-[22ch] font-serif text-[1.7rem] font-semibold leading-[1.14] tracking-[-0.02em] text-ink sm:max-w-none sm:text-4xl sm:leading-[1.08] sm:tracking-[-0.025em] lg:text-[2.45rem]">
            Market-moving stories, distilled for{" "}
            <span className="text-gradient-brand-accent">decision-makers</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-[0.97rem] leading-[1.65] text-ink-muted sm:text-[1.05rem] sm:leading-relaxed">
            Curated coverage of Cameroon and the wider region—each analysis
            covers what happened, market impact, and strategic insight for what
            to watch next.
          </p>
        </div>
      </header>

      {featured ? <FeaturedStory article={featured} /> : null}

      <section
        className="relative rounded-2xl border border-line bg-surface px-4 py-10 shadow-card ring-1 ring-brand/10 sm:rounded-[1.35rem] sm:px-9 sm:py-12 lg:px-11 lg:py-14"
        aria-labelledby="feed-heading"
      >
        <div className="relative mb-11 border-b border-line pb-11 sm:mb-12 sm:pb-12">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-accent">
                Wire · live desk
              </p>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2
                  id="feed-heading"
                  className="font-serif text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl sm:tracking-[-0.025em]"
                >
                  Market Wire
                </h2>
                <span className="hidden h-1.5 w-1.5 rounded-full bg-accent shadow-sm ring-2 ring-accent/20 sm:inline-block" />
                <span className="text-sm font-semibold tabular-nums text-ink-muted">
                  {articles.length} stories
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-0.5 flex-1 max-w-[9rem] rounded-full bg-gradient-to-r from-brand/40 via-accent/50 to-indigo-400/40 sm:max-w-[11rem]" />
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent ring-2 ring-accent/20" />
              </div>
            </div>
            <p className="max-w-md text-right text-[13px] leading-[1.6] text-ink-muted sm:text-sm">
              Latest headlines from the desk—filter by category or open a full
              briefing.
            </p>
          </div>
        </div>

        <HomeArticleFeed
          articles={articles}
          excludeArticleIds={wireExclude}
        />
      </section>
    </div>
  );
}

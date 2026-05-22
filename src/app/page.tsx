import { BusinessWireSection } from "@/components/home/BusinessWireSection";
import { FeaturedStory } from "@/components/home/FeaturedStory";
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
            Cameroon business news, explained for{" "}
            <span className="text-gradient-brand-accent">operators</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-[0.97rem] leading-[1.65] text-ink-muted sm:text-[1.05rem] sm:leading-relaxed">
            Built for business owners, entrepreneurs, and young professionals—each
            briefing covers what happened, why it matters for commerce, and what
            to watch next.
          </p>
        </div>
      </header>

      {featured ? <FeaturedStory article={featured} /> : null}

      <BusinessWireSection
        articles={articles}
        excludeArticleIds={wireExclude}
      />
    </div>
  );
}

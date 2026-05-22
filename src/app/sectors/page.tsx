import type { Metadata } from "next";
import { SectorsBoard } from "@/components/sectors/SectorsBoard";
import { SectorsJumpNav } from "@/components/sectors/SectorsJumpNav";
import { getPublishedPreviewsForPublicSite } from "@/lib/db/articles";

export const metadata: Metadata = {
  title: "Sectors · CameroonMetrics",
  description:
    "Cameroon business stories by sector—policy, real estate, agriculture, banking, and more.",
};

export const dynamic = "force-dynamic";

export default async function SectorsPage() {
  const articles = await getPublishedPreviewsForPublicSite();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pb-28 sm:pt-12 lg:px-8 lg:pb-32">
      <header className="relative mb-6 max-w-3xl">
        <div
          className="pointer-events-none absolute -left-2 top-8 h-20 w-20 rounded-full bg-indigo-400/10 blur-2xl"
          aria-hidden
        />
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-indigo-700">
          Industry lens
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Sectors
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
          Stories grouped by industry—helpful if you run a business in a specific
          sector or want to scan what is moving across the economy.
        </p>
      </header>

      <SectorsJumpNav />
      <SectorsBoard articles={articles} />
    </div>
  );
}

import type { Metadata } from "next";
import { MarketsDashboard } from "@/components/markets/MarketsDashboard";
import {
  mockCommodities,
  mockCurrencyQuotes,
  mockMarketOverview,
} from "@/data/mock-market-snapshot";

export const metadata: Metadata = {
  title: "Markets · CameroonMetrics",
  description:
    "Mock market dashboard—inflation, rates, FX, and commodities for layout testing.",
};

export default function MarketsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pb-28 sm:pt-12 lg:px-8 lg:pb-32">
      <header className="mb-12 max-w-3xl border-b border-brand/15 pb-10 sm:mb-14">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-subtle">
          Mock terminal
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Markets
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
          Simulated macro and cross-asset snapshot for a financial newsroom
          layout. Figures are static placeholders only.
        </p>
      </header>

      <MarketsDashboard
        overview={mockMarketOverview}
        currencies={mockCurrencyQuotes}
        commodities={mockCommodities}
      />
    </div>
  );
}

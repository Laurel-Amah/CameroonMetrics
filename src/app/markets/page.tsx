import type { Metadata } from "next";
import { MarketsDashboard } from "@/components/markets/MarketsDashboard";
import type {
  CommoditiesMeta,
  FxMeta,
} from "@/components/markets/MarketsDashboard";
import {
  cacheRowToCommodityRows,
  getCommoditiesDailyCache,
} from "@/lib/db/commodities-cache";
import { cacheRowToQuoteRows, getFxDailyCache } from "@/lib/db/fx-cache";
import { createSupabaseAnonClientNullable } from "@/lib/supabase/server";
import type { CommodityRow, QuoteRow } from "@/types/markets";

export const metadata: Metadata = {
  title: "Markets · CameroonMetrics",
  description:
    "Daily FX crosses and commodity snapshots for Cameroon and CEMAC.",
};

export const dynamic = "force-dynamic";

export default async function MarketsPage() {
  let currencies: QuoteRow[] = [];
  let fxMeta: FxMeta | null = null;
  let commodities: CommodityRow[] = [];
  let commoditiesMeta: CommoditiesMeta | null = null;

  const supabase = createSupabaseAnonClientNullable();
  if (supabase) {
    const [fxRow, commoditiesRow] = await Promise.all([
      getFxDailyCache(supabase),
      getCommoditiesDailyCache(supabase),
    ]);

    if (fxRow) {
      const live = cacheRowToQuoteRows(fxRow);
      if (live.length > 0) {
        currencies = live;
        fxMeta = {
          rateDate: fxRow.rate_date,
          fetchedAt: fxRow.fetched_at,
          baseCurrency: fxRow.base_currency,
        };
      }
    }

    if (commoditiesRow) {
      const live = cacheRowToCommodityRows(commoditiesRow);
      if (live.length > 0) {
        commodities = live;
        commoditiesMeta = { fetchedAt: commoditiesRow.fetched_at };
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pb-28 sm:pt-12 lg:px-8 lg:pb-32">
      <header className="relative mb-12 max-w-3xl border-b border-brand/15 pb-10 sm:mb-14">
        <div
          className="pointer-events-none absolute -right-4 top-0 h-24 w-24 rounded-full bg-teal-400/12 blur-2xl"
          aria-hidden
        />
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-teal-700">
          Desk snapshot
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Markets
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
          Daily indicative FX crosses and commodity benchmarks relevant to
          Cameroon and the region.
        </p>
      </header>

      <MarketsDashboard
        currencies={currencies}
        fxMeta={fxMeta}
        commodities={commodities}
        commoditiesMeta={commoditiesMeta}
      />
    </div>
  );
}

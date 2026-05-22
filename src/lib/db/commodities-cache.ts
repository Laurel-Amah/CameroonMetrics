import type { SupabaseClient } from "@supabase/supabase-js";
import type { CommodityRow } from "@/types/markets";
import type { CommodityQuote } from "@/lib/financial-modeling-prep";

export type CommoditiesDailyCacheRow = {
  id: number;
  quotes: CommodityQuote[];
  previous_quotes: CommodityQuote[] | null;
  fetched_at: string;
};

function formatLast(n: number, decimals: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function decimalsForPrice(n: number): number {
  if (n >= 1000) return 0;
  if (n >= 100) return 1;
  if (n >= 10) return 2;
  return 3;
}

function formatSessionChange(pct: number | null): string {
  if (pct === null || !Number.isFinite(pct)) return "—";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

export function cacheRowToCommodityRows(
  row: CommoditiesDailyCacheRow,
): CommodityRow[] {
  return row.quotes.map((q) => ({
    name: q.name,
    unit: q.unit,
    last: formatLast(q.last, decimalsForPrice(q.last)),
    session: formatSessionChange(q.dailyChangePct),
  }));
}

function isCommoditiesCacheUnavailableError(
  message: string,
  code?: string,
): boolean {
  if (code === "PGRST205") return true;
  const m = message.toLowerCase();
  if (!m.includes("commodities_daily_cache")) return false;
  return (
    m.includes("schema cache") ||
    m.includes("does not exist") ||
    m.includes("not found")
  );
}

export async function getCommoditiesDailyCache(
  supabase: SupabaseClient,
): Promise<CommoditiesDailyCacheRow | null> {
  const { data, error } = await supabase
    .from("commodities_daily_cache")
    .select("id, quotes, previous_quotes, fetched_at")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    if (!isCommoditiesCacheUnavailableError(error.message, error.code)) {
      console.error("getCommoditiesDailyCache:", error.message);
    }
    return null;
  }
  if (!data?.quotes || !Array.isArray(data.quotes)) return null;

  const quotes = data.quotes as CommodityQuote[];
  const prev =
    data.previous_quotes && Array.isArray(data.previous_quotes)
      ? (data.previous_quotes as CommodityQuote[])
      : null;

  return {
    id: data.id as number,
    quotes,
    previous_quotes: prev,
    fetched_at: data.fetched_at as string,
  };
}

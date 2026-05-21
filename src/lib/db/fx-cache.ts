import type { SupabaseClient } from "@supabase/supabase-js";
import type { QuoteRow } from "@/types/markets";

export type FxDailyCacheRow = {
  id: number;
  base_currency: string;
  rate_date: string;
  rates: Record<string, number>;
  previous_rates: Record<string, number> | null;
  fetched_at: string;
};

function formatNum(n: number, decimals: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function pctChange(prev: number | undefined, next: number): string {
  if (prev === undefined || !Number.isFinite(prev) || prev === 0) return "—";
  const pct = ((next - prev) / prev) * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

function decimalsForXafCross(xafPerUnit: number): number {
  if (xafPerUnit < 0.1) return 4;
  if (xafPerUnit < 10) return 3;
  return 2;
}

const XAF_CROSS_CODES = ["USD", "EUR", "GBP", "CNY", "NGN", "CAD", "ZAR"] as const;

/**
 * ECB-style matrix: `rates` are units of each currency per 1 `base_currency`.
 * Builds indicative XAF crosses for the Markets table.
 */
export function cacheRowToQuoteRows(row: FxDailyCacheRow): QuoteRow[] {
  const rates = row.rates;
  const base = row.base_currency.toUpperCase();
  const xaf = rates.XAF;

  if (typeof xaf !== "number") {
    return [];
  }

  if (base !== "EUR" && typeof rates.EUR !== "number") {
    return [];
  }

  const spread = 0.00015;
  const prev = row.previous_rates;
  const prevXaf = prev?.XAF;
  const asOf = row.rate_date;

  const rows: QuoteRow[] = [];

  for (const code of XAF_CROSS_CODES) {
    let xafPerUnit: number | undefined;
    if (code === "EUR") {
      xafPerUnit = base === "EUR" ? xaf : xaf / (rates.EUR as number);
    } else {
      const rate = rates[code];
      if (typeof rate !== "number") continue;
      xafPerUnit = xaf / rate;
    }

    let prevCross: number | undefined;
    if (prev && typeof prevXaf === "number") {
      if (code === "EUR") {
        prevCross = base === "EUR" ? prevXaf : prevXaf / (prev.EUR as number);
        if (base !== "EUR" && typeof prev.EUR !== "number") {
          prevCross = undefined;
        }
      } else {
        const prevRate = prev[code];
        if (typeof prevRate === "number") {
          prevCross = prevXaf / prevRate;
        }
      }
    }

    const decimals = decimalsForXafCross(xafPerUnit);
    const bid = xafPerUnit * (1 - spread);
    const ask = xafPerUnit * (1 + spread);

    rows.push({
      pair: `XAF / ${code}`,
      bid: formatNum(bid, decimals),
      ask: formatNum(ask, decimals),
      changePct: pctChange(prevCross, xafPerUnit),
      note: asOf,
    });
  }

  return rows;
}

/** Table missing or not yet exposed to PostgREST — run `0002_fx_daily_cache.sql` in Supabase. */
function isFxCacheUnavailableError(message: string, code?: string): boolean {
  if (code === "PGRST205") return true;
  const m = message.toLowerCase();
  if (!m.includes("fx_daily_cache")) return false;
  return (
    m.includes("schema cache") ||
    m.includes("does not exist") ||
    m.includes("not found")
  );
}

export async function getFxDailyCache(
  supabase: SupabaseClient,
): Promise<FxDailyCacheRow | null> {
  const { data, error } = await supabase
    .from("fx_daily_cache")
    .select(
      "id, base_currency, rate_date, rates, previous_rates, fetched_at",
    )
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    if (!isFxCacheUnavailableError(error.message, error.code)) {
      console.error("getFxDailyCache:", error.message);
    }
    return null;
  }
  if (!data?.rates || typeof data.rates !== "object") return null;

  const prev =
    data.previous_rates && typeof data.previous_rates === "object"
      ? (data.previous_rates as Record<string, number>)
      : null;

  return {
    id: data.id as number,
    base_currency: data.base_currency as string,
    rate_date: data.rate_date as string,
    rates: data.rates as Record<string, number>,
    previous_rates: prev,
    fetched_at: data.fetched_at as string,
  };
}

import { z } from "zod";

const fmpErrorSchema = z
  .object({
    "Error Message": z.string().optional(),
  })
  .passthrough();

const quoteShortSchema = z
  .object({
    symbol: z.string(),
    price: z.union([z.number(), z.string()]),
    change: z.union([z.number(), z.string()]).optional(),
  })
  .passthrough();

export type CommodityQuote = {
  symbol: string;
  name: string;
  last: number;
  unit: string;
  dailyChangePct: number | null;
  lastUpdate: string | null;
};

/** Desk watchlist — FMP commodity futures symbols. */
export const COMMODITY_WATCHLIST = [
  { id: "cocoa", label: "Cocoa", fmpSymbol: "CCUSD", unit: "USD/mt" },
  { id: "brent", label: "Brent crude", fmpSymbol: "BZUSD", unit: "USD/bbl" },
  { id: "wti", label: "WTI crude", fmpSymbol: "CLUSD", unit: "USD/bbl" },
  {
    id: "natural-gas",
    label: "Natural gas",
    fmpSymbol: "NGUSD",
    unit: "USD/MMBtu",
  },
  { id: "gold", label: "Gold", fmpSymbol: "GCUSD", unit: "USD/oz" },
  { id: "copper", label: "Copper", fmpSymbol: "HGUSD", unit: "USD/lb" },
] as const;

export type CommodityWatchId = (typeof COMMODITY_WATCHLIST)[number]["id"];

function toNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function sessionChangePct(price: number, change: number | null): number | null {
  if (change === null) return null;
  const previousClose = price - change;
  if (!Number.isFinite(previousClose) || previousClose === 0) return null;
  return (change / previousClose) * 100;
}

function normalizeQuoteShort(
  raw: z.infer<typeof quoteShortSchema>,
  watch: (typeof COMMODITY_WATCHLIST)[number],
): CommodityQuote | null {
  const last = toNumber(raw.price);
  if (last === null) return null;

  const change = toNumber(raw.change);
  const dailyChangePct = sessionChangePct(last, change);

  return {
    symbol: watch.id,
    name: watch.label,
    last,
    unit: watch.unit,
    dailyChangePct,
    lastUpdate: new Date().toISOString(),
  };
}

async function fetchQuoteShort(
  fmpSymbol: string,
  apiKey: string,
): Promise<z.infer<typeof quoteShortSchema> | null> {
  const url = new URL("https://financialmodelingprep.com/stable/quote-short");
  url.searchParams.set("symbol", fmpSymbol);
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  // Free tier: only a subset of commodities return live quote-short data (402 = paid).
  if (res.status === 402) return null;
  if (!res.ok) {
    throw new Error(
      `financialmodelingprep.com ${fmpSymbol} HTTP ${res.status}`,
    );
  }

  const json: unknown = await res.json();

  if (json && typeof json === "object" && !Array.isArray(json)) {
    const err = fmpErrorSchema.safeParse(json);
    const message = err.success ? err.data["Error Message"] : undefined;
    throw new Error(
      `financialmodelingprep.com ${fmpSymbol}: ${message ?? "unexpected response"}`,
    );
  }

  if (!Array.isArray(json) || json.length === 0) return null;

  const parsed = quoteShortSchema.safeParse(json[0]);
  return parsed.success ? parsed.data : null;
}

/**
 * Fetches commodity quotes from FMP (one quote-short request per symbol; free tier).
 * @see https://site.financialmodelingprep.com/developer/docs/stable/commodities-quote-short
 */
export async function fetchFmpCommodities(params: {
  apiKey: string;
}): Promise<{ quotes: CommodityQuote[]; skipped: string[] }> {
  const rows = await Promise.all(
    COMMODITY_WATCHLIST.map((watch) =>
      fetchQuoteShort(watch.fmpSymbol, params.apiKey).then((row) => ({
        watch,
        row,
      })),
    ),
  );

  const picked: CommodityQuote[] = [];
  for (const { watch, row } of rows) {
    if (!row) continue;
    const quote = normalizeQuoteShort(row, watch);
    if (quote) picked.push(quote);
  }

  const skipped = COMMODITY_WATCHLIST.filter(
    (w) => !picked.some((q) => q.symbol === w.id),
  ).map((w) => w.fmpSymbol);

  if (picked.length === 0) {
    throw new Error(
      "financialmodelingprep.com: no watchlist commodities found in response",
    );
  }

  return { quotes: picked, skipped };
}

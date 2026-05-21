import { z } from "zod";

const apiErrorSchema = z
  .object({
    code: z.number().optional(),
    type: z.string().optional(),
    info: z.string().optional(),
  })
  .optional();

const liveSchema = z.object({
  success: z.boolean(),
  source: z.string().optional(),
  timestamp: z.number().optional(),
  quotes: z.record(z.number()).optional(),
  error: apiErrorSchema,
});

export type ExchangeRateHostLatest = {
  base: string;
  date: string;
  rates: Record<string, number>;
};

/** Currencies requested on each daily `/live` call (EUR is the API `source`). */
export const FX_LIVE_SYMBOLS = [
  "XAF",
  "USD",
  "GBP",
  "CNY",
  "NGN",
  "CAD",
  "ZAR",
] as const;

/** APILayer returns `EURXAF`-style keys; normalize to `{ XAF: n, USD: n }`. */
function quotesToRates(
  source: string,
  quotes: Record<string, number>,
): Record<string, number> {
  const prefix = source.toUpperCase();
  const rates: Record<string, number> = {};
  for (const [key, value] of Object.entries(quotes)) {
    const upper = key.toUpperCase();
    if (upper.startsWith(prefix)) {
      const code = upper.slice(prefix.length);
      if (code) rates[code] = value;
    }
  }
  return rates;
}

/**
 * Fetches latest ECB-sourced FX from exchangerate.host (APILayer).
 * Uses the `/live` endpoint (`/latest` was removed from the hosted API).
 * @see https://exchangerate.host/
 */
export async function fetchExchangeRateHostLatest(params: {
  accessKey: string;
  base: string;
  symbols: string[];
}): Promise<ExchangeRateHostLatest> {
  const url = new URL("https://api.exchangerate.host/live");
  url.searchParams.set("access_key", params.accessKey);
  url.searchParams.set("source", params.base);
  url.searchParams.set("currencies", params.symbols.join(","));

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`exchangerate.host HTTP ${res.status}`);
  }

  const json: unknown = await res.json();
  const parsed = liveSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("exchangerate.host: unexpected response shape");
  }
  const body = parsed.data;
  if (!body.success || !body.source || !body.quotes) {
    const detail = body.error?.info ?? body.error?.type ?? "success=false";
    throw new Error(`exchangerate.host: ${detail}`);
  }

  const rates = quotesToRates(body.source, body.quotes);
  const missing = params.symbols.filter(
    (s) => typeof rates[s.toUpperCase()] !== "number",
  );
  if (missing.length > 0) {
    throw new Error(
      `exchangerate.host: response missing ${missing.join(", ")} rates`,
    );
  }

  const date = body.timestamp
    ? new Date(body.timestamp * 1000).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return { base: body.source, date, rates };
}

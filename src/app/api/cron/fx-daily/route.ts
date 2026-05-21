import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  FX_LIVE_SYMBOLS,
  fetchExchangeRateHostLatest,
} from "@/lib/exchangerate-host";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";

export const dynamic = "force-dynamic";

/**
 * Daily job: one exchangerate.host request, upsert public FX cache for the Markets page.
 * Secure with CRON_SECRET (Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessKey = process.env.EXCHANGERATE_HOST_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json(
      { error: "Missing EXCHANGERATE_HOST_ACCESS_KEY" },
      { status: 500 },
    );
  }

  try {
    const supabase = createSupabaseServiceRoleClient();

    const { data: existing } = await supabase
      .from("fx_daily_cache")
      .select("rates")
      .eq("id", 1)
      .maybeSingle();

    const previousRates =
      existing?.rates && typeof existing.rates === "object"
        ? (existing.rates as Record<string, number>)
        : null;

    const latest = await fetchExchangeRateHostLatest({
      accessKey,
      base: "EUR",
      symbols: [...FX_LIVE_SYMBOLS],
    });

    const { error } = await supabase.from("fx_daily_cache").upsert(
      {
        id: 1,
        base_currency: latest.base,
        rate_date: latest.date,
        rates: latest.rates,
        previous_rates: previousRates,
        fetched_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) throw error;

    revalidatePath("/markets");

    return NextResponse.json({
      ok: true,
      rateDate: latest.date,
      base: latest.base,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("fx-daily cron:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

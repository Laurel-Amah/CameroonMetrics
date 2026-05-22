import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { fetchFmpCommodities } from "@/lib/financial-modeling-prep";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";

export const dynamic = "force-dynamic";

/**
 * Daily job: FMP commodities snapshot for the Markets page.
 * Secure with CRON_SECRET (Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing FMP_API_KEY" },
      { status: 500 },
    );
  }

  try {
    const supabase = createSupabaseServiceRoleClient();

    const { data: existing } = await supabase
      .from("commodities_daily_cache")
      .select("quotes")
      .eq("id", 1)
      .maybeSingle();

    const previousQuotes =
      existing?.quotes && Array.isArray(existing.quotes)
        ? existing.quotes
        : null;

    const { quotes, skipped } = await fetchFmpCommodities({ apiKey });

    const { error } = await supabase.from("commodities_daily_cache").upsert(
      {
        id: 1,
        quotes,
        previous_quotes: previousQuotes,
        fetched_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) throw error;

    revalidatePath("/markets");

    return NextResponse.json({
      ok: true,
      count: quotes.length,
      symbols: quotes.map((q) => q.symbol),
      skipped: skipped.length > 0 ? skipped : undefined,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("commodities-daily cron:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

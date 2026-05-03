import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await ctx.params;

    const { error } = await supabase
      .from("articles")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    const { data: row } = await supabase
      .from("articles")
      .select("slug")
      .eq("id", id)
      .single();

    if (row?.slug) {
      revalidatePath("/");
      revalidatePath("/sectors");
      revalidatePath(`/article/${row.slug as string}`);
    }

    return NextResponse.json({ ok: true, slug: row?.slug ?? null });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Publish failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

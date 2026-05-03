import { NextResponse } from "next/server";
import { ARTICLE_CATEGORIES } from "@/lib/ai/article-schema";
import { allocateUniqueSlug } from "@/lib/db/slug-unique";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slug = await allocateUniqueSlug(supabase, "new-story");
    const category = ARTICLE_CATEGORIES[0];

    const insert = {
      slug,
      status: "draft" as const,
      title: "Untitled story",
      category,
      preview: "",
      image_src: "",
      what_happened: "",
      why_it_matters: "",
      investor_insight: "",
      source_url: null,
      source_name: null,
      source_author: null,
      source_published_at: null,
      original_input: null,
      suggested_image_url: null,
      ai_model: null,
      ai_generated_at: null,
      created_by: user.id,
    };

    const { data, error } = await supabase
      .from("articles")
      .insert(insert)
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id as string });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not create draft";
    const status = message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

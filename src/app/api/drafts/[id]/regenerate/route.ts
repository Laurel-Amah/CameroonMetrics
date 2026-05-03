import { NextResponse } from "next/server";
import { extractFromUrl } from "@/lib/ai/extract-from-url";
import { generateArticleDraft } from "@/lib/ai/generate-article-draft";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ArticleRow } from "@/lib/db/article-row";

export const runtime = "nodejs";

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

    const { data: row, error: fetchError } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !row) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }

    const r = row as ArticleRow;
    const original = (r.original_input || "").trim();
    if (!original) {
      return NextResponse.json(
        { error: "No original_input stored for this draft." },
        { status: 400 },
      );
    }

    let sourceText = "";
    let pageTitleHint: string | null = null;
    let suggestedImageUrl: string | null = r.suggested_image_url;
    let metaName: string | null = r.source_name;
    let metaAuthor: string | null = r.source_author;
    let metaPublishedAt: string | null = r.source_published_at;
    let sourceUrl: string | null = r.source_url;

    const looksLikeUrl = /^https?:\/\//i.test(original);
    if (looksLikeUrl) {
      sourceUrl = original;
      const extracted = await extractFromUrl(original);
      sourceText = extracted.text;
      pageTitleHint = extracted.title || null;
      suggestedImageUrl = extracted.suggestedImageUrl;
      metaName = extracted.sourceName;
      metaAuthor = extracted.sourceAuthor;
      metaPublishedAt = extracted.sourcePublishedAt;
    } else {
      sourceText = original;
    }

    const { draft, model } = await generateArticleDraft({
      sourceText,
      sourceUrl,
      pageTitleHint,
    });

    const { error: updateError } = await supabase
      .from("articles")
      .update({
        title: draft.title,
        category: draft.category,
        preview: draft.preview.slice(0, 600),
        what_happened: draft.whatHappened,
        why_it_matters: draft.whyItMatters,
        investor_insight: draft.investorInsight,
        source_name:
          draft.sourceName?.trim() || metaName || r.source_name,
        source_author:
          draft.sourceAuthor?.trim() || metaAuthor || r.source_author,
        source_published_at:
          draft.sourcePublishedAt?.trim() ||
          metaPublishedAt ||
          r.source_published_at,
        suggested_image_url: suggestedImageUrl ?? r.suggested_image_url,
        ai_model: model,
        ai_generated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw updateError;
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Regenerate failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

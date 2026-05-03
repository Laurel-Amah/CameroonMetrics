import { NextResponse } from "next/server";
import { extractFromUrl } from "@/lib/ai/extract-from-url";
import { generateArticleDraft } from "@/lib/ai/generate-article-draft";
import { allocateUniqueSlug } from "@/lib/db/slug-unique";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  url?: string;
  text?: string;
};

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Body;
    const url = typeof body.url === "string" ? body.url.trim() : "";
    const text = typeof body.text === "string" ? body.text.trim() : "";

    let sourceText = "";
    let pageTitleHint: string | null = null;
    let suggestedImageUrl: string | null = null;
    let metaName: string | null = null;
    let metaAuthor: string | null = null;
    let metaPublishedAt: string | null = null;
    let originalInput = "";

    if (url && !text) {
      originalInput = url;
      const extracted = await extractFromUrl(url);
      sourceText = extracted.text;
      pageTitleHint = extracted.title || null;
      suggestedImageUrl = extracted.suggestedImageUrl;
      metaName = extracted.sourceName;
      metaAuthor = extracted.sourceAuthor;
      metaPublishedAt = extracted.sourcePublishedAt;
    } else if (text) {
      originalInput = text;
      sourceText = text;
    } else {
      return NextResponse.json(
        { error: "Provide either `url` or `text`." },
        { status: 400 },
      );
    }

    const { draft, model } = await generateArticleDraft({
      sourceText,
      sourceUrl: url || null,
      pageTitleHint,
    });

    const slug = await allocateUniqueSlug(supabase, draft.slug);

    const insert = {
      slug,
      status: "draft" as const,
      title: draft.title,
      category: draft.category,
      preview: draft.preview.slice(0, 600),
      image_src: "",
      what_happened: draft.whatHappened,
      why_it_matters: draft.whyItMatters,
      investor_insight: draft.investorInsight,
      source_url: url || null,
      source_name: draft.sourceName?.trim() || metaName,
      source_author: draft.sourceAuthor?.trim() || metaAuthor,
      source_published_at: draft.sourcePublishedAt?.trim() || metaPublishedAt,
      original_input: originalInput,
      suggested_image_url: suggestedImageUrl,
      ai_model: model,
      ai_generated_at: new Date().toISOString(),
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
    const message = e instanceof Error ? e.message : "Extract failed";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

import { NextResponse } from "next/server";
import {
  draftsToSourcesJson,
  legacySourceColumns,
} from "@/lib/article-sources";
import type { SourceDraft } from "@/lib/article-sources";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PatchBody = {
  slug?: string;
  title?: string;
  category?: string;
  preview?: string;
  imageSrc?: string;
  whatHappened?: string;
  whyItMatters?: string;
  investorInsight?: string;
  sources?: SourceDraft[];
  citations?: string;
  source?: {
    url?: string;
    name?: string;
    author?: string;
    publishedAt?: string;
  };
};

export async function PATCH(
  req: Request,
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
    const body = (await req.json()) as PatchBody;

    const patch: Record<string, unknown> = {};
    if (typeof body.slug === "string") patch.slug = body.slug.trim();
    if (typeof body.title === "string") patch.title = body.title;
    if (typeof body.category === "string") patch.category = body.category;
    if (typeof body.preview === "string") patch.preview = body.preview;
    if (typeof body.imageSrc === "string") patch.image_src = body.imageSrc;
    if (typeof body.whatHappened === "string") patch.what_happened = body.whatHappened;
    if (typeof body.whyItMatters === "string") patch.why_it_matters = body.whyItMatters;
    if (typeof body.investorInsight === "string") patch.investor_insight = body.investorInsight;

    if (body.sources !== undefined) {
      const normalized = draftsToSourcesJson(body.sources);
      patch.sources = normalized;
      Object.assign(patch, legacySourceColumns(normalized));
    } else if (body.source) {
      const s = body.source;
      if (s.url !== undefined) patch.source_url = s.url?.trim() || null;
      if (s.name !== undefined) patch.source_name = s.name?.trim() || null;
      if (s.author !== undefined) patch.source_author = s.author?.trim() || null;
      if (s.publishedAt !== undefined) {
        patch.source_published_at = s.publishedAt?.trim() || null;
      }
    }

    if (body.citations !== undefined) {
      patch.citations = body.citations.trim() || null;
    }

    const { error } = await supabase.from("articles").update(patch).eq("id", id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

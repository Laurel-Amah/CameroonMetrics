import { sourcesFromRow, sourcesToDrafts } from "@/lib/article-sources";
import type { SourceDraft } from "@/lib/article-sources";
import type { ArticleRow } from "@/lib/db/article-row";
import type { ArticleCategory } from "@/types/article";

export type DraftEditorInitial = {
  internalId: string;
  slug: string;
  status: "draft" | "published";
  title: string;
  category: ArticleCategory;
  preview: string;
  imageSrc: string;
  suggestedImageUrl: string | null;
  whatHappened: string;
  whyItMatters: string;
  investorInsight: string;
  sources: SourceDraft[];
  citations: string;
  /** Present when draft was created from URL/text for AI regenerate */
  originalInput: string | null;
};

export function rowToDraftEditorInitial(row: ArticleRow): DraftEditorInitial {
  return {
    internalId: row.id,
    slug: row.slug,
    status: row.status,
    title: row.title,
    category: row.category as ArticleCategory,
    preview: row.preview,
    imageSrc: row.image_src,
    suggestedImageUrl: row.suggested_image_url,
    whatHappened: row.what_happened,
    whyItMatters: row.why_it_matters,
    investorInsight: row.investor_insight,
    sources: sourcesToDrafts(sourcesFromRow(row)),
    citations: row.citations ?? "",
    originalInput: row.original_input,
  };
}

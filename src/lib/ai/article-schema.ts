import { z } from "zod";
import { ARTICLE_CATEGORIES } from "@/lib/article-categories";

export { ARTICLE_CATEGORIES };

export const aiArticleDraftSchema = z.object({
  title: z.string().max(200),
  slug: z.string().max(120),
  category: z.enum(ARTICLE_CATEGORIES),
  preview: z.string().max(600),
  whatHappened: z.string(),
  whyItMatters: z.string(),
  investorInsight: z.string(),
  sourceName: z.string().max(200).optional(),
  sourceAuthor: z.string().max(200).optional(),
  sourcePublishedAt: z.string().max(40).optional(),
});

export type AiArticleDraft = z.infer<typeof aiArticleDraftSchema>;

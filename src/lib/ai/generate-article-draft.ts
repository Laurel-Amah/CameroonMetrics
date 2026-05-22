import { generateObject } from "ai";
import { aiArticleDraftSchema, type AiArticleDraft } from "@/lib/ai/article-schema";
import { getArticleModelId, getOpenAI } from "@/lib/ai/client";

const SYSTEM = `You are the lead desk editor for CameroonMetrics, a Cameroon-centric business publication for owners, entrepreneurs, and young professionals.

Your job is to transform raw source material into a structured briefing that is relevant and easy to understand: plain language, precise, no hype, no marketing tone, no exclamation points.

Rules:
- Paraphrase and synthesise. Do not copy sentences verbatim from the source.
- Choose exactly one category from the allowed list (e.g. Policy, Entrepreneurship, Real Estate, Agriculture, Banking, Trade, Markets, Energy, Tech).
- "whatHappened" must be factual and tight (what occurred, who, where, numbers if present).
- "whyItMatters" (shown to readers as "Why it matters") must explain why business owners, entrepreneurs, or youths in Cameroon should care—costs, opportunities, regulation, jobs, or practical business context for Cameroon / CEMAC where relevant.
- "investorInsight" must be forward-looking: what to monitor, risks, practical next steps for operators. No investment advice; use "watch", "monitor", "may".
- "preview" is a single dek line, max ~220 characters of prose (not a headline).
- "slug": lowercase kebab-case from the headline, ASCII letters, digits, hyphens only, max 80 chars. No leading/trailing hyphens.
- Populate sourceName, sourceAuthor, sourcePublishedAt only when clearly implied by the material; otherwise null.
- Title max ~95 characters; avoid clickbait.`;

export type GenerateDraftInput = {
  sourceText: string;
  sourceUrl?: string | null;
  pageTitleHint?: string | null;
};

export async function generateArticleDraft(
  input: GenerateDraftInput,
): Promise<{ draft: AiArticleDraft; model: string }> {
  const modelId = getArticleModelId();
  const openai = getOpenAI();

  const userPayload = [
    input.sourceUrl ? `Source URL (for context only; do not reproduce paywalled text):\n${input.sourceUrl}` : null,
    input.pageTitleHint ? `Page title hint:\n${input.pageTitleHint}` : null,
    "Source body (may be truncated by the client if extremely long):\n---\n" +
      input.sourceText.slice(0, 48_000) +
      "\n---",
  ]
    .filter(Boolean)
    .join("\n\n");

  const { object } = await generateObject({
    model: openai(modelId),
    schema: aiArticleDraftSchema,
    system: SYSTEM,
    prompt: userPayload,
  });

  return { draft: object, model: modelId };
}

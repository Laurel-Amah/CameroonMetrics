import { createOpenAI } from "@ai-sdk/openai";

export function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("Missing OPENAI_API_KEY");
  }
  return createOpenAI({ apiKey: key });
}

export function getArticleModelId() {
  return process.env.OPENAI_ARTICLE_MODEL ?? "gpt-4o";
}

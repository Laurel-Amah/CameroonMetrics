import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

export type UrlExtraction = {
  title: string;
  text: string;
  suggestedImageUrl: string | null;
  sourceName: string | null;
  sourceAuthor: string | null;
  sourcePublishedAt: string | null;
};

function metaContent(doc: Document, selector: string): string | null {
  const el = doc.querySelector(selector);
  const v = el?.getAttribute("content")?.trim();
  return v || null;
}

export async function extractFromUrl(url: string): Promise<UrlExtraction> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; CameroonMetricsBot/1.0; +https://cameroonmetrics.example)",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch URL (${res.status})`);
  }

  const html = await res.text();
  const dom = new JSDOM(html, { url });
  const doc = dom.window.document;

  const reader = new Readability(doc);
  const parsed = reader.parse();

  const title = (parsed?.title || metaContent(doc, 'meta[property="og:title"]') || doc.title || "")
    .trim();

  const text = (parsed?.textContent || "").trim();
  if (text.length < 80) {
    throw new Error(
      "Could not extract enough readable text from this page. Paste the article body instead.",
    );
  }

  const suggestedImageUrl =
    metaContent(doc, 'meta[property="og:image"]') ||
    metaContent(doc, 'meta[name="twitter:image"]');

  const sourceName =
    metaContent(doc, 'meta[property="og:site_name"]') ||
    (() => {
      try {
        return new URL(url).hostname.replace(/^www\./, "");
      } catch {
        return null;
      }
    })();

  const sourceAuthor =
    metaContent(doc, 'meta[name="author"]') ||
    metaContent(doc, 'meta[property="article:author"]');

  const rawDate =
    metaContent(doc, 'meta[property="article:published_time"]') ||
    metaContent(doc, 'meta[name="pubdate"]') ||
    metaContent(doc, 'meta[name="date"]');

  let sourcePublishedAt: string | null = null;
  if (rawDate) {
    const d = new Date(rawDate);
    if (!Number.isNaN(d.getTime())) {
      sourcePublishedAt = d.toISOString().slice(0, 10);
    }
  }

  return {
    title,
    text,
    suggestedImageUrl,
    sourceName,
    sourceAuthor,
    sourcePublishedAt,
  };
}

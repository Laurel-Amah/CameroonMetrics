import type { ArticleRow } from "@/lib/db/article-row";
import type { ArticleSource } from "@/types/article";

export type SourceDraft = {
  url: string;
  name: string;
  author: string;
  publishedAt: string;
};

export function emptySourceDraft(): SourceDraft {
  return { url: "", name: "", author: "", publishedAt: "" };
}

export function hasSourceContent(s: ArticleSource | SourceDraft): boolean {
  return !!(
    s.url?.trim() ||
    s.name?.trim() ||
    s.author?.trim() ||
    s.publishedAt?.trim()
  );
}

export function normalizeSourceDraft(s: SourceDraft): ArticleSource {
  return {
    url: s.url.trim() || undefined,
    name: s.name.trim() || undefined,
    author: s.author.trim() || undefined,
    publishedAt: s.publishedAt.trim() || undefined,
  };
}

function parseSourcesJson(value: unknown): ArticleSource[] {
  if (!Array.isArray(value)) return [];
  const out: ArticleSource[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const s: ArticleSource = {
      url: typeof o.url === "string" ? o.url : undefined,
      name: typeof o.name === "string" ? o.name : undefined,
      author: typeof o.author === "string" ? o.author : undefined,
      publishedAt:
        typeof o.publishedAt === "string"
          ? o.publishedAt
          : typeof o.published_at === "string"
            ? o.published_at
            : undefined,
    };
    if (hasSourceContent(s)) out.push(s);
  }
  return out;
}

export function sourcesFromRow(row: ArticleRow): ArticleSource[] {
  const fromJson = parseSourcesJson(row.sources);
  if (fromJson.length > 0) return fromJson;

  const legacy: ArticleSource = {};
  if (row.source_url) legacy.url = row.source_url;
  if (row.source_name) legacy.name = row.source_name;
  if (row.source_author) legacy.author = row.source_author;
  if (row.source_published_at) legacy.publishedAt = row.source_published_at;
  return hasSourceContent(legacy) ? [legacy] : [];
}

export function sourcesToDrafts(sources: ArticleSource[]): SourceDraft[] {
  if (sources.length === 0) return [emptySourceDraft()];
  return sources.map((s) => ({
    url: s.url ?? "",
    name: s.name ?? "",
    author: s.author ?? "",
    publishedAt: s.publishedAt ?? "",
  }));
}

export function draftsToSourcesJson(drafts: SourceDraft[]): ArticleSource[] {
  return drafts.map(normalizeSourceDraft).filter(hasSourceContent);
}

export function primarySource(sources: ArticleSource[]): ArticleSource | undefined {
  return sources[0];
}

/** Keep legacy columns in sync with the first source for older queries. */
export function legacySourceColumns(sources: ArticleSource[]) {
  const first = sources[0];
  if (!first) {
    return {
      source_url: null,
      source_name: null,
      source_author: null,
      source_published_at: null,
    };
  }
  return {
    source_url: first.url?.trim() || null,
    source_name: first.name?.trim() || null,
    source_author: first.author?.trim() || null,
    source_published_at: first.publishedAt?.trim() || null,
  };
}

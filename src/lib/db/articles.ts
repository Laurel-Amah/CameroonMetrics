import type { SupabaseClient } from "@supabase/supabase-js";
import type { Article, ArticlePreview } from "@/types/article";
import {
  getAllArticleIds,
  getArticleById,
  mockArticles,
} from "@/data/mock-articles";
import { rowToArticle, rowToArticlePreview, type ArticleRow } from "@/lib/db/article-row";
import { createSupabaseAnonClient } from "@/lib/supabase/server";

function isMissingEnv(e: unknown): boolean {
  return e instanceof Error && e.message.includes("NEXT_PUBLIC_SUPABASE");
}

/** DNS/network failures when calling Supabase should not 500 public pages. */
function isSupabaseConnectionError(e: unknown): boolean {
  if (isMissingEnv(e)) return false;
  const collect = (x: unknown): string => {
    if (x instanceof Error) {
      return `${x.message} ${x.cause instanceof Error ? x.cause.message : ""}`;
    }
    if (typeof x === "object" && x !== null && "message" in x) {
      return String((x as { message: unknown }).message);
    }
    return String(x);
  };
  const msg = collect(e);
  return /fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|getaddrinfo|network/i.test(
    msg,
  );
}

/** True when public anon reads should use Supabase instead of local mocks. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}

/**
 * Home / sectors: use DB when Supabase env is set (even if the wire is empty).
 * Only use mock articles when the project has no public Supabase credentials.
 */
export async function getPublishedPreviewsForPublicSite(): Promise<ArticlePreview[]> {
  if (!isSupabaseConfigured()) {
    return mockArticles;
  }
  return getPublishedPreviewsSafe();
}

/**
 * Article detail: DB first when configured; mocks only without Supabase.
 */
export async function getArticleForPublicSite(slug: string): Promise<Article | null> {
  const fromDb = await getArticleBySlugSafe(slug);
  if (fromDb) return fromDb;
  if (!isSupabaseConfigured()) {
    return getArticleById(slug) ?? null;
  }
  return null;
}

/** `generateStaticParams`: mock slugs offline; DB slugs when Supabase is configured. */
export async function listPublishedSlugsForStaticGeneration(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return getAllArticleIds();
  }
  return listPublishedSlugsSafe();
}

export async function listPublishedPreviews(
  client: SupabaseClient,
): Promise<ArticlePreview[]> {
  const { data, error } = await client
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) throw error;
  return (data as ArticleRow[]).map(rowToArticlePreview);
}

export async function listPublishedSlugs(client: SupabaseClient): Promise<string[]> {
  const { data, error } = await client
    .from("articles")
    .select("slug")
    .eq("status", "published");

  if (error) throw error;
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

export async function getArticleBySlug(
  client: SupabaseClient,
  slug: string,
): Promise<Article | null> {
  const { data, error } = await client
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return rowToArticle(data as ArticleRow);
}

export async function getPublishedPreviewsSafe(): Promise<ArticlePreview[]> {
  try {
    const client = createSupabaseAnonClient();
    return listPublishedPreviews(client);
  } catch (e) {
    if (isMissingEnv(e)) return [];
    if (isSupabaseConnectionError(e)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[articles] Supabase unreachable; home feed empty.", e);
      }
      return [];
    }
    throw e;
  }
}

export async function getArticleBySlugSafe(slug: string): Promise<Article | null> {
  try {
    const client = createSupabaseAnonClient();
    return getArticleBySlug(client, slug);
  } catch (e) {
    if (isMissingEnv(e)) return null;
    if (isSupabaseConnectionError(e)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[articles] Supabase unreachable; article not loaded.", e);
      }
      return null;
    }
    throw e;
  }
}

export async function listPublishedSlugsSafe(): Promise<string[]> {
  try {
    const client = createSupabaseAnonClient();
    return listPublishedSlugs(client);
  } catch (e) {
    if (isMissingEnv(e)) return [];
    if (isSupabaseConnectionError(e)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[articles] Supabase unreachable; no DB slugs.", e);
      }
      return [];
    }
    throw e;
  }
}

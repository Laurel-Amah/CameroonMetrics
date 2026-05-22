import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/article/ArticleDetail";
import {
  getArticleForPublicSite,
  getPublishedPreviewsForPublicSite,
  listPublishedSlugsForStaticGeneration,
} from "@/lib/db/articles";
import { pickRelatedArticles } from "@/lib/related-articles";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await listPublishedSlugsForStaticGeneration();
  return slugs.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleForPublicSite(id);
  if (!article) {
    return { title: "Article not found · CameroonMetrics" };
  }
  return {
    title: `${article.title} · CameroonMetrics`,
    description: article.preview,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const [article, previews] = await Promise.all([
    getArticleForPublicSite(id),
    getPublishedPreviewsForPublicSite(),
  ]);
  if (!article) {
    notFound();
  }
  const related = pickRelatedArticles(article, previews);
  return <ArticleDetail article={article} related={related} />;
}

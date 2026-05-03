import { notFound } from "next/navigation";
import { DraftEditorForm } from "@/components/admin/DraftEditorForm";
import type { ArticleRow } from "@/lib/db/article-row";
import { rowToDraftEditorInitial } from "@/lib/db/draft-editor-state";
import { createSupabaseServerClientNullable } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminDraftEditorPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClientNullable();
  if (!supabase) {
    return (
      <p className="text-sm text-ink-muted">
        Supabase is not configured. Add environment variables in{" "}
        <code className="font-mono text-ink">.env.local</code> to load this draft.
      </p>
    );
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const initial = rowToDraftEditorInitial(data as ArticleRow);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
          Review draft
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Adjust the story, verify every source field, then publish. Public URLs
          use the slug as <span className="font-mono text-ink">/article/slug</span>.
        </p>
      </div>
      <DraftEditorForm initial={initial} />
    </div>
  );
}

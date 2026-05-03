import Link from "next/link";
import { createSupabaseServerClientNullable } from "@/lib/supabase/server";

export default async function AdminDraftsListPage() {
  const supabase = await createSupabaseServerClientNullable();
  if (!supabase) {
    return (
      <p className="text-sm text-ink-muted">
        Supabase is not configured. Add{" "}
        <code className="font-mono text-ink">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="font-mono text-ink">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
        to <code className="font-mono text-ink">.env.local</code>, then restart the
        dev server.
      </p>
    );
  }
  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, status, updated_at")
    .order("updated_at", { ascending: false })
    .limit(60);

  if (error) {
    return (
      <p className="text-sm text-red-600">
        Could not load drafts: {error.message}
      </p>
    );
  }

  const rows = data ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            Drafts and published
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-muted">
            Open a row to review, edit source credits, and publish to the live
            site.
          </p>
        </div>
        <Link
          href="/admin/drafts/new"
          className="inline-flex w-fit items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-muted"
        >
          New from link or text
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-brand/30 bg-brand-soft/40 px-5 py-10 text-center text-sm text-ink-muted">
          No articles yet. Run the SQL seed or create a draft from a URL.
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-xl border border-line bg-surface/95 shadow-card">
          {rows.map((row) => (
            <li key={row.id as string}>
              <Link
                href={`/admin/drafts/${row.id as string}`}
                className="flex flex-col gap-1 px-4 py-4 transition hover:bg-brand-soft/40 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{row.title as string}</p>
                  <p className="text-xs text-ink-muted">
                    <span className="font-mono">{row.slug as string}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-xs font-semibold uppercase tracking-wide">
                  <span
                    className={
                      row.status === "published"
                        ? "text-emerald-700"
                        : "text-amber-800"
                    }
                  >
                    {row.status as string}
                  </span>
                  <span className="tabular-nums text-ink-subtle">
                    {new Date(row.updated_at as string).toLocaleString()}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

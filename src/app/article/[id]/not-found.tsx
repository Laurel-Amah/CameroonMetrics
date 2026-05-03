import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6 sm:py-28">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-subtle">
        CameroonMetrics
      </p>
      <h1 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Article not found
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">
        That story is not in the mock catalogue. Return home to browse the
        briefing list.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/15 hover:bg-surface-card"
      >
        ← Back to Home
      </Link>
    </div>
  );
}

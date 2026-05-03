import Link from "next/link";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-soft text-ink">
      <div className="border-b border-line bg-surface/95 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-subtle">
              Editor
            </p>
            <Link
              href="/admin/drafts"
              className="font-serif text-lg font-semibold text-brand hover:text-brand-muted"
            >
              CameroonMetrics Admin
            </Link>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-ink-muted hover:text-ink"
          >
            View site
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</div>
    </div>
  );
}

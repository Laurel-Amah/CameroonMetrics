import Link from "next/link";

export function ArticleBackLink() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface-card px-3.5 py-2 text-sm font-semibold text-ink-muted shadow-sm ring-1 ring-line/70 transition-all duration-300 ease-refined hover:border-brand/30 hover:bg-surface hover:text-ink"
    >
      <span
        className="text-base font-normal leading-none text-accent transition-transform duration-300 ease-refined group-hover:-translate-x-0.5 group-hover:text-brand"
        aria-hidden
      >
        ←
      </span>
      Back to Home
    </Link>
  );
}

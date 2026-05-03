import Link from "next/link";
import { PrimaryNav } from "@/components/layout/PrimaryNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/92 shadow-header backdrop-blur-md backdrop-saturate-100">
      <div
        className="h-px w-full bg-brand/15"
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-6xl flex-row items-center justify-between gap-4 px-4 py-3.5 sm:gap-6 sm:px-6 sm:py-4 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 shrink flex-col gap-0.5 rounded-md outline-none ring-brand/0 transition-[box-shadow,ring] duration-300 ease-refined focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft"
        >
          <span className="font-serif text-lg font-semibold tracking-tight sm:text-xl">
            <span className="text-brand transition-colors duration-300 ease-refined group-hover:text-brand-muted">
              Cameroon
            </span>
            <span className="text-ink transition-colors duration-300 ease-refined group-hover:text-brand">
              Metrics
            </span>
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-ink-subtle sm:text-[11px]">
            <span className="text-brand/85">Cameroon</span>
            <span className="mx-1.5 text-brand/50" aria-hidden>
              ·
            </span>
            <span className="text-ink-subtle">Regional markets</span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
          <PrimaryNav />
        </div>
      </div>
    </header>
  );
}

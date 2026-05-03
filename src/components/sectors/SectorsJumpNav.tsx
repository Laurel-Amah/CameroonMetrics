import Link from "next/link";
import { SECTOR_DEFINITIONS } from "@/data/sector-definitions";

export function SectorsJumpNav() {
  return (
    <nav
      aria-label="Sectors on this page"
      className="-mx-4 mb-10 border-b border-brand/15 px-4 pb-6 sm:mx-0 sm:px-0"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-subtle">
        Jump to
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {SECTOR_DEFINITIONS.map((s) => (
          <li key={s.id}>
            <Link
              href={`#${s.id}`}
              className="inline-flex rounded-full border border-line bg-surface/90 px-3 py-1 text-xs font-semibold text-ink-muted shadow-sm ring-1 ring-line/70 transition-colors hover:border-brand/25 hover:text-ink"
            >
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

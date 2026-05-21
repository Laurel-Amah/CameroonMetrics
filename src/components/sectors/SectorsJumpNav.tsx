import Link from "next/link";
import { SECTOR_DEFINITIONS } from "@/data/sector-definitions";
import { sectorAccentClass } from "@/lib/sector-styles";

export function SectorsJumpNav() {
  return (
    <nav
      aria-label="Sectors on this page"
      className="-mx-4 mb-10 border-b border-brand/15 px-4 pb-6 sm:mx-0 sm:px-0"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-700">
        Jump to
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {SECTOR_DEFINITIONS.map((s) => (
          <li key={s.id}>
            <Link
              href={`#${s.id}`}
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold shadow-sm transition-colors ${sectorAccentClass[s.id].chip}`}
            >
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

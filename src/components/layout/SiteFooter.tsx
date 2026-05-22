"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FOOTER_LEGAL_LINES,
  FOOTER_TAGLINE,
  SITE_NAME,
} from "@/content/site-legal";

const FOOTER_LINKS = [
  { href: "/markets", label: "Markets" },
  { href: "/sectors", label: "Sectors" },
] as const;

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-surface/95">
      <div
        className="h-px w-full bg-gradient-to-r from-transparent via-brand/25 to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <div>
            <Link
              href="/"
              className="font-serif text-lg font-semibold tracking-tight text-ink transition-colors hover:text-brand"
            >
              <span className="text-brand">{SITE_NAME.slice(0, 8)}</span>
              <span>{SITE_NAME.slice(8)}</span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
              {FOOTER_TAGLINE}
            </p>
            <ul className="mt-4 max-w-xl list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-ink-subtle">
              {FOOTER_LEGAL_LINES.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-subtle">
              Explore
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm font-semibold text-ink-muted transition-colors hover:text-brand"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line/80 pt-6 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-ink-subtle/90">
            Indicative market data · Not for trading decisions
          </p>
        </div>
      </div>
    </footer>
  );
}

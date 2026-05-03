"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/markets", label: "Markets" },
  { href: "/sectors", label: "Sectors" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClass(active: boolean) {
  return `rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition-all duration-300 ease-refined focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft sm:px-4 sm:py-1.5 sm:text-sm ${
    active
      ? "border-brand/30 bg-brand/10 text-ink ring-1 ring-brand/15"
      : "border-line bg-surface/90 text-ink-muted ring-1 ring-line/80 hover:border-brand/25 hover:bg-surface-card hover:text-ink"
  }`;
}

export function PrimaryNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <nav
        className="hidden w-full items-center justify-end gap-1.5 md:flex md:w-auto md:justify-start"
        aria-label="Primary"
      >
        {LINKS.map(({ href, label }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={navLinkClass(active)}
              aria-current={active ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-end md:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface/95 text-ink shadow-sm ring-1 ring-line/80 transition hover:border-brand/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft"
          aria-expanded={open}
          aria-controls="site-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="sr-only">{open ? "Close" : "Menu"}</span>
          {open ? (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[100] md:hidden"
          id="site-mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <nav
            className="absolute right-0 top-0 flex h-full min-w-[min(18rem,100%)] flex-col gap-1 border-l border-line bg-surface/98 p-4 shadow-2xl"
            aria-label="Primary mobile"
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-subtle">
              Menu
            </p>
            {LINKS.map(({ href, label }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`${navLinkClass(active)} w-full text-center sm:text-left`}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </>
  );
}

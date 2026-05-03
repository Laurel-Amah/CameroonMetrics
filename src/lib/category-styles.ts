import type { ArticleCategory } from "@/types/article";

/** Pill styles for category labels on cards and in the UI */
export const categoryTagClass: Record<ArticleCategory, string> = {
  Markets:
    "border-slate-200 bg-slate-100/90 text-slate-800 ring-1 ring-inset ring-slate-400/15",
  Policy:
    "border-indigo-200 bg-indigo-50 text-indigo-900 ring-1 ring-inset ring-indigo-400/15",
  Energy:
    "border-amber-200 bg-amber-50 text-amber-950 ring-1 ring-inset ring-amber-400/15",
  Banking:
    "border-sky-200 bg-sky-50 text-sky-950 ring-1 ring-inset ring-sky-400/15",
  Trade:
    "border-emerald-200 bg-emerald-50 text-emerald-950 ring-1 ring-inset ring-emerald-400/15",
  Tech: "border-violet-200 bg-violet-50 text-violet-950 ring-1 ring-inset ring-violet-400/15",
};

/** Top border color on lead cards (mobile) */
export const categoryTopBorderClass: Record<ArticleCategory, string> = {
  Markets: "border-t-slate-500",
  Policy: "border-t-indigo-500",
  Energy: "border-t-amber-600",
  Banking: "border-t-sky-500",
  Trade: "border-t-emerald-600",
  Tech: "border-t-violet-500",
};

/** Vertical stripe on lead cards (desktop) */
export const categoryStripeBgClass: Record<ArticleCategory, string> = {
  Markets: "bg-slate-500",
  Policy: "bg-indigo-500",
  Energy: "bg-amber-600",
  Banking: "bg-sky-500",
  Trade: "bg-emerald-600",
  Tech: "bg-violet-500",
};

/** Inactive filter chip dot */
export const categoryDotClass: Record<ArticleCategory, string> = {
  Markets: "bg-slate-400",
  Policy: "bg-indigo-400",
  Energy: "bg-amber-500",
  Banking: "bg-sky-400",
  Trade: "bg-emerald-500",
  Tech: "bg-violet-400",
};

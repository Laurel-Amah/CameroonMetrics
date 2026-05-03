function parseArticleDay(isoDate: string): Date {
  return new Date(isoDate + "T12:00:00");
}

function startOfLocalDay(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

export function formatArticleDate(isoDate: string): string {
  const d = parseArticleDay(isoDate);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** Relative phrasing for feed cards, e.g. "2 days ago" (calendar days). */
export function formatRelativeArticleDate(
  isoDate: string,
  now: Date = new Date(),
): string {
  const pub = parseArticleDay(isoDate);
  const diffDays = Math.round(
    (startOfLocalDay(now) - startOfLocalDay(pub)) / 86_400_000,
  );

  if (diffDays < 0) return formatArticleDate(isoDate);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 60) {
    const w = Math.floor(diffDays / 7);
    return `${w} weeks ago`;
  }
  if (diffDays < 365) {
    const m = Math.floor(diffDays / 30);
    return m <= 1 ? "1 month ago" : `${m} months ago`;
  }
  return formatArticleDate(isoDate);
}

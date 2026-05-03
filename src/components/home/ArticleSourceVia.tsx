import type { ArticleSource } from "@/types/article";

type Props = {
  source?: ArticleSource;
  className?: string;
};

export function ArticleSourceVia({ source, className = "" }: Props) {
  const name = source?.name?.trim();
  if (!name) return null;
  return (
    <p
      className={`text-[11px] font-medium uppercase tracking-[0.12em] text-ink-subtle ${className}`.trim()}
    >
      Via {name}
    </p>
  );
}

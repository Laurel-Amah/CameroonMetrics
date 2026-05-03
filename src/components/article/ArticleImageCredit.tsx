import type { ArticleSource } from "@/types/article";

type Props = {
  imageSrc: string;
  source?: ArticleSource;
};

export function ArticleImageCredit({ imageSrc, source }: Props) {
  const isLocal = imageSrc.startsWith("/");
  const isSupabase = imageSrc.includes(".supabase.co/storage");
  const isRemote = imageSrc.startsWith("http");

  let caption: string;
  if (isLocal) {
    caption = "Desk illustration · CameroonMetrics";
  } else if (isSupabase) {
    caption = "Uploaded illustration · CameroonMetrics";
  } else if (isRemote && source?.name?.trim()) {
    caption = `Image via ${source.name.trim()}`;
  } else if (isRemote) {
    caption = "Image via original source";
  } else {
    caption = "CameroonMetrics";
  }

  return (
    <figcaption className="mt-3 text-xs font-medium leading-snug text-ink-subtle">
      {caption}
    </figcaption>
  );
}

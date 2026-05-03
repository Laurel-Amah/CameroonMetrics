import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
};

export function ArticleCardImage({
  src,
  alt,
  fill,
  className,
  priority,
}: Props) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes="(max-width: 1024px) 100vw, 40vw"
        unoptimized
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={640}
      height={400}
      className={className}
      sizes="(max-width: 640px) 100vw, 33vw"
      unoptimized
      priority={priority}
    />
  );
}

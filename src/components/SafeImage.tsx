"use client";

import Image, { ImageProps } from "next/image";

type Props = Omit<ImageProps, "src"> & { src?: string | null | undefined };

export default function SafeImage({ src, alt, ...rest }: Props) {
  // No url? render nothing
  if (!src) return null;

  // For local images or already proxied ones, use them directly
  if (src.startsWith('/') || src.startsWith('data:')) {
    return <Image src={src} alt={alt || "image"} {...rest} />;
  }

  const proxied = `/api/image?url=${encodeURIComponent(src)}`;
  return (
    <Image
      src={proxied}
      alt={alt || "image"}
      {...rest}
      onError={(e) => {
        // optional: hide if broken
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

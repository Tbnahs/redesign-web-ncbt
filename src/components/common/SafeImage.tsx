import type { ImgHTMLAttributes, SyntheticEvent } from "react";

export type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export function SafeImage({
  src,
  fallbackSrc = "/images/news-placeholder.svg",
  onError,
  alt = "",
  ...props
}: SafeImageProps) {
  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;
    const nextSrc = target.dataset['fallbackApplied'] === "true" ? undefined : fallbackSrc;

    if (!nextSrc) {
      onError?.(event);
      return;
    }

    target.dataset['fallbackApplied'] = "true";
    target.src = nextSrc;
    target.onerror = null;
    onError?.(event);
  };

  return <img {...props} src={src || fallbackSrc} alt={alt} onError={handleError} />;
}

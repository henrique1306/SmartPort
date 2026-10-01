import { useState, type ReactNode } from "react";
import { Camera } from "lucide-react";

export function SafeImage({
  src,
  alt,
  className,
  fallback,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <>{fallback ?? <Camera className="h-6 w-6 text-muted-foreground" aria-label={alt} />}</>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

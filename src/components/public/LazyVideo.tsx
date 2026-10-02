"use client";

import { useEffect, useRef, useState } from "react";

type LazyVideoProps = {
  src: string;
  poster: string;
  className?: string;
};

// Muted looping decorative video that downloads nothing — not even its
// poster — until it scrolls near the viewport, and only plays while visible.
export default function LazyVideo({ src, poster, className }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      autoPlay={near}
      preload={near ? "auto" : "none"}
      poster={near ? poster : undefined}
      src={near ? src : undefined}
      aria-hidden="true"
    />
  );
}

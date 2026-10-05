"use client";

import { useEffect, useRef, useState } from "react";

type LazyVideoProps = {
  src: string;
  poster: string;
  className?: string;
  // Lighter cut for phones, chosen with <source media> (matches --breakpoint-mm-sm).
  mobileSrc?: string;
  // For a video that starts on screen: show the poster from the first paint.
  eagerPoster?: boolean;
};

// Muted looping decorative video that downloads nothing — not even its
// poster, unless `eagerPoster` — until it scrolls near the viewport, and only
// plays while visible.
export default function LazyVideo({
  src,
  poster,
  className,
  mobileSrc,
  eagerPoster = false,
}: LazyVideoProps) {
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
      poster={near || eagerPoster ? poster : undefined}
      src={near && !mobileSrc ? src : undefined}
      aria-hidden="true"
    >
      {near && mobileSrc ? (
        <>
          <source media="(max-width: 620px)" src={mobileSrc} type="video/mp4" />
          <source src={src} type="video/mp4" />
        </>
      ) : null}
    </video>
  );
}

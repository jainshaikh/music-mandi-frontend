"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Marks every `[data-pause-offscreen]` element with `data-offscreen` while
// it's out of view; public-base.css pauses CSS animations inside it then.
// Infinite marquees and spins otherwise keep forcing a style recalculation
// every frame even when nobody can see them (QA BUG-03). Re-scans on route
// change because each page brings its own animated sections.
export default function PauseOffscreenAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting);
      }
    });
    document
      .querySelectorAll("[data-pause-offscreen]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

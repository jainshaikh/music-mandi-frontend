"use client";

import { useEffect } from "react";
import Lenis from "lenis";
// Required, not cosmetic: the root layout pins <html> to `h-full`, so without
// this sheet's `html.lenis { height: auto }` Lenis never notices the page
// getting taller (client-side navigation, FAQ toggles) and clamps the wheel
// to the old height — the page "jumps back up" and can't scroll further.
import "lenis/dist/lenis.css";

// Mounted once in the (public) layout. Adds eased/momentum scrolling on top
// of the existing native scroll-behavior:smooth (which still handles anchor
// jumps). Skipped entirely for prefers-reduced-motion.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      stopInertiaOnNavigate: true,
    });

    let raf = 0;
    function loop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}

"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  // Custom cursor + hover-grow + magnetic buttons.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer:coarse)").matches) return; // touch devices keep the native cursor
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const root = document.documentElement;
    root.classList.add("mm-cursor-active");

    let mx = innerWidth / 2;
    let my = innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    // Positioned with `transform` (composited) rather than left/top, and the
    // ring's easing loop stops once it has caught up — it used to run and
    // trigger a style + layout pass every frame forever (QA BUG-03).
    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const follow = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (Math.abs(mx - rx) < 0.5 && Math.abs(my - ry) < 0.5) {
        rx = mx;
        ry = my;
        raf = 0;
      } else {
        raf = requestAnimationFrame(follow);
      }
      place(ring, rx, ry);
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      place(cursor, mx, my);
      if (!raf) raf = requestAnimationFrame(follow);
    };
    addEventListener("pointermove", onMove);
    place(cursor, mx, my);
    place(ring, rx, ry);

    // `#dashboard` is matched by literal DOM id here, not through Tailwind
    // classes — this is a raw closest() check, so it must match the literal
    // marker on the DOM (DashboardMock's `id="dashboard"` in
    // OnePlatformSection).
    const onOver = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement)?.closest?.(
          "a,button:not(:disabled),#dashboard",
        )
      ) {
        cursor.style.width = "44px";
        cursor.style.height = "44px";
      }
    };
    const onOut = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement)?.closest?.(
          "a,button:not(:disabled),#dashboard",
        )
      ) {
        cursor.style.width = "14px";
        cursor.style.height = "14px";
      }
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    // Magnetic buttons.
    let lastBtn: HTMLElement | null = null;
    const onBtnMove = (e: PointerEvent) => {
      const btn = (e.target as HTMLElement)?.closest?.(
        ".btn",
      ) as HTMLElement | null;
      if (btn) {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.08}px,${
          (e.clientY - r.top - r.height / 2) * 0.12
        }px)`;
        lastBtn = btn;
      } else if (lastBtn) {
        lastBtn.style.transform = "";
        lastBtn = null;
      }
    };
    document.addEventListener("pointermove", onBtnMove);

    return () => {
      removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("pointermove", onBtnMove);
      root.classList.remove("mm-cursor-active");
    };
  }, []);

  return (
    <>
      <div
        id="cursor"
        ref={cursorRef}
        className="mm-cursor-active:visible z-mm-cursor transition-mm-size max-mm-md:hidden pointer-events-none invisible fixed top-0 left-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference pointer-coarse:hidden"
      />
      <div
        id="ring"
        ref={ringRef}
        className="mm-cursor-active:visible z-mm-ring h-mm-xl w-mm-xl max-mm-md:hidden pointer-events-none invisible fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white mix-blend-difference pointer-coarse:hidden"
      />
    </>
  );
}

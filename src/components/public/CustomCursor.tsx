"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  // Custom cursor + hover-grow + magnetic buttons.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer:coarse)").matches) return; // touch devices keep the native cursor

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mx = innerWidth / 2;
    let my = innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
    };
    addEventListener("pointermove", onMove);

    function follow() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ring) {
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
      }
      raf = requestAnimationFrame(follow);
    }
    follow();

    // `.feature`/`#dashboard` are matched by literal DOM class/id here, not
    // through Tailwind classes — this is a raw querySelector-style check, so
    // it must match whatever literal marker is actually on the DOM (see
    // SystemsCarousel's `cursor-hover-target` class and DashboardMock's
    // `id="dashboard"`).
    const onOver = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement)?.closest?.(
          "a,button,.cursor-hover-target,#dashboard",
        )
      ) {
        cursor.style.width = "44px";
        cursor.style.height = "44px";
      }
    };
    const onOut = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement)?.closest?.(
          "a,button,.cursor-hover-target,#dashboard",
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
    };
  }, []);

  return (
    <>
      <div
        id="cursor"
        ref={cursorRef}
        className="pointer-coarse:hidden fixed left-0 top-0 z-mm-cursor h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white pointer-events-none mix-blend-difference transition-mm-size max-mm-md:hidden"
      />
      <div
        id="ring"
        ref={ringRef}
        className="pointer-coarse:hidden fixed left-0 top-0 z-mm-ring h-mm-xl w-mm-xl -translate-x-1/2 -translate-y-1/2 rounded-full border border-white pointer-events-none mix-blend-difference max-mm-md:hidden"
      />
    </>
  );
}

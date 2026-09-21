"use client";

import { useEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./Reveal.module.css";

// Ports the prototype's scroll-reveal behaviour (`.reveal` + IntersectionObserver
// that adds `.on`) to a small per-instance wrapper instead of one global observer.
export default function Reveal({
  as: Tag = "div",
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.on);
          io.unobserve(el);
        }
      },
      { threshold: 0.16 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as ElementType;
  return (
    <Component ref={ref} className={cn(styles.reveal, className)} {...rest}>
      {children}
    </Component>
  );
}

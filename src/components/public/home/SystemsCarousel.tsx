"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Reveal from "../Reveal";
import styles from "./SystemsCarousel.module.css";

const SYSTEMS = [
  {
    n: "01",
    title: "Release Manager",
    p: "Plan, schedule, and ship releases from a single dashboard.",
  },
  {
    n: "02",
    title: "Global Distribution",
    p: "Reach global DSPs through our distribution network.",
  },
  {
    n: "03",
    title: "Rights Registry",
    p: "Record every track, split, and contract in one place.",
  },
  {
    n: "04",
    title: "Royalty Splits",
    p: "Set collaborator shares once and keep payouts organized.",
  },
  {
    n: "05",
    title: "Live Analytics",
    p: "See streams, listeners, and geography in one view.",
  },
  {
    n: "06",
    title: "Fast Payouts",
    p: "Track balances and withdrawal history clearly.",
  },
  {
    n: "07",
    title: "Catalog Management",
    p: "Manage artists, releases, metadata, and assets together.",
  },
  {
    n: "08",
    title: "Playlist Pitching",
    p: "Prepare releases for editorial opportunities.",
  },
  {
    n: "09",
    title: "Tamasha Slots",
    p: "Pitch original music into the weekly Tamasha pipeline.",
  },
];

// Pinned horizontal scroll: the section reserves a tall vertical run, the
// inner viewport sticks to the top of the screen while it scrolls past, and
// the track's transform is driven directly off scroll progress (rAF-batched)
// so it inherits whatever easing the page's native/Lenis scroll already has,
// instead of fighting it with a second, separately-animated scroll system.
export default function SystemsCarousel() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const cardCount = track.children.length;
    let ticking = false;

    const update = () => {
      const start = section.offsetTop;
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.max(
        0,
        Math.min(1, (window.scrollY - start) / distance),
      );
      const maxX = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const x = maxX * progress;
      track.style.transform = `translate3d(${-x}px, 0, 0)`;

      // Map progress directly across all cards (rather than picking whichever
      // card sits closest to the current scroll offset) so every card gets a
      // turn as "active", including the last few that stay on screen together
      // once the track hits its max scroll.
      const active = Math.round(progress * (cardCount - 1));
      setActiveIndex((prev) => (prev === active ? prev : active));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      className={cn(styles.features, styles["compact-systems"])}
      ref={sectionRef}
    >
      <div className={styles["systems-sticky"]}>
        <div className={styles["section-title"]}>
          <div>
            <Reveal as="div" className="eyebrow">
              One account
            </Reveal>
            <h2>
              Nine Systems.
              <br />
              <span className="serif">One Release Flow.</span>
            </h2>
          </div>
        </div>
        <div className={styles["systems-viewport"]} ref={viewportRef}>
          <div
            className={styles["systems-track"]}
            id="systemsTrack"
            ref={trackRef}
          >
            {SYSTEMS.map((s, i) => (
              <article
                className={cn(
                  styles.feature,
                  styles["system-card"],
                  i === activeIndex && styles.active,
                  // Literal (non-module) marker: SiteChrome's custom-cursor
                  // grow effect matches DOM classes directly via closest(),
                  // outside the CSS Modules system.
                  "cursor-hover-target",
                )}
                key={s.n}
              >
                <div className={styles["feature-num"]}>{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.p}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

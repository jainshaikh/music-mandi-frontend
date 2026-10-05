"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Reveal from "../Reveal";

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
    let start = 0;
    let distance = 1;
    let maxX = 0;
    let step = 0;
    let centerOffset = 0;

    // Layout reads happen only when something resizes, not on every scroll
    // frame, and the scroll listener is attached only while the section is
    // on screen — it used to force a layout pass on every scroll anywhere on
    // the page (QA BUG-03).
    const measure = () => {
      start = section.offsetTop;
      distance = Math.max(1, section.offsetHeight - window.innerHeight);
      maxX = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const first = track.children[0] as HTMLElement;
      const second = track.children[1] as HTMLElement | undefined;
      step = second ? second.offsetLeft - first.offsetLeft : 0;
      centerOffset = (viewport.clientWidth - first.offsetWidth) / 2;
    };

    const update = () => {
      const progress = Math.max(
        0,
        Math.min(1, (window.scrollY - start) / distance),
      );
      const active = Math.round(progress * (cardCount - 1));
      // Snaps to the active card (centred where possible) instead of panning
      // continuously, which could leave the highlighted card half off-screen
      // (QA BUG-07); the track's CSS transition smooths each step.
      const x = Math.max(0, Math.min(maxX, active * step - centerOffset));
      track.style.transform = `translate3d(${-x}px, 0, 0)`;
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

    const resizeObserver = new ResizeObserver(() => {
      measure();
      update();
    });
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(viewport);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        window.removeEventListener("scroll", onScroll);
      }
      update();
    });
    visibilityObserver.observe(section);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-mm-navy relative z-10 h-[360vh]">
      <div className="px-mm-gutter sticky top-19 flex h-[calc(100svh-76px)] flex-col justify-center overflow-hidden py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <Reveal as="div" className="eyebrow">
            One account
          </Reveal>
          <Reveal
            as="h2"
            className="mt-4 text-4xl leading-none font-bold tracking-tighter text-balance text-white sm:text-7xl lg:text-8xl"
          >
            Nine Systems.
            <br />
            <span className="serif">One Release Flow.</span>
          </Reveal>
        </div>

        {/* Edge fade instead of a hard clip, so neighbouring cards read as a
            peek of what's next rather than as cut-off content. */}
        <div
          className="w-full overflow-hidden mask-[linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]"
          ref={viewportRef}
        >
          <div
            className="flex w-max gap-4 pb-2 transition-transform duration-500 ease-out will-change-transform"
            ref={trackRef}
          >
            {SYSTEMS.map((s, i) => (
              <article
                key={s.n}
                // Informational only — no hover arrow or cursor-grow, which
                // advertised a click that does nothing (QA BUG-07).
                className={cn(
                  // 80vw below sm so a 320px screen still shows a whole card
                  // plus a peek of the next one; capped at the old 300px.
                  "relative min-h-60 w-[80vw] max-w-75 shrink-0 scale-95 overflow-hidden rounded-2xl border border-white/12 bg-slate-900 p-6 opacity-50 transition duration-500 ease-out sm:min-h-75 sm:w-100 sm:max-w-none sm:p-8 lg:w-115",
                  i === activeIndex &&
                    "from-mm-brand-1 to-mm-brand-2 scale-100 bg-linear-to-br opacity-100",
                )}
              >
                <span className="serif text-3xl text-white/80">{s.n}</span>
                <h3 className="mt-10 mb-3.5 text-2xl leading-none tracking-tighter text-white uppercase sm:mt-16 sm:text-4xl lg:text-5xl">
                  {s.title}
                </h3>
                <p className="max-w-xs text-sm text-slate-300">{s.p}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

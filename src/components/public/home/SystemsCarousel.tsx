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
    <section ref={sectionRef} className="bg-mm-navy relative z-10 h-[360vh]">
      <div className="px-mm-gutter sticky top-19 flex h-[calc(100svh-76px)] flex-col justify-center overflow-hidden py-8">
        <div className="mb-8">
          <Reveal as="div" className="eyebrow">
            One account
          </Reveal>
          <Reveal
            as="h2"
            className="mt-4 text-5xl leading-none font-bold tracking-tighter text-balance text-white sm:text-7xl lg:text-8xl"
          >
            Nine Systems.
            <br />
            <span className="serif">One Release Flow.</span>
          </Reveal>
        </div>

        <div className="w-full overflow-hidden" ref={viewportRef}>
          <div
            className="flex w-max gap-4 pb-2 will-change-transform"
            ref={trackRef}
          >
            {SYSTEMS.map((s, i) => (
              <article
                key={s.n}
                className={cn(
                  "group relative min-h-75 w-75 shrink-0 scale-95 overflow-hidden rounded-2xl border border-white/12 bg-slate-900 p-8 opacity-50 transition-all duration-500 ease-out sm:w-100 lg:w-115",
                  i === activeIndex &&
                    "from-mm-brand-1 to-mm-brand-2 scale-100 bg-linear-to-br opacity-100",
                  "cursor-hover-target",
                )}
              >
                <span className="serif text-3xl text-white/80">{s.n}</span>
                <h3 className="mt-16 mb-3.5 text-3xl leading-none tracking-tighter text-white uppercase sm:text-4xl lg:text-5xl">
                  {s.title}
                </h3>
                <p className="max-w-xs text-sm text-slate-300 group-hover:text-white">
                  {s.p}
                </p>
                <span className="absolute top-4 right-5 -translate-x-2 translate-y-2 text-xl opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100">
                  ↗
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

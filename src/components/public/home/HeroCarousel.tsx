"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SLIDE_COUNT = 3;
// Was 6500000 (~108 minutes) — a stray extra "000" meant the carousel
// effectively never auto-advanced. 6.5s matches the transition timing this
// component was designed around.
const AUTOPLAY_MS = 6500;

const VIDEOS = [
  "/assets/ReleaseTrackHeader.mp4",
  "/assets/TamashaMusicHeader.mp4",
  "/assets/TeleAddHeader.mp4",
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const show = (i: number) =>
    setActive(((i % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT);

  useEffect(() => {
    timerRef.current = setInterval(
      () => setActive((i) => (i + 1) % SLIDE_COUNT),
      AUTOPLAY_MS,
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active]);

  return (
    <section
      className="bg-mm-navy max-mm-sm:min-h-180 max-mm-sm:items-start relative flex h-screen min-h-170 items-center justify-center overflow-hidden text-white"
      id="home"
    >
      <div
        className="bg-mm-grid absolute inset-0 opacity-70"
        aria-hidden="true"
      />
      <div className="absolute inset-0" id="heroSlides">
        <article
          className={cn(
            "bg-mm-ink px-mm-gutter transition-mm-slide max-mm-md:pt-29.5 max-mm-sm:px-4.5 max-mm-sm:pt-27 max-mm-sm:pb-19.5 absolute inset-0 flex items-center overflow-hidden pt-32.5 pb-20",
            active === 0
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "translate-x-mm-slide-shift pointer-events-none opacity-0",
          )}
          data-slide="0"
        >
          <video
            ref={(el) => {
              videoRefs.current[0] = el;
            }}
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
            muted
            loop
            playsInline
            preload={active === 0 ? "auto" : "metadata"}
            aria-hidden="true"
            src={VIDEOS[0]}
          />
          <div className="bg-mm-hero-shade max-mm-sm:bg-mm-hero-shade-sm pointer-events-none absolute inset-0 z-1" />
          <div className="max-w-mm-hero-copy max-mm-md:max-w-mm-hero-copy-md max-mm-sm:max-w-mm-hero-copy-sm relative z-2">
            <h1 className="text-mm-hero leading-mm-hero tracking-mm-hero text-shadow-mm-hero max-mm-sm:text-mm-hero-mobile mt-3.5 mb-6">
              Release.
              <br />
              Track.{" "}
              <span className="from-mm-brand-1 to-mm-brand-2 pr-mm-hero-pad inline-block bg-linear-to-r bg-clip-text text-transparent">
                Get
              </span>
              <br />
              <span className="from-mm-brand-1 to-mm-brand-2 pr-mm-hero-pad inline-block bg-linear-to-r bg-clip-text text-transparent">
                Paid.
              </span>
            </h1>
            <div className="mt-mm-lg flex flex-wrap gap-2.5">
              <Link className="btn fill" href="/artists/submit">
                Submit Your Music
              </Link>
            </div>
          </div>
        </article>

        <article
          className={cn(
            "bg-mm-ink px-mm-gutter transition-mm-slide max-mm-md:pt-29.5 max-mm-sm:px-4.5 max-mm-sm:pt-27 max-mm-sm:pb-19.5 absolute inset-0 flex items-center overflow-hidden pt-32.5 pb-20",
            active === 1
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "translate-x-mm-slide-shift pointer-events-none opacity-0",
          )}
          data-slide="1"
        >
          <video
            ref={(el) => {
              videoRefs.current[1] = el;
            }}
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
            muted
            loop
            playsInline
            preload={active === 1 ? "auto" : "metadata"}
            aria-hidden="true"
            src={VIDEOS[1]}
          />
          <div className="bg-mm-hero-shade max-mm-sm:bg-mm-hero-shade-sm pointer-events-none absolute inset-0 z-1" />
          <div className="max-w-mm-hero-copy max-mm-md:max-w-mm-hero-copy-md max-mm-sm:max-w-mm-hero-copy-sm relative z-2">
            <h1 className="text-mm-hero leading-mm-hero tracking-mm-hero text-shadow-mm-hero max-mm-sm:text-mm-hero-mobile mt-3.5 mb-6">
              Tamasha. <br />
              Music.{" "}
              <span className="from-mm-brand-1 to-mm-brand-2 pr-mm-hero-pad inline-block bg-linear-to-r bg-clip-text text-transparent">
                A New
              </span>
              <br />
              <span className="from-mm-brand-1 to-mm-brand-2 pr-mm-hero-pad inline-block bg-linear-to-r bg-clip-text text-transparent">
                Record Every
              </span>
              <br />
              <span className="from-mm-brand-1 to-mm-brand-2 pr-mm-hero-pad inline-block bg-linear-to-r bg-clip-text text-transparent">
                Week.
              </span>
            </h1>
          </div>
        </article>

        <article
          className={cn(
            "bg-mm-ink px-mm-gutter transition-mm-slide max-mm-md:pt-29.5 max-mm-sm:px-4.5 max-mm-sm:pt-27 max-mm-sm:pb-19.5 absolute inset-0 flex items-center overflow-hidden pt-32.5 pb-20",
            active === 2
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "translate-x-mm-slide-shift pointer-events-none opacity-0",
          )}
          data-slide="2"
        >
          <video
            ref={(el) => {
              videoRefs.current[2] = el;
            }}
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
            muted
            loop
            playsInline
            preload={active === 2 ? "auto" : "metadata"}
            aria-hidden="true"
            src={VIDEOS[2]}
          />
          <div className="bg-mm-hero-shade max-mm-sm:bg-mm-hero-shade-sm pointer-events-none absolute inset-0 z-1" />
          <div className="max-w-mm-hero-copy max-mm-md:max-w-mm-hero-copy-md max-mm-sm:max-w-mm-hero-copy-sm relative z-2">
            <h1 className="text-mm-hero leading-mm-hero tracking-mm-hero text-shadow-mm-hero max-mm-sm:text-mm-hero-mobile mt-3.5 mb-6">
              TELE ADs.
              <span className="from-mm-brand-1 to-mm-brand-2 pr-mm-hero-pad inline-block bg-linear-to-r bg-clip-text text-transparent">
                {" "}
                Own the Seconds Before Hello.
              </span>
            </h1>
            <div className="mt-mm-lg flex flex-wrap gap-2.5">
              <Link className="btn fill" href="/tele-ads/create">
                Create a Campaign
              </Link>
            </div>
          </div>
        </article>
      </div>

      <div className="right-mm-gutter left-mm-gutter bottom-mm-lg absolute z-8 flex items-center justify-end gap-3.5">
        <button
          className="bg-mm-hero-btn h-mm-chrome-top-sm w-mm-chrome-top-sm rounded-full border border-white/20 text-white"
          id="heroPrev"
          aria-label="Previous banner"
          onClick={() => show(active - 1)}
        >
          &larr;
        </button>
        <div className="gap-mm-2xs flex">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <button
              key={i}
              className={cn(
                "bg-mm-dot h-2 w-2 rounded-full border-0 p-0 text-white",
                active === i &&
                  "rounded-mm-pill from-mm-brand-1 to-mm-brand-2 w-7 bg-linear-to-r",
              )}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => show(i)}
            />
          ))}
        </div>
        <button
          className="bg-mm-hero-btn h-mm-chrome-top-sm w-mm-chrome-top-sm rounded-full border border-white/20 text-white"
          id="heroNext"
          aria-label="Next banner"
          onClick={() => show(active + 1)}
        >
          &rarr;
        </button>
      </div>
    </section>
  );
}

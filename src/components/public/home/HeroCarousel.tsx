"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SLIDE_COUNT = 3;
const AUTOPLAY_MS = 6500;

// Each name has -desktop/-mobile .mp4 + .webp (poster) variants in
// public/assets. The mobile cut is a portrait center crop — the same region
// `object-cover` shows on a phone anyway — so phones download far fewer bytes.
const SLIDE_MEDIA = ["release-track", "tamasha-music", "tele-ads"];
// Matches --breakpoint-mm-sm.
const MOBILE_MEDIA = "(max-width: 620px)";

// `top-px`, not `inset-0`: Chrome skips media that exactly fills the viewport
// as an LCP candidate (treats it as a background), so the slide-1 poster
// never counted and an off-screen slide's video later became the "LCP"
// instead. The 1px strip sits under the opaque announcement bar/nav.
const MEDIA_CLASS =
  "pointer-events-none absolute inset-x-0 top-px z-0 h-full w-full object-cover object-center";

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  // Video waits for window `load` so it never competes with the HTML/CSS/JS
  // and the slide-1 poster for bandwidth — on slow connections that
  // contention is what kept the page unusable for tens of seconds.
  const [videoReady, setVideoReady] = useState(false);
  // Slides whose media has started loading stay mounted, so switching back
  // never re-downloads. A slide loads when it becomes active, or early once
  // the slide before it can play through.
  const [loaded, setLoaded] = useState<boolean[]>([false, false, false]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const show = (i: number) =>
    setActive(((i % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT);

  const markLoaded = useCallback((i: number) => {
    if (i >= SLIDE_COUNT) return;
    setLoaded((prev) => (prev[i] ? prev : prev.map((v, j) => v || j === i)));
  }, []);

  useEffect(() => {
    const start = () => setVideoReady(true);
    if (document.readyState === "complete") {
      const id = setTimeout(start, 0);
      return () => clearTimeout(id);
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

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
  }, [active, videoReady, loaded]);

  const renderMedia = (i: number) => {
    const name = SLIDE_MEDIA[i];
    const mounted = loaded[i] || i === active;
    return (
      <>
        {(i === 0 || mounted) && (
          <picture>
            <source
              media={MOBILE_MEDIA}
              srcSet={`/assets/${name}-mobile.webp`}
            />
            <img
              className={MEDIA_CLASS}
              src={`/assets/${name}-desktop.webp`}
              alt=""
              fetchPriority={i === 0 ? "high" : "low"}
            />
          </picture>
        )}
        {videoReady && mounted && (
          <video
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            className={MEDIA_CLASS}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onCanPlayThrough={() => {
              markLoaded(i);
              markLoaded(i + 1);
            }}
          >
            <source
              media={MOBILE_MEDIA}
              src={`/assets/${name}-mobile.mp4`}
              type="video/mp4"
            />
            <source src={`/assets/${name}-desktop.mp4`} type="video/mp4" />
          </video>
        )}
      </>
    );
  };

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
          {renderMedia(0)}
          <div className="bg-mm-hero-shade max-mm-sm:bg-mm-hero-shade-sm pointer-events-none absolute inset-0 z-1" />
          <div className="max-w-mm-hero-copy max-mm-md:max-w-mm-hero-copy-md max-mm-sm:max-w-mm-hero-copy-sm relative z-2">
            <h1 className="text-mm-hero leading-mm-hero tracking-mm-hero text-shadow-mm-hero max-mm-sm:text-mm-hero-mobile mt-3.5 mb-6 font-bold">
              Release.
              <br />
              Track.{" "}
              <span className="from-mm-brand-1 to-mm-brand-2 pr-mm-hero-pad inline-block bg-linear-to-r bg-clip-text font-bold text-transparent">
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
          {renderMedia(1)}
          <div className="bg-mm-hero-shade max-mm-sm:bg-mm-hero-shade-sm pointer-events-none absolute inset-0 z-1" />
          <div className="max-w-mm-hero-copy max-mm-md:max-w-mm-hero-copy-md max-mm-sm:max-w-mm-hero-copy-sm relative z-2">
            <h1 className="text-mm-hero leading-mm-hero tracking-mm-hero text-shadow-mm-hero max-mm-sm:text-mm-hero-mobile mt-3.5 mb-6 font-bold">
              Tamasha. <br />
              Music.{" "}
              <span className="from-mm-brand-1 to-mm-brand-2 pr-mm-hero-pad inline-block bg-linear-to-r bg-clip-text font-bold text-transparent">
                A New
              </span>
              <br />
              <span className="from-mm-brand-1 to-mm-brand-2 pr-mm-hero-pad inline-block bg-linear-to-r bg-clip-text text-transparent">
                Record Every
              </span>
              <br />
              <span className="from-mm-brand-1 to-mm-brand-2 pr-mm-hero-pad inline-block bg-linear-to-r bg-clip-text font-bold text-transparent">
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
          {renderMedia(2)}
          <div className="bg-mm-hero-shade max-mm-sm:bg-mm-hero-shade-sm pointer-events-none absolute inset-0 z-1" />
          <div className="max-w-mm-hero-copy max-mm-md:max-w-mm-hero-copy-md max-mm-sm:max-w-mm-hero-copy-sm relative z-2">
            <h1 className="text-mm-hero leading-mm-hero tracking-mm-hero text-shadow-mm-hero max-mm-sm:text-mm-hero-mobile mt-3.5 mb-6 font-bold">
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

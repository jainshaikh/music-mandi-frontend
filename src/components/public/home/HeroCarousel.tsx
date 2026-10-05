"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SLIDE_COUNT = 3;
const AUTOPLAY_MS = 6500;

// Each name has -desktop (1280w) and -640 .mp4 + .webp (poster) variants in
// public/assets. Phones get the lighter 640w cut, shown whole as a 16:9 band.
const SLIDE_MEDIA = ["release-track", "tamasha-music", "tele-ads"];
// Same range as Tailwind's `max-mm-sm:` (width < --breakpoint-mm-sm), so the
// 640w media and the stacked phone layout always switch together.
const MOBILE_MEDIA = "(max-width: 619.98px)";

// Desktop: the media fills the slide behind the copy. `top-px`, not
// `inset-0`: Chrome skips media that exactly fills the viewport as an LCP
// candidate (treats it as a background), so the slide-1 poster never counted
// and an off-screen slide's video later became the "LCP" instead; the 1px
// strip sits under the opaque announcement bar/nav.
// Phones (≤620px): a full-width 16:9 band above the copy. A full-screen
// `object-cover` of these 16:9 collages showed only the middle ~26% of the
// frame on a phone, cutting people off at both edges (QA BUG-13).
const MEDIA_FRAME_CLASS =
  "pointer-events-none absolute inset-x-0 top-px z-0 h-full max-mm-sm:relative max-mm-sm:top-0 max-mm-sm:aspect-video max-mm-sm:h-auto";
const MEDIA_CLASS = "absolute inset-0 h-full w-full object-cover object-center";

const SLIDE_CLASS =
  "bg-mm-ink px-mm-gutter transition-mm-slide max-mm-md:pt-29.5 absolute inset-0 flex items-center overflow-hidden pt-32.5 pb-20 max-mm-sm:relative max-mm-sm:inset-auto max-mm-sm:col-start-1 max-mm-sm:row-start-1 max-mm-sm:flex-col max-mm-sm:items-stretch max-mm-sm:px-0 max-mm-sm:pt-25 max-mm-sm:pb-0";

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
  // Autoplay and the active video only run while the hero is on screen and
  // the tab is visible (QA BUG-03).
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const playing = inView && pageVisible;
  const sectionRef = useRef<HTMLElement | null>(null);
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
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(section);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () => setActive((i) => (i + 1) % SLIDE_COUNT),
      AUTOPLAY_MS,
    );
    return () => clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && playing) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active, videoReady, loaded, playing]);

  const renderMedia = (i: number) => {
    const name = SLIDE_MEDIA[i];
    const mounted = loaded[i] || i === active;
    return (
      <div className={MEDIA_FRAME_CLASS}>
        {(i === 0 || mounted) && (
          <picture>
            <source media={MOBILE_MEDIA} srcSet={`/assets/${name}-640.webp`} />
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
              src={`/assets/${name}-640.mp4`}
              type="video/mp4"
            />
            <source src={`/assets/${name}-desktop.mp4`} type="video/mp4" />
          </video>
        )}
        <div className="from-mm-ink max-mm-sm:block absolute inset-x-0 bottom-0 hidden h-1/3 bg-linear-to-t to-transparent" />
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="bg-mm-navy max-mm-sm:h-auto max-mm-sm:min-h-0 max-mm-sm:flex-col max-mm-sm:items-stretch relative flex h-screen min-h-170 items-center justify-center overflow-hidden text-white"
      id="home"
    >
      <div
        className="bg-mm-grid absolute inset-0 opacity-70"
        aria-hidden="true"
      />
      <div
        className="max-mm-sm:relative max-mm-sm:inset-auto max-mm-sm:grid absolute inset-0"
        id="heroSlides"
      >
        <article
          className={cn(
            SLIDE_CLASS,
            active === 0
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "translate-x-mm-slide-shift pointer-events-none opacity-0",
          )}
          data-slide="0"
        >
          {renderMedia(0)}
          <div className="bg-mm-hero-shade max-mm-sm:hidden pointer-events-none absolute inset-0 z-1" />
          <div className="max-w-mm-hero-copy max-mm-md:max-w-mm-hero-copy-md max-mm-sm:max-w-none max-mm-sm:px-4.5 max-mm-sm:pt-5 relative z-2">
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
            SLIDE_CLASS,
            active === 1
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "translate-x-mm-slide-shift pointer-events-none opacity-0",
          )}
          data-slide="1"
        >
          {renderMedia(1)}
          <div className="bg-mm-hero-shade max-mm-sm:hidden pointer-events-none absolute inset-0 z-1" />
          <div className="max-w-mm-hero-copy max-mm-md:max-w-mm-hero-copy-md max-mm-sm:max-w-none max-mm-sm:px-4.5 max-mm-sm:pt-5 relative z-2">
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
            SLIDE_CLASS,
            active === 2
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "translate-x-mm-slide-shift pointer-events-none opacity-0",
          )}
          data-slide="2"
        >
          {renderMedia(2)}
          <div className="bg-mm-hero-shade max-mm-sm:hidden pointer-events-none absolute inset-0 z-1" />
          <div className="max-w-mm-hero-copy max-mm-md:max-w-mm-hero-copy-md max-mm-sm:max-w-none max-mm-sm:px-4.5 max-mm-sm:pt-5 relative z-2">
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

      <div className="right-mm-gutter left-mm-gutter bottom-mm-lg max-mm-sm:relative max-mm-sm:inset-auto max-mm-sm:justify-start max-mm-sm:px-4.5 max-mm-sm:pt-5 max-mm-sm:pb-10 absolute z-8 flex items-center justify-end gap-3.5">
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

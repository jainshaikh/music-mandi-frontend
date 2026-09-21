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
      className="relative flex h-screen min-h-170 items-center justify-center overflow-hidden bg-(--mm-navy) text-white max-[620px]:min-h-180 max-[620px]:items-start"
      id="home"
    >
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,transparent,black_25%,black_70%,transparent)] bg-size-[54px_54px] opacity-70"
        aria-hidden="true"
      />
      <div className="absolute inset-0" id="heroSlides">
        <article
          className={cn(
            "absolute inset-0 flex items-center overflow-hidden bg-(--mm-ink) px-(--mm-pad) pt-32.5 pb-20 [transition:opacity_0.65s_ease,transform_0.8s_var(--mm-ease)] max-[950px]:pt-29.5 max-[620px]:px-4.5 max-[620px]:pt-27 max-[620px]:pb-19.5",
            active === 0
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "pointer-events-none translate-x-[4%] opacity-0",
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
          <div className="pointer-events-none absolute inset-0 z-1 bg-[linear-gradient(90deg,rgba(5,7,12,0.9)_0%,rgba(5,7,12,0.72)_36%,rgba(5,7,12,0.3)_67%,rgba(5,7,12,0.16)_100%),linear-gradient(180deg,rgba(5,7,12,0.34),rgba(5,7,12,0.22))] max-[620px]:bg-[linear-gradient(90deg,rgba(5,7,12,0.91),rgba(5,7,12,0.57)),linear-gradient(180deg,rgba(5,7,12,0.16),rgba(5,7,12,0.4))]" />
          <div className="relative z-2 max-w-[min(800px,58vw)] max-[950px]:max-w-[min(760px,78vw)] max-[620px]:max-w-[94vw]">
            <h1 className="mt-3.5 mb-6 text-[clamp(64px,8.6vw,142px)] leading-[0.82] tracking-[-0.075em] text-shadow-[0_4px_34px_rgba(0,0,0,0.38)] max-[620px]:text-[50vw]">
              Release.
              <br />
              Track.{" "}
              <span className="inline-block bg-linear-to-r from-(--mm-brand1) to-(--mm-brand2) bg-clip-text pr-[0.08em] text-transparent">
                Get
              </span>
              <br />
              <span className="inline-block bg-linear-to-r from-(--mm-brand1) to-(--mm-brand2) bg-clip-text pr-[0.08em] text-transparent">
                Paid.
              </span>
            </h1>
            <div className="mt-6.5 flex flex-wrap gap-2.5">
              <Link className="btn fill" href="/artists/submit">
                Submit Your Music
              </Link>
            </div>
          </div>
        </article>

        <article
          className={cn(
            "absolute inset-0 flex items-center overflow-hidden bg-(--mm-ink) px-(--mm-pad) pt-32.5 pb-20 [transition:opacity_0.65s_ease,transform_0.8s_var(--mm-ease)] max-[950px]:pt-29.5 max-[620px]:px-4.5 max-[620px]:pt-27 max-[620px]:pb-19.5",
            active === 1
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "pointer-events-none translate-x-[4%] opacity-0",
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
          <div className="pointer-events-none absolute inset-0 z-1 bg-[linear-gradient(90deg,rgba(5,7,12,0.9)_0%,rgba(5,7,12,0.72)_36%,rgba(5,7,12,0.3)_67%,rgba(5,7,12,0.16)_100%),linear-gradient(180deg,rgba(5,7,12,0.34),rgba(5,7,12,0.22))] max-[620px]:bg-[linear-gradient(90deg,rgba(5,7,12,0.91),rgba(5,7,12,0.57)),linear-gradient(180deg,rgba(5,7,12,0.16),rgba(5,7,12,0.4))]" />
          <div className="relative z-2 max-w-[min(800px,58vw)] max-[950px]:max-w-[min(760px,78vw)] max-[620px]:max-w-[94vw]">
            <h1 className="mt-3.5 mb-6 text-[clamp(64px,8.6vw,142px)] leading-[0.82] tracking-[-0.075em] text-shadow-[0_4px_34px_rgba(0,0,0,0.38)] max-[620px]:text-[15vw]">
              Tamasha. <br />
              Music.{" "}
              <span className="inline-block bg-linear-to-r from-(--mm-brand1) to-(--mm-brand2) bg-clip-text pr-[0.08em] text-transparent">
                A New
              </span>
              <br />
              <span className="inline-block bg-linear-to-r from-(--mm-brand1) to-(--mm-brand2) bg-clip-text pr-[0.08em] text-transparent">
                Record Every
              </span>
              <br />
              <span className="inline-block bg-linear-to-r from-(--mm-brand1) to-(--mm-brand2) bg-clip-text pr-[0.08em] text-transparent">
                Week.
              </span>
            </h1>
          </div>
        </article>

        <article
          className={cn(
            "absolute inset-0 flex items-center overflow-hidden bg-(--mm-ink) px-(--mm-pad) pt-32.5 pb-20 [transition:opacity_0.65s_ease,transform_0.8s_var(--mm-ease)] max-[950px]:pt-29.5 max-[620px]:px-4.5 max-[620px]:pt-27 max-[620px]:pb-19.5",
            active === 2
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "pointer-events-none translate-x-[4%] opacity-0",
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
          <div className="pointer-events-none absolute inset-0 z-1 bg-[linear-gradient(90deg,rgba(5,7,12,0.9)_0%,rgba(5,7,12,0.72)_36%,rgba(5,7,12,0.3)_67%,rgba(5,7,12,0.16)_100%),linear-gradient(180deg,rgba(5,7,12,0.34),rgba(5,7,12,0.22))] max-[620px]:bg-[linear-gradient(90deg,rgba(5,7,12,0.91),rgba(5,7,12,0.57)),linear-gradient(180deg,rgba(5,7,12,0.16),rgba(5,7,12,0.4))]" />
          <div className="relative z-2 max-w-[min(800px,58vw)] max-[950px]:max-w-[min(760px,78vw)] max-[620px]:max-w-[94vw]">
            <h1 className="mt-3.5 mb-6 text-[clamp(64px,8.6vw,142px)] leading-[0.82] tracking-[-0.075em] text-shadow-[0_4px_34px_rgba(0,0,0,0.38)] max-[620px]:text-[15vw]">
              TELE ADs.
              <span className="inline-block bg-linear-to-r from-(--mm-brand1) to-(--mm-brand2) bg-clip-text pr-[0.08em] text-transparent">
                {" "}
                Own the Seconds Before Hello.
              </span>
            </h1>
            <div className="mt-6.5 flex flex-wrap gap-2.5">
              <Link className="btn fill" href="/tele-ads/create">
                Create a Campaign
              </Link>
            </div>
          </div>
        </article>
      </div>

      <div className="absolute right-(--mm-pad) bottom-6.5 left-(--mm-pad) z-8 flex items-center justify-end gap-3.5">
        <button
          className="h-9.5 w-9.5 rounded-full border border-white/20 bg-[rgba(10,12,20,0.6)] text-white"
          id="heroPrev"
          aria-label="Previous banner"
          onClick={() => show(active - 1)}
        >
          &larr;
        </button>
        <div className="flex gap-1.75">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <button
              key={i}
              className={cn(
                "h-2 w-2 rounded-full border-0 bg-[#555] p-0 text-white",
                active === i &&
                  "w-7 rounded-[20px] bg-linear-to-r from-(--mm-brand1) to-(--mm-brand2)",
              )}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => show(i)}
            />
          ))}
        </div>
        <button
          className="h-9.5 w-9.5 rounded-full border border-white/20 bg-[rgba(10,12,20,0.6)] text-white"
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

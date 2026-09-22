"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// The 6th entry is U+00A0 (non-breaking space), not a regular space — a plain
// " " is the sole content of its span and collapses to zero width under
// normal CSS whitespace rules, which nbsp is specifically exempt from.
const LOADER_LETTERS = ["M", "U", "S", "I", "C", " ", "M", "A", "N", "D", "I"];

export default function SplashScreen() {
  const [pct, setPct] = useState(0);
  const [loaderOut, setLoaderOut] = useState(false);
  // Starts false so the entrance transition below has a real "before" state
  // to animate from (see the comment on the letter spans for why this can't
  // be a CSS @keyframes animation instead).
  const [risen, setRisen] = useState(false);

  useEffect(() => {
    let p = 0;
    const t = setInterval(() => {
      p = Math.min(100, p + Math.ceil(Math.random() * 8));
      setPct(p);
      if (p >= 100) {
        clearInterval(t);
        setTimeout(() => setLoaderOut(true), 250);
      }
    }, 65);
    // Fail-safe: never leave the site trapped behind the loader.
    const failSafe = setTimeout(() => setLoaderOut(true), 2600);
    return () => {
      clearInterval(t);
      clearTimeout(failSafe);
    };
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setRisen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      id="loader"
      aria-hidden={loaderOut}
      className={
        loaderOut
          ? "z-mm-loader grid-rows-mm-loader bg-mm-ink p-mm-gutter text-mm-paper ease-mm clip-mm-closed pointer-events-none fixed inset-0 grid transition-all duration-1200"
          : "z-mm-loader grid-rows-mm-loader bg-mm-ink p-mm-gutter text-mm-paper ease-mm clip-mm-open fixed inset-0 grid transition-all duration-1200"
      }
    >
      {/*
        `content-center` matters here, not just `place-items-center`: this
        grid sits in the loader's own "1fr" row (see grid-rows-mm-loader),
        so it stretches tall. With only `place-items-center`, its two
        implicit auto rows (logo, wordmark) each individually stretch to
        fill half of that height — `align-content: normal` behaves like
        `stretch` for auto-sized tracks when there's leftover space — which
        centers the logo and the text far apart instead of packed together
        as one block. `content-center` packs both rows at their natural
        content size before centering the pair as a unit.
      */}
      <div className="grid place-items-center content-center gap-4">
        <Image
          className="w-mm-loader-logo drop-shadow-mm-logo h-auto bg-transparent!"
          src="/images/music-mandi-logo.png"
          alt="Music Mandi logo"
          width={121}
          height={97}
        />
        <div
          className="gap-mm-hair text-mm-loader leading-mm-loader tracking-mm-loader flex max-w-full font-black whitespace-nowrap"
          aria-label="MUSIC MANDI"
        >
          {/*
            No `overflow-hidden` on this row, deliberately — do not add it
            back. `leading-mm-loader` (line-height: 0.7) is tighter than
            this font's natural metrics, so each letter's rendered ink needs
            more vertical room than its line box (confirmed via scrollHeight
            exceeding clientHeight, by ~15px at mobile sizes and ~177px at
            this clamp's large desktop end, since the gap scales with
            font-size). `overflow-hidden` here clips that ink and makes the
            whole word disappear or lose its bottom — already found and
            fixed once before as a live bug report ("cuts from bottom").
            The surrounding `.loader-mark` grid has plenty of empty space
            above and below, so letting this row's ink overflow its own box
            is visually safe.

            Ported from a CSS @keyframes animation (`to { transform: none }`,
            fill-mode: forwards) — reverted after finding a real, reproducible
            rendering bug: the Web Animations API and getComputedStyle both
            confirmed the animation finished with `transform: none`, but the
            browser kept painting the letters at their pre-animation offset
            (translateY(120%), ~30-40px below their box). Confirmed by
            isolating each class in turn: removing just `animate-mm-rise`
            fixed it. A plain React state flip + CSS transition (a real
            style-to-style interpolation, not a fill-forwards keyframe hold)
            doesn't hit this bug — the settled state is an ordinary style
            recalculation. The progress bar fill below had the identical bug
            for the same reason.
          */}
          {LOADER_LETTERS.map((ch, i) => (
            <span
              key={`loader-letter-${i}`}
              className={cn(
                "ease-mm inline-block transition-transform duration-900",
                risen
                  ? "translate-y-0 rotate-0"
                  : "translate-y-mm-rise rotate-6",
              )}
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
      <div className="text-mm-11 tracking-mm-wide flex items-end justify-between uppercase">
        <span>
          Building the infrastructure for Pakistan&apos;s music economy
        </span>
        <div>
          <span id="pct">{String(pct).padStart(3, "0")}</span>%
          <div className="w-mm-3xl bg-mm-track mt-2 h-px overflow-hidden">
            <i
              className={cn(
                "bg-mm-paper ease-mm block h-full transition-transform duration-1700",
                risen ? "translate-x-0" : "-translate-x-full",
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

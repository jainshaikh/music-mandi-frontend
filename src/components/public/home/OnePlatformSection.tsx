"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef } from "react";
import Reveal from "@/components/public/Reveal";

function DashboardMock() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${7 - y * 5}deg) rotateY(${-8 + x * 7}deg)`;
    };
    const onLeave = () => {
      card.style.transform = "rotateX(7deg) rotateY(-8deg)";
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const metrics = [
    { label: "Total streams", value: "2.48M", note: "+18.4%" },
    { label: "Royalty balance", value: "PKR 684K", note: "Ready to withdraw" },
    { label: "Listeners", value: "918K", note: "63 countries" },
  ];

  const navItems = [
    "Overview",
    "Releases",
    "Catalog",
    "Analytics",
    "Royalties",
    "Payouts",
  ];

  const releases = [
    { title: "Shehr-e-Raat", streams: "864K", rights: "100%", status: "Live" },
    { title: "Jaane Do", streams: "412K", rights: "80%", status: "Live" },
  ];

  return (
    <div
      ref={wrapRef}
      className="relative mt-16 flex justify-center py-8 perspective-distant"
    >
      <div className="from-mm-brand-1 to-mm-brand-2 absolute top-8 -left-2 z-10 -rotate-6 rounded-full bg-linear-to-r px-4 py-2 text-xs font-semibold text-white shadow-lg sm:top-12 sm:left-4">
        100+ Platforms / Worldwide
      </div>

      <div
        ref={cardRef}
        id="dashboard"
        className="flex w-full max-w-5xl flex-col border border-white/10 bg-slate-900 text-white shadow-2xl transition-transform duration-200 sm:flex-row"
        style={{ transform: "rotateX(7deg) rotateY(-8deg)" }}
      >
        <aside className="hidden w-40 flex-col border-r border-white/10 p-5 sm:flex">
          <div className="mb-8">
            <Image
              src="/images/music-mandi-logo.png"
              alt="Music Mandi"
              width={40}
              height={40}
              className="size-10 rounded-full object-contain"
            />
          </div>
          {navItems.map((item) => (
            <div
              key={item}
              className="border-b border-white/10 py-2.5 text-xs tracking-wide uppercase"
            >
              {item}
            </div>
          ))}
        </aside>

        <div className="overflow-hidden p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold sm:text-2xl">
              Good evening, Areeb.
            </h3>
            <div className="hidden gap-2 sm:flex">
              <span className="rounded-full border border-white/30 px-3 py-1.5 text-xs uppercase">
                Last 30 days
              </span>
              <span className="rounded-full border border-white/30 px-3 py-1.5 text-xs uppercase">
                PKR
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="min-h-24 rounded-xl bg-white/5 p-4"
              >
                <span className="text-xs tracking-wide uppercase opacity-70">
                  {metric.label}
                </span>
                <b className="block text-xl sm:text-2xl">{metric.value}</b>
                <small className="text-xs opacity-70">{metric.note}</small>
              </div>
            ))}
          </div>

          <div className="relative mt-2.5 h-38 overflow-hidden rounded-lg border border-white/10 bg-linear-to-b from-pink-600/15 to-transparent sm:h-48">
            <svg
              viewBox="0 0 800 200"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <polyline
                points="0,155 65,145 130,158 195,105 260,126 325,75 390,96 455,52 520,74 585,38 650,62 715,20 800,42"
                fill="none"
                className="stroke-blue-500"
                strokeWidth="4"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <div className="mt-2.5 hidden grid-cols-5 border-t border-white/10 text-xs tracking-wide uppercase sm:grid">
            <div className="col-span-2 border-b border-white/10 py-2.5">
              Latest releases
            </div>
            <div className="border-b border-white/10 py-2.5">Streams</div>
            <div className="border-b border-white/10 py-2.5">Rights</div>
            <div className="border-b border-white/10 py-2.5">Status</div>
            {releases.map((release) => (
              <Fragment key={release.title}>
                <div className="col-span-2 border-b border-white/10 py-2.5">
                  {release.title}
                </div>
                <div className="border-b border-white/10 py-2.5">
                  {release.streams}
                </div>
                <div className="border-b border-white/10 py-2.5">
                  {release.rights}
                </div>
                <div className="border-b border-white/10 py-2.5">
                  {release.status}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-4 rotate-6 rounded-full bg-linear-to-r from-violet-600 to-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-lg sm:right-4">
        Royalties / Auditable
      </div>
    </div>
  );
}

export default function OnePlatformSection() {
  return (
    <section
      id="product"
      className="bg-mm-navy px-mm-gutter relative z-10 py-20 text-white sm:py-28"
    >
      <div className="grid gap-10 sm:grid-cols-2 sm:items-end sm:gap-12">
        <div>
          <Reveal as="div" className="eyebrow">
            One Platform
          </Reveal>
          <Reveal
            as="h2"
            className="mt-4 text-5xl leading-none font-bold text-balance sm:text-6xl lg:text-7xl"
          >
            Everything Your Release Needs,{" "}
            <span className="serif">In One Place</span>
          </Reveal>
        </div>
        <Reveal as="p" className="max-w-md text-lg text-slate-300 sm:text-xl">
          Distribution, rights, royalties, and analytics in one release
          workspace built for independent artists, growing labels, and rights
          holders.
        </Reveal>
      </div>

      <DashboardMock />
    </section>
  );
}

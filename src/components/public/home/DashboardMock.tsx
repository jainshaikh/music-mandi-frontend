"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./DashboardMock.module.css";

export default function DashboardMock() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const dashRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const dash = dashRef.current;
    if (!wrap || !dash) return;
    if (window.matchMedia("(pointer:coarse)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      dash.style.transform = `rotateX(${7 - y * 5}deg) rotateY(${-8 + x * 7}deg) translateY(${y * 8}px)`;
    };
    const onLeave = () => {
      dash.style.transform = "rotateX(7deg) rotateY(-8deg)";
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className={styles["dash-wrap"]} ref={wrapRef}>
      <div className={cn(styles["float-tag"], styles.tag1)}>
        100+ Platforms / Worldwide
      </div>
      <div className={styles.dashboard} id="dashboard" ref={dashRef}>
        <aside className={styles.side}>
          <div className={styles["logo-mini"]}>
            <Image
              src="/images/music-mandi-logo.png"
              alt="Music Mandi"
              width={48}
              height={48}
            />
          </div>
          <div>Overview</div>
          <div>Releases</div>
          <div>Catalog</div>
          <div>Analytics</div>
          <div>Royalties</div>
          <div>Payouts</div>
        </aside>
        <div className={styles["dash-main"]}>
          <div className={styles["dash-top"]}>
            <h3>Good evening, Areeb.</h3>
            <div className={styles.chips}>
              <span className={styles.chip}>Last 30 days</span>
              <span className={styles.chip}>PKR</span>
            </div>
          </div>
          <div className={styles["metric-row"]}>
            <div className={styles.metric}>
              <span>Total streams</span>
              <b>2.48M</b>
              <small>+18.4%</small>
            </div>
            <div className={styles.metric}>
              <span>Royalty balance</span>
              <b>PKR 684K</b>
              <small>Ready to withdraw</small>
            </div>
            <div className={styles.metric}>
              <span>Listeners</span>
              <b>918K</b>
              <small>63 countries</small>
            </div>
          </div>
          <div className={styles.chart}>
            <svg viewBox="0 0 800 200" preserveAspectRatio="none">
              <polyline
                points="0,155 65,145 130,158 195,105 260,126 325,75 390,96 455,52 520,74 585,38 650,62 715,20 800,42"
                fill="none"
                stroke="#3157ff"
                strokeWidth="4"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <div className={styles["release-list"]}>
            <div>Latest releases</div>
            <div>Streams</div>
            <div>Rights</div>
            <div>Status</div>
            <div>Shehr-e-Raat</div>
            <div>864K</div>
            <div>100%</div>
            <div>Live</div>
            <div>Jaane Do</div>
            <div>412K</div>
            <div>80%</div>
            <div>Live</div>
          </div>
        </div>
      </div>
      <div className={cn(styles["float-tag"], styles.tag2)}>
        Royalties / Auditable
      </div>
    </div>
  );
}

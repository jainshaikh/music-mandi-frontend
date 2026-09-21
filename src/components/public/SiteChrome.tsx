"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import styles from "./SiteChrome.module.css";

// The 6th entry is U+00A0 (non-breaking space), not a regular space — a plain
// " " is the sole content of its span and collapses to zero width under
// normal CSS whitespace rules, which nbsp is specifically exempt from.
const LOADER_LETTERS = ["M", "U", "S", "I", "C", " ", "M", "A", "N", "D", "I"];

const ANN_KEY = "mmAnnDismissed";
const ANN_EVENT = "mm-ann-dismissed-change";

// Synced with localStorage via useSyncExternalStore (rather than reading it
// inside an effect and calling setState) so React handles the server/client
// snapshot difference the way it's designed to for this exact pattern.
function subscribeAnnouncement(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(ANN_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(ANN_EVENT, callback);
  };
}
function getAnnouncementSnapshot() {
  try {
    return localStorage.getItem(ANN_KEY) !== null;
  } catch {
    return false;
  }
}
function getAnnouncementServerSnapshot() {
  return false;
}

export default function SiteChrome() {
  const [pct, setPct] = useState(0);
  const [loaderOut, setLoaderOut] = useState(false);
  const announcementHidden = useSyncExternalStore(
    subscribeAnnouncement,
    getAnnouncementSnapshot,
    getAnnouncementServerSnapshot,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navCompact, setNavCompact] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  // Loader progress (ported from the prototype's IIFE).
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

  const closeAnnouncement = () => {
    try {
      localStorage.setItem(ANN_KEY, String(Date.now()));
      window.dispatchEvent(new Event(ANN_EVENT));
    } catch {
      // ignore
    }
  };

  // Custom cursor + hover-grow + magnetic buttons + nav-compact-on-scroll.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer:coarse)").matches) return; // touch devices keep the native cursor

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mx = innerWidth / 2;
    let my = innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
    };
    addEventListener("pointermove", onMove);

    function follow() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ring) {
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
      }
      raf = requestAnimationFrame(follow);
    }
    follow();

    // `.feature`/`#dashboard` are matched by literal DOM class/id here, not
    // through the CSS Modules `styles` object — CSS Modules only scopes what
    // it exports, not raw querySelector-style strings, so these must match
    // whatever literal marker is actually on the DOM (see SystemsCarousel's
    // `cursor-hover-target` class and DashboardMock's `id="dashboard"`).
    const onOver = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement)?.closest?.(
          "a,button,.cursor-hover-target,#dashboard",
        )
      ) {
        cursor.style.width = "44px";
        cursor.style.height = "44px";
      }
    };
    const onOut = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement)?.closest?.(
          "a,button,.cursor-hover-target,#dashboard",
        )
      ) {
        cursor.style.width = "14px";
        cursor.style.height = "14px";
      }
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    // Magnetic buttons.
    let lastBtn: HTMLElement | null = null;
    const onBtnMove = (e: PointerEvent) => {
      const btn = (e.target as HTMLElement)?.closest?.(
        ".btn",
      ) as HTMLElement | null;
      if (btn) {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.08}px,${
          (e.clientY - r.top - r.height / 2) * 0.12
        }px)`;
        lastBtn = btn;
      } else if (lastBtn) {
        lastBtn.style.transform = "";
        lastBtn = null;
      }
    };
    document.addEventListener("pointermove", onBtnMove);

    return () => {
      removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("pointermove", onBtnMove);
    };
  }, []);

  // Nav compact state past 80px scroll.
  useEffect(() => {
    const onScroll = () => setNavCompact(scrollY > 80);
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", mobileOpen);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  // Ported from the prototype's role-selection modal (`#roleModal`), opened
  // by the nav's `#loginOpen` link via the global click handler. There is no
  // real auth behind either choice — this just routes to the matching
  // UI-only demo login screen.
  const openRoleModal = () => {
    setRoleModalOpen(true);
    closeMobile();
  };
  const closeRoleModal = () => setRoleModalOpen(false);

  return (
    <>
      <div id="cursor" ref={cursorRef}></div>
      <div id="ring" ref={ringRef}></div>

      <div
        className={cn(styles.loader, loaderOut && styles.out)}
        id="loader"
        aria-hidden={loaderOut}
      >
        <div className={styles["loader-mark"]}>
          <Image
            className={styles["loader-logo"]}
            src="/images/music-mandi-logo.png"
            alt="Music Mandi logo"
            width={121}
            height={97}
          />
          <div className={styles["loader-word"]} aria-label="MUSIC MANDI">
            {LOADER_LETTERS.map((ch, i) => (
              <span
                key={`loader-letter-${i}`}
                style={{ "--i": i } as React.CSSProperties}
              >
                {ch}
              </span>
            ))}
          </div>
        </div>
        <div className={styles["loader-foot"]}>
          <span>
            Building the infrastructure for Pakistan&apos;s music economy
          </span>
          <div>
            <span id="pct">{String(pct).padStart(3, "0")}</span>%
            <div className={styles.prog}>
              <i></i>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(styles.announcement, announcementHidden && styles.hide)}
        id="announcement"
      >
        <span>
          <Image
            className={styles["tm-mini"]}
            src="/images/music-mandi-logo.png"
            alt="Music Mandi"
            width={121}
            height={97}
          />
          <b>NEW</b>. Tamasha Music is live. New release every week.{" "}
          <Link href="/#tamasha-launch">Watch &rarr;</Link>
        </span>
        <button
          id="closeAnn"
          onClick={closeAnnouncement}
          aria-label="Dismiss announcement"
        >
          &times;
        </button>
      </div>

      <nav className={cn(styles.nav, navCompact && styles.compact)} id="nav">
        <Link className={styles.brand} href="/">
          <Image
            src="/images/music-mandi-logo.png"
            alt="Music Mandi logo"
            width={250}
            height={250}
          />
          <span>Music Mandi</span>
        </Link>
        <div className={styles.navlinks}>
          <Link href="/tele-ads">TELE ADs</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact Us</Link>
        </div>
        <div className={styles["nav-actions"]}>
          {/* <button
            type="button"
            className={styles["nav-login-btn"]}
            id="loginOpen"
            onClick={openRoleModal}
          >
            Log in
          </button> */}
          <Link href="/artists/submit" className="btn light">
            Submit Music
          </Link>
        </div>
        <button
          className={styles.hamb}
          id="hamb"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Open menu"
        >
          &#9776;
        </button>
      </nav>

      <div
        className={cn(styles["mobile-menu"], mobileOpen && styles.on)}
        id="mobileMenu"
      >
        <Link href="/tele-ads" onClick={closeMobile}>
          TELE ADs
        </Link>
        <Link href="/about" onClick={closeMobile}>
          About
        </Link>
        <Link href="/contact" onClick={closeMobile}>
          Contact Us
        </Link>
        <Link
          href="/artists/submit"
          className="btn light"
          onClick={closeMobile}
        >
          Submit Music
        </Link>
        {/* The prototype's #mobileLogin had no click handler wired at all (a
            small dead-end bug in the source). Wiring it to the same role
            modal as the desktop nav's #loginOpen for a coherent UX. */}
        <button
          type="button"
          className={styles["mobile-login-btn"]}
          id="mobileLogin"
          onClick={openRoleModal}
        >
          Log in
        </button>
      </div>

      <div
        className={cn("flow-modal", roleModalOpen && "on")}
        id="roleModal"
        aria-hidden={!roleModalOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeRoleModal();
        }}
      >
        <div className="flow-modal-card">
          <button
            className="modal-x"
            data-close-modal
            onClick={closeRoleModal}
            aria-label="Close"
          >
            &times;
          </button>
          <span className="route-kicker">Log in</span>
          <h3>Choose your workspace</h3>
          <Link
            className={styles["choice-card"]}
            href="/login"
            onClick={closeRoleModal}
          >
            <b>I&apos;m an artist or label</b>
            <span>Manage releases, catalog, rights and royalties.</span>
          </Link>
          <Link
            className={styles["choice-card"]}
            href="/tele-ads/login"
            onClick={closeRoleModal}
          >
            <b>I&apos;m an advertiser</b>
            <span>Manage TELE ADs campaigns, billing and performance.</span>
          </Link>
        </div>
      </div>
    </>
  );
}

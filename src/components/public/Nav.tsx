"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navCompact, setNavCompact] = useState(false);

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

  return (
    <>
      <nav
        id="nav"
        className={cn(
          "mm-nav z-mm-nav tracking-mm-wide backdrop-blur-mm-nav transition-mm-nav fixed inset-x-0 grid items-center border-b border-white/8 text-xs text-white uppercase mix-blend-normal",
          "grid-cols-mm-nav max-mm-lg:grid-cols-mm-nav-tight max-mm-md:grid-cols-mm-nav-compact",
          "top-mm-chrome-top px-mm-gutter max-mm-sm:top-mm-chrome-top-sm max-mm-sm:px-4 max-mm-sm:py-2.5",
          navCompact ? "bg-mm-ink/0 py-2.5" : "bg-mm-ink/50 py-3.5",
        )}
      >
        <Link
          className="max-mm-sm:gap-2 flex items-center gap-2.5 whitespace-nowrap normal-case no-underline"
          href="/"
        >
          <Image
            className="max-mm-md:size-mm-xl max-mm-sm:size-10 size-12 rounded-full object-contain"
            src="/images/music-mandi-logo.png"
            alt="Music Mandi logo"
            width={250}
            height={250}
          />
          <span className="text-lg font-bold">Music Mandi</span>
        </Link>
        <div className="gap-mm-navlinks max-mm-lg:justify-center max-mm-lg:gap-2 max-mm-md:hidden flex items-center">
          <Link
            className="text-mm-9! max-mm-lg:text-mm-8! px-1 py-2.5 whitespace-nowrap no-underline"
            href="/tele-ads"
          >
            TELE ADs
          </Link>
          <Link
            className="text-mm-9! max-mm-lg:text-mm-8! px-1 py-2.5 whitespace-nowrap no-underline"
            href="/about"
          >
            About
          </Link>
          <Link
            className="text-mm-9! max-mm-lg:text-mm-8! px-1 py-2.5 whitespace-nowrap no-underline"
            href="/contact"
          >
            Contact Us
          </Link>
        </div>
        <div className="max-mm-lg:gap-mm-2xs max-mm-md:hidden flex items-center gap-2.5 justify-self-end whitespace-nowrap">
          <Link
            href="/artists/submit"
            className="btn light from-mm-brand-1! to-mm-brand-2! shadow-mm-cta max-mm-lg:px-3! max-mm-lg:py-2.5! border-0! bg-linear-to-r! text-white!"
          >
            Submit Music
          </Link>
        </div>
        <button
          className="max-mm-md:block hidden border-0 bg-transparent text-lg!"
          id="hamb"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Open menu"
        >
          &#9776;
        </button>
      </nav>

      <div
        id="mobileMenu"
        className={cn(
          "z-mm-menu bg-mm-ink px-mm-gutter pb-mm-gutter pt-mm-2xl text-mm-paper max-mm-md:flex max-mm-md:overflow-x-hidden max-mm-md:overflow-y-auto fixed inset-0 hidden h-dvh max-h-dvh flex-col overflow-hidden",
          mobileOpen
            ? "transition-mm-menu-open pointer-events-auto visible translate-y-0 opacity-100"
            : "-translate-y-mm-menu-hide transition-mm-menu-closed pointer-events-none invisible opacity-0",
        )}
      >
        <Link
          className="border-mm-hairline text-mm-mobile-link! tracking-mm-menu border-b py-2.5 leading-none! font-extrabold! uppercase no-underline"
          href="/tele-ads"
          onClick={closeMobile}
        >
          TELE ADs
        </Link>
        <Link
          className="border-mm-hairline text-mm-mobile-link! tracking-mm-menu border-b py-2.5 leading-none! font-extrabold! uppercase no-underline"
          href="/about"
          onClick={closeMobile}
        >
          About
        </Link>
        <Link
          className="border-mm-hairline text-mm-mobile-link! tracking-mm-menu border-b py-2.5 leading-none! font-extrabold! uppercase no-underline"
          href="/contact"
          onClick={closeMobile}
        >
          Contact Us
        </Link>
        <Link
          href="/artists/submit"
          className="btn light mt-auto text-xs!"
          onClick={closeMobile}
        >
          Submit Music
        </Link>
      </div>
    </>
  );
}

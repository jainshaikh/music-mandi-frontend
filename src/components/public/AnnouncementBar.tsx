"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const ANN_KEY = "mmAnnDismissed";
const ANN_EVENT = "mm-ann-dismissed-change";

// Synced with localStorage via useSyncExternalStore (rather than reading it
// inside an effect and calling setState) so React handles the server/client
// snapshot difference the way it's designed to for this exact pattern.
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(ANN_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(ANN_EVENT, callback);
  };
}
function getSnapshot() {
  try {
    return localStorage.getItem(ANN_KEY) !== null;
  } catch {
    return false;
  }
}
function getServerSnapshot() {
  return false;
}

export default function AnnouncementBar() {
  const hidden = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const close = () => {
    try {
      localStorage.setItem(ANN_KEY, String(Date.now()));
      window.dispatchEvent(new Event(ANN_EVENT));
    } catch {
      // ignore
    }
  };

  return (
    <div
      id="announcement"
      className={cn(
        // `mm-announcement`/`mm-hide` are literal marker classes, not
        // Tailwind utilities — Nav reacts to this bar being dismissed via a
        // plain sibling-selector CSS rule (see PublicChrome.theme.css),
        // rather than the two components sharing any JS state.
        "mm-announcement fixed inset-x-0 top-0 z-mm-announcement flex h-mm-chrome-top items-center justify-center gap-2.5 bg-linear-to-r from-mm-brand-1 via-mm-brand-2 to-mm-brand-3 text-mm-11 font-bold text-white transition-transform duration-450 ease-mm",
        "max-mm-sm:h-mm-chrome-top-sm max-mm-sm:justify-start max-mm-sm:pl-3 max-mm-sm:pr-12 max-mm-sm:text-mm-9 max-mm-sm:leading-mm-tight",
        hidden && "mm-hide -translate-y-full",
      )}
    >
      <span className="flex flex-row items-center">
        <Image
          className="mr-2 h-mm-md w-auto object-contain align-middle max-mm-sm:h-mm-sm"
          src="/images/music-mandi-logo.png"
          alt="Music Mandi"
          width={121}
          height={97}
        />
        <b>NEW</b>. Tamasha Music is live. New release every week.{" "}
        {/*
          shared.css's `.mm-public a,button,input{font:inherit;color:inherit}`
          is a plain, unlayered rule that always wins over a same-property
          Tailwind utility (which lives in a lower-priority CSS layer)
          regardless of specificity — font-weight/color set directly on this
          anchor need `!` to actually apply.
        */}
        <Link
          className="border-0 font-extrabold! text-white!"
          href="/#tamasha-launch"
        >
          Watch &rarr;
        </Link>
      </span>
      <button
        id="closeAnn"
        onClick={close}
        aria-label="Dismiss announcement"
        className="absolute right-3 cursor-none border-0 bg-transparent text-mm-17! text-white!"
      >
        &times;
      </button>
    </div>
  );
}

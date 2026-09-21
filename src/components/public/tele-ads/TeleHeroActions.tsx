"use client";

import Link from "next/link";

// The source also wires up "See how" / "Hear a sample" buttons via
// useTeleAds(), but neither is actually rendered in the current markup —
// preserved as-is here (single "Create a Campaign" CTA only).
export default function TeleHeroActions() {
  return (
    <Link className="btn fill" href="/tele-ads/create">
      Create a Campaign
    </Link>
  );
}

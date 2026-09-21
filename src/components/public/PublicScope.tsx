"use client";

import { useEffect } from "react";

// Marks <body> as public-site territory so public-base.css's
// body.mm-public-body rules (legacy theme tokens, cursor:none, etc.) apply
// only while a public route is mounted, and never leak into artist/advertiser/
// admin pages that share the same <body>.
export default function PublicScope() {
  useEffect(() => {
    document.body.classList.add("mm-public-body");
    return () => document.body.classList.remove("mm-public-body");
  }, []);

  return null;
}

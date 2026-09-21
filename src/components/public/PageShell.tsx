import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// `.page-shell` is a plain global class (see shared.css) — main-mode
// marketing/route page wrapper. Pass `className` to layer a page-specific
// background (e.g. `tele-clean` for /tele-ads).
export default function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("page-shell", className)}>{children}</div>;
}

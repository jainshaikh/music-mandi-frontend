import "./public-base.css";
import "@/components/public/shared.css";
import PublicScope from "@/components/public/PublicScope";
import SmoothScroll from "@/components/public/SmoothScroll";
import SiteChrome from "@/components/public/SiteChrome";
import Footer from "@/components/public/Footer";
import Toast from "@/components/public/Toast";

// Wraps every public marketing route. `mm-public` is a literal global class
// (not a CSS Module) — public-base.css and shared.css key off it directly so
// the legacy design tokens/utilities stay scoped to this subtree only.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mm-public">
      <PublicScope />
      <SmoothScroll />
      <SiteChrome />
      <main>{children}</main>
      <Footer />
      <Toast />
    </div>
  );
}

import "./public-base.css";
import "@/components/public/shared.css";
import PublicScope from "@/components/public/PublicScope";
import SmoothScroll from "@/components/public/SmoothScroll";
import SplashScreen from "@/components/public/SplashScreen";
import AnnouncementBar from "@/components/public/AnnouncementBar";
import Nav from "@/components/public/Nav";
import CustomCursor from "@/components/public/CustomCursor";
import Footer from "@/components/public/Footer";
import Toast from "@/components/public/Toast";

// Wraps every public marketing route. `mm-public` is a literal global class
// (not a CSS Module) — public-base.css and shared.css key off it directly so
// the legacy design tokens/utilities stay scoped to this subtree only.
//
// AnnouncementBar and Nav must stay in this order (not alphabetized) — Nav
// reacts to the announcement bar being dismissed via a CSS sibling selector
// (see PublicChrome.theme.css), which only matches when AnnouncementBar is
// Nav's preceding sibling in the DOM.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mm-public">
      <PublicScope />
      <SmoothScroll />
      <SplashScreen />
      <AnnouncementBar />
      <Nav />
      <CustomCursor />
      <main>{children}</main>
      <Footer />
      <Toast />
    </div>
  );
}

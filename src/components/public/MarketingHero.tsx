import { ReactNode } from "react";
import RouteArt from "./RouteArt";

// Renders the page's single <h1> for every non-home marketing/route page.
// Every class here (page-wrap, route-hero2, route-kicker, route-actions) is
// a shared.css primitive reused across pages, so this component has no CSS
// Module of its own.
export default function MarketingHero({
  kicker,
  title,
  description,
  actions,
  art = true,
}: {
  kicker: string;
  title: ReactNode;
  description: string;
  actions?: ReactNode;
  art?: boolean;
}) {
  return (
    <div className="page-wrap">
      <section className="route-hero2">
        <div>
          <span className="route-kicker">{kicker}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          {actions ? <div className="route-actions">{actions}</div> : null}
        </div>
        {art ? <RouteArt /> : null}
      </section>
    </div>
  );
}

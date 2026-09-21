import type { Metadata } from "next";
import MarketingHero from "@/components/public/MarketingHero";
import ArtistSubmitForm from "@/components/public/forms/ArtistSubmitForm";

const TITLE = "Send Us Your Music";
const DESCRIPTION =
  "No fees, no gatekeepers. Our A&R team listens to everything.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/artists/submit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ArtistSubmitPage() {
  return (
    <div>
      <MarketingHero
        kicker="Artist submission"
        title={TITLE}
        description={DESCRIPTION}
      />
      <div className="page-wrap">
        <section className="content-section">
          <ArtistSubmitForm />
        </section>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import PageShell from "@/components/public/PageShell";
import ContactForm from "@/components/public/forms/ContactForm";
import styles from "./page.module.css";

const TITLE = "Let's make the next move happen.";
const DESCRIPTION =
  "Whether you are releasing music, building a TELE Ads campaign, exploring a partnership, or contacting Music Mandi for press, start here and we will route you to the right team.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ContactPage() {
  return (
    <PageShell>
      <div className={cn(styles["contact-page"], "page-wrap")}>
        <section className={styles["contact-hero"]}>
          <div className={styles["contact-intro"]}>
            <h1>{TITLE}</h1>
            <p>{DESCRIPTION}</p>
          </div>
          <div className={styles["contact-form-shell"]}>
            <ContactForm />
          </div>
        </section>

        <section className={styles["contact-paths"]}>
          <article>
            <span>Artists &amp; Releases</span>
            <h3>Music distribution support</h3>
            <p>
              Questions about submissions, review status, contracts, release
              delivery, analytics, or revenue.
            </p>
            <Link href="/artists/submit">Submit Music &rarr;</Link>
          </article>
          <article>
            <span>TELE Ads</span>
            <h3>Campaign &amp; advertiser support</h3>
            <p>
              Creative, targeting, campaign review, billing, or media planning
              for TELE Ads.
            </p>
            <Link href="/tele-ads/create">Create Campaign &rarr;</Link>
          </article>
          <article>
            <span>General</span>
            <h3>Partnerships &amp; press</h3>
            <p>
              Business partnerships, press, collaborations, and general Music
              Mandi enquiries.
            </p>
            <a href="mailto:hello@musicmandi.com">hello@musicmandi.com</a>
          </article>
        </section>
      </div>
    </PageShell>
  );
}

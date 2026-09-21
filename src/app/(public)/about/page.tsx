import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import PageShell from "@/components/public/PageShell";
import RouteArt from "@/components/public/RouteArt";
import styles from "./page.module.css";

const TITLE = "Building the Music Industry Pakistan Should Have Had";
const DESCRIPTION =
  "A label, a rights business, and a platform built to give Pakistani artists global reach and a fair share of what they create.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function AboutPage() {
  return (
    <PageShell className={styles["about-page"]}>
      <section className="route-hero2">
        <div>
          <span className="route-kicker">About Music Mandi</span>
          <h1>{TITLE}</h1>
          <p>{DESCRIPTION}</p>
          <div className="route-actions">
            <Link className="btn fill" href="/artists/submit">
              Submit Your Music
            </Link>
          </div>
        </div>
        <RouteArt />
      </section>

      <section className="content-section">
        <span className="route-kicker">Why we exist</span>
        <h2>Talent Was Never the Issue</h2>
        <p className={styles["copy-wide"]}>
          Pakistani music has shaped culture far beyond its borders. Qawwali
          filled concert halls in Europe. New independent artists continue to
          move audiences across genres, languages, and regions. What has been
          missing is the infrastructure around the music.
        </p>
        <div className={styles["big-quote"]}>
          The talent has always been world class.{" "}
          <span className="brand-gradient">The infrastructure has not.</span>
        </div>
      </section>

      <section className={cn("content-section", styles["story-section"])}>
        <span className="route-kicker">Our story</span>
        <h2>The Story of Sound, Culture, and Connection</h2>
        <div className={styles["story-copy"]}>
          <p>
            For centuries, this land has sung in colour. The qawwali of Lahore.
            The pop of Karachi. Balochi rubab, Sindhi Sufi verse, Pashto rabab,
            Punjabi dhol. A country that has never once run short of sound.
          </p>
          <p className={styles.pull}>
            What it has run short of is everything around the sound.
          </p>
          <p>
            Records made in bedrooms and never released. Songs that travelled
            widely with nobody collecting on them. Artists signing agreements
            they could not properly track. Catalogs sitting unclaimed while the
            streams kept counting.
          </p>
          <p className={cn(styles.pull, "brand-gradient")}>
            Music Mandi was born to build that system.
          </p>
          <p>
            We are building the operating layer around Pakistani music:
            professional distribution, rights management, transparent royalty
            reporting, release infrastructure, artist development, and national
            amplification.
          </p>
        </div>
      </section>

      <section className="content-section">
        <span className="route-kicker">What we&apos;re building</span>
        <h2>A Real Industry, Not a Workaround</h2>
        <div className={styles["two-col-copy"]}>
          <p className={styles["copy-wide"]}>
            Music Mandi connects artists and labels to release planning, global
            distribution, rights management, analytics, catalog operations, and
            a clear administrative workflow.
          </p>
          <p className={styles["copy-wide"]}>
            The goal is not another upload form. It is a system that makes every
            release easier to manage from first submission to live DSP
            reporting.
          </p>
        </div>
        <div className={styles["info-grid"]}>
          <div className={styles["info-card"]}>
            <b>Mission</b>
            <p>
              Give Pakistani artists global reach, honest ownership, fair value,
              and stronger release infrastructure.
            </p>
          </div>
          <div className={styles["info-card"]}>
            <b>Vision</b>
            <p>
              A Pakistan that exports music with systems, standards, and scale
              built for a global market.
            </p>
          </div>
          <div className={styles["info-card"]}>
            <b>Fair rights</b>
            <p>
              Clear contracts, readable splits, auditable reporting, and
              ownership records that stay visible.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <span className="route-kicker">Partners</span>
        <h2>Global Reach. National Scale.</h2>
        <div className={styles["partner-cards"]}>
          <div className={styles["partner-card"]}>
            <Image
              className={styles["partner-card-logo"]}
              src="/silderlogo/SonyMusic.png"
              alt="Sony Music"
              width={250}
              height={233}
            />
            <span>Global distribution</span>
          </div>
          <div className={styles["partner-card"]}>
            <Image
              className={styles["partner-card-logo"]}
              src="/silderlogo/TamashaMusic.png"
              alt="Tamasha Music"
              width={197}
              height={75}
            />
            <span>Weekly original music platform</span>
          </div>
          <div className={styles["partner-card"]}>
            <Image
              className={styles["partner-card-logo"]}
              src="/silderlogo/Jazz.png"
              alt="Jazz"
              width={1080}
              height={1080}
            />
            <span>National promotion</span>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import HeroCarousel from "@/components/public/home/HeroCarousel";
import PartnerRunway from "@/components/public/home/PartnerRunway";
import DashboardMock from "@/components/public/home/DashboardMock";
import SystemsCarousel from "@/components/public/home/SystemsCarousel";
import DspMarquee from "@/components/public/home/DspMarquee";
import FaqAccordion from "@/components/public/FaqAccordion";
import Reveal from "@/components/public/Reveal";
import styles from "./page.module.css";

const TITLE = "Music Mandi. Release. Track. Get Paid.";
const DESCRIPTION =
  "The platform Pakistani artists and labels use to release music worldwide, manage their rights, and see every rupee they earn.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const FAQ_ITEMS = [
  {
    q: "Who owns my music?",
    a: "You do. Ownership terms are agreed clearly before release.",
  },
  {
    q: "Where does my music go?",
    a: "Music Mandi prepares releases for a broad network of global DSPs and distribution destinations.",
  },
  { q: "Do I have to be signed?", a: "No. Submissions are open." },
  {
    q: "How do I get on Tamasha Music?",
    a: "Artists in the Music Mandi pipeline can be considered for the weekly Tamasha Music release route.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <PartnerRunway />

      <section className={styles.product} id="product">
        <div className={styles["product-head"]}>
          <div>
            <Reveal as="div" className="eyebrow">
              One Platform
            </Reveal>
            <Reveal as="h2">
              Everything Your Release Needs,{" "}
              <span className="serif">In One Place</span>
            </Reveal>
          </div>
          <Reveal as="p">
            Distribution, rights, royalties, and analytics in one release
            workspace built for independent artists, growing labels, and rights
            holders.
          </Reveal>
        </div>
        <DashboardMock />
      </section>

      <SystemsCarousel />
      <DspMarquee />

      <section className={styles.rights}>
        <div className={styles["rights-copy"]}>
          <Reveal as="div" className="eyebrow">
            Fair Rights, By Default
          </Reveal>
          <Reveal as="h2">
            You Keep What <span className="serif">You Own</span>
          </Reveal>
          <Reveal as="p">
            Splits agreed upfront. Ownership recorded in writing. Reporting you
            can audit line by line.
          </Reveal>
          <div className={styles["rights-list"]}>
            <Reveal as="div" className={styles["rights-item"]}>
              <b>01</b>
              <span>
                <strong>Clear contracts</strong>. plain language, no hidden
                transfers
              </span>
            </Reveal>
            <Reveal as="div" className={styles["rights-item"]}>
              <b>02</b>
              <span>
                <strong>Auditable statements</strong>. every stream, every
                platform, every rupee
              </span>
            </Reveal>
            <Reveal as="div" className={styles["rights-item"]}>
              <b>03</b>
              <span>
                <strong>Automatic splits</strong>. collaborators paid without
                you chasing anyone
              </span>
            </Reveal>
          </div>
        </div>
        <Reveal as="div" className={styles.orbit}>
          <div className={styles["orbit-ring"]}></div>
          <div className={styles["orbit-core"]}>
            Your rights
            <br />
            <span className="serif">stay yours.</span>
          </div>
        </Reveal>
      </section>

      <section
        className={cn(styles.tamasha, styles["tm-launch"])}
        id="tamasha-launch"
      >
        <div className={styles["tm-launch-grid"]}>
          <div className={styles["tm-launch-copy"]}>
            <div className="eyebrow">Music Mandi &times; Jazz</div>
            <div className={styles["tm-logo-wrap"]}>
              <Image
                src="/images/tamasha-music-logo.png"
                alt="Tamasha Music"
                width={197}
                height={75}
                about="Tamasha Music logo"
              />
            </div>
            <h2>Launching a weekly home for original Pakistani music.</h2>
          </div>
          <div
            className={cn(
              styles["tm-banner-frame"],
              styles["tm-banner-photo-frame"],
            )}
          >
            <Image
              className={styles["tm-banner-image"]}
              src="/images/tamasha-banner.jpg"
              alt="Tamasha Music artist campaign banner"
              width={2048}
              height={1152}
              sizes="100vw"
            />
          </div>
        </div>
      </section>

      <section
        className={cn(styles.tone, styles["tele-home"])}
        id="tele-ads-home"
      >
        <div className={styles["tone-card"]}>
          <div className={styles["tone-copy"]}>
            <Reveal as="div" className="eyebrow">
              A service by Music Mandi
            </Reveal>
            <Reveal as="h2">
              TELE <span className="serif">ADs</span>
            </Reveal>
            <Reveal as="p">
              Turn the connection window of a phone call into an audio
              placement, then follow it with an SMS & WhatsApp that can drive
              action.
            </Reveal>
            <div className={styles["gap-12"]}>
              <Link className="btn light" href="/tele-ads">
                Explore TELE ADs
              </Link>

              <Link className="btn fill" href="/tele-ads/create">
                Create a Campaign
              </Link>
            </div>
          </div>
          <div
            className={cn(
              styles["phone-scene"],
              styles["tele-brand-scene"],
              styles["tele-video-box"],
            )}
          >
            <video
              className={styles["tele-section-video"]}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              src="/assets/TeleAddCalling.mp4"
            />
          </div>
        </div>
      </section>

      <section
        className={cn(styles.faq, styles["faq-redesign"], "faq-redesign")}
      >
        <div className={styles["faq-top"]}>
          <div className="eyebrow">FAQ</div>
          <h2>Frequently Asked Questions</h2>
          <p>
            Quick answers about submissions, ownership, distribution, and
            payouts.
          </p>
        </div>
        <FaqAccordion items={FAQ_ITEMS} firstOpen />
      </section>

      {/* Put Your Music on the World */}
      <section className={cn(styles.final, styles["final-compact"])} id="final">
        <div className={styles.disc}>
          <Image
            src="/images/music-mandi-logo.png"
            alt=""
            width={180}
            height={180}
          />
        </div>
        <div>
          <Reveal as="div" className="eyebrow">
            Free to submit. Global from day one.
          </Reveal>
          <Reveal as="h2">
            Put Your Music
            <br />
            on the <i className="serif">World Stage</i>
          </Reveal>
          <Reveal as="p">
            Release worldwide. Keep your rights. See every rupee.
          </Reveal>
          <Reveal as="div" className={styles["final-actions"]}>
            <Link href="/artists/submit" className="btn fill">
              Get Started
            </Link>
            <Link href="/contact" className="btn">
              Talk to Our Team
            </Link>
          </Reveal>
        </div>
        <div className={styles.star}>&#10035;</div>
      </section>
    </>
  );
}

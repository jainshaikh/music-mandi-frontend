import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TeleAdsProvider } from "@/components/public/tele-ads/TeleAdsContext";
import TeleHeroActions from "@/components/public/tele-ads/TeleHeroActions";
import SampleAdInline from "@/components/public/tele-ads/SampleAdInline";
import TargetingSection from "@/components/public/tele-ads/TargetingSection";
import FaqAccordion from "@/components/public/FaqAccordion";
import styles from "./page.module.css";

const TITLE = 'Reach Pakistan in the Three Seconds Before "Hello"';
const DESCRIPTION =
  "TELE Ads puts a short audio message inside the natural call connection window, then follows it with a trackable SMS & WhatsApp. No app. No scroll. Just focused attention and a clear next action.";

export const metadata: Metadata = {
  title: "TELE ADs — Audio Advertising in the Connection Window",
  description: DESCRIPTION,
  openGraph: {
    title: "TELE ADs — Audio Advertising in the Connection Window",
    description: DESCRIPTION,
    url: "/tele-ads",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TELE ADs — Audio Advertising in the Connection Window",
    description: DESCRIPTION,
  },
};

const PRECISION_ITEMS = [
  {
    n: "01",
    title: "Call begins",
    p: "The listener is already holding the phone and waiting.",
  },
  {
    n: "02",
    title: "Audio gets the moment",
    p: "A short message plays inside the existing connection window.",
  },
  {
    n: "03",
    title: "SMS & WhatsApp captures action",
    p: "The follow up link arrives immediately after the audio.",
  },
];

const BENEFIT_PILLS = [
  "Unskippable audio",
  "First party targeting",
  "Nationwide reach",
  "SMS & WhatsApp click through",
  "Full reporting",
];

const USE_CASES = [
  "Telecom & fintech",
  "FMCG",
  "E-commerce & apps",
  "Banking & insurance",
  "Public awareness",
  "Events & entertainment",
];

const SPECS = [
  { b: "Audio", span: "MP3 or WAV" },
  { b: "Languages", span: "Urdu, English, regional" },
  { b: "Follow up", span: "Trackable SMS & WhatsApp link" },
  { b: "Reporting", span: "Delivery, completion, clicks" },
];

const FAQ_ITEMS = [
  {
    q: "Does the ad delay the call?",
    a: "No. It plays inside the connection window that already exists.",
  },
  {
    q: "How is it targeted?",
    a: "Using operator subscriber data such as geography, demographics, device, network type, and available usage signals.",
  },
  {
    q: "What is in the SMS & WhatsApp?",
    a: "Your campaign message and destination link, sent immediately after the audio and tracked for response.",
  },
  {
    q: "Can I run multiple languages?",
    a: "Yes. Creative can be adapted by language and region where delivery supports it.",
  },
  {
    q: "What reporting do I get?",
    a: "Campaign reporting can include impressions, completed listens, SMS & WhatsApp delivery, clicks, and performance by available audience segments.",
  },
];

export default function TeleAdsPage() {
  return (
    <div className={cn("page-shell", styles["tele-clean"])}>
      <TeleAdsProvider>
        <section
          className={cn(
            styles["tele-clean-hero"],
            styles["tele-video-detail-hero"],
          )}
        >
          <video
            className={styles["tele-detail-bg-video"]}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            src="/assets/TeleAddHeader.mp4"
          />
          <div className={styles["tele-detail-video-shade"]}></div>
          <div className={styles["tele-clean-copy"]}>
            <span className="route-kicker">A Music Mandi Product</span>
            <h1>{TITLE}</h1>
            <p>{DESCRIPTION}</p>
            <div className="route-actions">
              <TeleHeroActions />
            </div>
          </div>
        </section>

        <section className={styles["precision-section"]} id="teleHow">
          <div className={styles["precision-head"]}>
            <div className={styles["precision-title"]}>
              <span className="route-kicker">TELE Ads</span>
              <h2>
                Smart Precision,
                <br />
                <span className="brand-gradient">Smarter Targeting.</span>
              </h2>
            </div>
            <p>
              Operator data lets campaigns move beyond broad media buying. Build
              the audience using location, demographics, connection type,
              handset tier, and real usage signals.
            </p>
          </div>
          <div className={styles["precision-grid"]}>
            {PRECISION_ITEMS.map((item) => (
              <article key={item.n}>
                <span>{item.n}</span>
                <b>{item.title}</b>
                <p>{item.p}</p>
              </article>
            ))}
            <article className={styles["precision-benefit"]}>
              <b>One placement. One measurable journey.</b>
              <div className={styles["benefit-pills"]}>
                {BENEFIT_PILLS.map((pill) => (
                  <i key={pill}>{pill}</i>
                ))}
              </div>
            </article>
          </div>
          <SampleAdInline />
        </section>

        <TargetingSection />

        <section className={styles["tele-compact"]}>
          <div>
            <span className="route-kicker">Built for</span>
            <h2>Campaigns that need reach and response.</h2>
          </div>
          <div className={styles["usecase-row"]}>
            {USE_CASES.map((u) => (
              <span key={u}>{u}</span>
            ))}
          </div>
          <div className={styles["spec-row"]}>
            {SPECS.map((s) => (
              <div key={s.b}>
                <b>{s.b}</b>
                <span>{s.span}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={cn(styles["tele-faq"], "tele-faq")}>
          <div className={styles["faq-intro"]}>
            <span className="route-kicker">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <FaqAccordion items={FAQ_ITEMS} />
        </section>

        <section className={styles["tele-final"]}>
          <div>
            <span className="route-kicker">Ready when you are</span>
            <h2>The silence is already happening. Own the moment.</h2>
            <p>
              Build the audience, upload the creative, preview the complete
              customer experience, and see estimated results before submission.
            </p>
          </div>
          <div className="route-actions">
            <Link className="btn fill" href="/tele-ads/create">
              Create a Campaign
            </Link>
          </div>
        </section>
      </TeleAdsProvider>
    </div>
  );
}

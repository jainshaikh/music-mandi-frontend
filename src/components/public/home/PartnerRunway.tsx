import Image from "next/image";
import { cn } from "@/lib/utils";
import styles from "./PartnerRunway.module.css";

const LOGOS = [
  {
    src: "/silderlogo/TheOrchard.png",
    alt: "The Orchard logo",
    w: 250,
    h: 143,
  },
  {
    src: "/silderlogo/SonyMusic.png",
    alt: "Sony Music logo",
    w: 250,
    h: 233,
  },
  { src: "/silderlogo/Jazz.png", alt: "Jazz logo", w: 1080, h: 1080 },
  {
    src: "/silderlogo/TamashaMusic.png",
    alt: "Tamasha Music logo",
    w: 197,
    h: 75,
  },
];

// Pure-CSS infinite marquee (`.partner-track{animation:partnerRoll ...}`) — the
// logo set is duplicated once so the loop is seamless, exactly like the source.
export default function PartnerRunway() {
  const doubled = [...LOGOS, ...LOGOS];
  return (
    <section className={cn(styles.trust, styles["partner-runway"])}>
      <div className={cn(styles["trust-label"], "eyebrow")}>
        Distribution and promotion partners
      </div>
      <div
        className={cn(styles["partner-track"], styles["real-partner-track"])}
      >
        {doubled.map((logo, i) => (
          <div
            className={cn(styles["partner-logo-card"], styles["real-logo"])}
            key={`${logo.alt}-${i}`}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.w}
              height={logo.h}
              data-tm-logo={logo.alt.startsWith("Tamasha") ? "" : undefined}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

import Image from "next/image";
import { cn } from "@/lib/utils";
import styles from "./DspMarquee.module.css";

const DSPS = [
  { slug: "spotify", name: "Spotify", src: "/images/dsp-spotify.svg" },
  {
    slug: "applemusic",
    name: "Apple Music",
    src: "/images/dsp-applemusic.svg",
  },
  {
    slug: "youtubemusic",
    name: "YouTube Music",
    src: "/images/dsp-youtubemusic.svg",
  },
  // Simple Icons has removed the Amazon Music glyph from its catalog (every
  // slug variant 404s as of this build) — hotlinking the original CDN URL as
  // a fallback per the brief, rather than shipping a broken local file.
  {
    slug: "amazonmusic",
    name: "Amazon Music",
    src: "/images/amazon-music.svg",
  },
  { slug: "deezer", name: "Deezer", src: "/images/dsp-deezer.svg" },
  { slug: "tidal", name: "TIDAL", src: "/images/dsp-tidal.svg" },
  { slug: "soundcloud", name: "SoundCloud", src: "/images/dsp-soundcloud.svg" },
  { slug: "audiomack", name: "Audiomack", src: "/images/dsp-audiomack.svg" },
  { slug: "beatport", name: "Beatport", src: "/images/dsp-beatport.svg" },
  { slug: "pandora", name: "Pandora", src: "/images/dsp-pandora.svg" },
];

function Row({ reverse }: { reverse: boolean }) {
  const list = reverse ? [...DSPS].reverse() : DSPS;
  const doubled = [...list, ...list];
  return (
    <div
      className={cn(
        styles["dsp-marquee"],
        styles["dsp-belt"],
        reverse && styles.reverse,
      )}
    >
      <div
        className={cn(
          styles["dsp-row"],
          styles["real-logo-row"],
          reverse && styles.second,
        )}
      >
        {doubled.map((dsp, i) => (
          <div className={styles["real-dsp"]} key={`${dsp.slug}-${i}`}>
            <Image
              src={dsp.src}
              alt={dsp.name}
              width={34}
              height={34}
              unoptimized={dsp.src.startsWith("http")}
            />
            <b>{dsp.name}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

// Pure-CSS infinite marquees (`.real-logo-row{animation:dspMove ...}`).
export default function DspMarquee() {
  return (
    <section
      className={cn(styles.stats, styles["dsp-section"], styles["dsp-real"])}
    >
      <div className={styles["dsp-copy"]}>
        <div className="eyebrow">Global distribution</div>
        <div className={styles["dsp-big"]}>
          100+<span>platforms worldwide</span>
        </div>
        <p>
          Prepare one release in Music Mandi and deliver it across major global
          streaming and download services through the distribution network.
        </p>
      </div>
      <div className={styles["dsp-cloud"]}>
        <div className={styles["dsp-count"]}>
          100+<small>global platforms</small>
        </div>
        <Row reverse={false} />
        <Row reverse={true} />
      </div>
    </section>
  );
}

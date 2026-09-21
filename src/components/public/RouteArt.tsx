import Image from "next/image";
import styles from "./RouteArt.module.css";

// Ported from the prototype's `art()` helper — the spinning-disc decoration
// next to marketing-page heroes.
export default function RouteArt() {
  return (
    <div className={styles["route-art"]}>
      <div className={styles["art-disc"]}>
        <Image
          src="/images/music-mandi-logo.png"
          alt="Music Mandi"
          width={96}
          height={96}
        />
      </div>
    </div>
  );
}

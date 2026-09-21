import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./Footer.module.css";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path
        d="M10.3 9.3v5.4l4.9-2.7-4.9-2.7z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.5 3c.4 2.2 1.9 3.8 4 4.2v3a7.3 7.3 0 0 1-4-1.2v6.4a5.9 5.9 0 1 1-5.1-5.85v3.1a2.85 2.85 0 1 0 2.1 2.75V3h3z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="7.3" cy="7.8" r="1.3" fill="currentColor" />
      <rect x="6.2" y="10.2" width="2.2" height="7.3" fill="currentColor" />
      <path
        d="M11.6 10.2h2.1v1.2c.5-.9 1.4-1.4 2.6-1.4 2 0 3.2 1.3 3.2 3.7v3.8h-2.2v-3.4c0-1.2-.5-2-1.6-2-.9 0-1.5.6-1.7 1.2-.1.2-.1.5-.1.8v3.4h-2.2v-7.3z"
        fill="currentColor"
      />
    </svg>
  );
}

const SOCIALS = [
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramIcon },
  { href: "https://youtube.com", label: "YouTube", Icon: YouTubeIcon },
  { href: "https://tiktok.com", label: "TikTok", Icon: TikTokIcon },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: LinkedInIcon },
];

export default function Footer() {
  return (
    <footer className={cn(styles.footer, styles["footer-minimal"])} id="about">
      <div className={styles["footer-minimal-top"]}>
        <div className={styles["footer-minimal-brand"]}>
          <div className={styles["foot-brand-lock"]}>
            <Image
              src="/images/music-mandi-logo.png"
              alt="Music Mandi logo"
              width={54}
              height={54}
            />
            <div>
              <strong>Music Mandi</strong>
              <small>Release. Track. Get Paid.</small>
            </div>
          </div>
          <div className={styles["footer-socials"]}>
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon />
                {label}
              </a>
            ))}
          </div>
        </div>
        <nav className={styles["footer-main-nav"]}>
          <Link href="/#tamasha-launch">Tamasha Music</Link>
          <Link href="/tele-ads">TELE Ads</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>
      </div>
      <div className={styles["footer-minimal-bottom"]}>
        <span>&copy; Music Mandi 2026 &middot; Pakistan</span>
      </div>
    </footer>
  );
}

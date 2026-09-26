import Image from "next/image";
import Link from "next/link";

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
      className="shrink-0"
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
      className="shrink-0"
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
      className="shrink-0"
    >
      <path d="M16.5 3c.4 2.2 1.9 3.8 4 4.2v3a7.3 7.3 0 0 1-4-1.2v6.4a5.9 5.9 0 1 1-5.1-5.85v3.1a2.85 2.85 0 1 0 2.1 2.75V3h3z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      className="shrink-0"
    >
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
    <footer
      id="about"
      className="bg-mm-ink text-mm-paper sm:px-mm-gutter flex flex-col justify-between px-4 pt-13 pb-5 sm:pt-18 sm:pb-6"
    >
      <div className="md:grid-cols-mm-footer grid grid-cols-1 items-start gap-8 sm:gap-12">
        <div>
          <div className="flex items-center gap-3.5">
            <Image
              src="/images/music-mandi-logo.png"
              alt="Music Mandi logo"
              width={54}
              height={54}
              className="size-13.5 rounded-full object-contain"
            />
            <div>
              <strong className="block text-2xl tracking-tight">
                Music Mandi
              </strong>
              <small className="mt-2 block text-xs tracking-widest text-slate-400 uppercase">
                Release. Track. Get Paid.
              </small>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-4">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs tracking-wide text-slate-400 uppercase transition-colors duration-300 hover:text-white"
              >
                <Icon />
                {label}
              </a>
            ))}
          </div>
        </div>
        <nav className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap md:gap-7">
          <Link
            href="/#tamasha-launch"
            className="text-xs tracking-widest text-white uppercase"
          >
            Tamasha Music
          </Link>
          <Link
            href="/tele-ads"
            className="text-xs tracking-widest text-white uppercase"
          >
            TELE Ads
          </Link>
          <Link
            href="/about"
            className="text-xs tracking-widest text-white uppercase"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-xs tracking-widest text-white uppercase"
          >
            Contact Us
          </Link>
        </nav>
      </div>
      <div className="mt-14 flex flex-col justify-between gap-5 border-t border-white/9 pt-5 text-xs tracking-widest text-slate-500 uppercase sm:flex-row">
        <span>&copy; Music Mandi 2026 &middot; Pakistan</span>
      </div>
    </footer>
  );
}

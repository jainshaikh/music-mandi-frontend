import Image from "next/image";
import { cn } from "@/lib/utils";

type Dsp = {
  slug: string;
  name: string;
  src: string;
};

const DSPS: Dsp[] = [
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
    <div className="group/belt relative my-4 overflow-hidden border-y border-white/10 mask-[linear-gradient(90deg,transparent,black_7%,black_93%,transparent)]">
      <div
        className={cn(
          "group-hover/belt:paused flex w-max gap-3",
          reverse ? "animate-dsp-scroll-reverse" : "animate-dsp-scroll",
        )}
      >
        {doubled.map((dsp, i) => (
          <div
            key={`${dsp.slug}-${i}`}
            className="group/card ease-mm flex h-20.5 w-34.5 shrink-0 flex-col items-center justify-center gap-2.25 transition-all duration-300 max-sm:h-18.5 max-sm:w-29 pointer-fine:group-hover/card:-translate-y-1.25 pointer-fine:group-hover/card:scale-104"
          >
            <Image
              src={dsp.src}
              alt={dsp.name}
              width={34}
              height={34}
              unoptimized={dsp.src.startsWith("http")}
              className="ease-mm h-8 w-8 object-contain opacity-60 brightness-200 grayscale transition-all duration-300 max-sm:h-7.5 max-sm:w-7.5 pointer-fine:group-hover/card:scale-114 pointer-fine:group-hover/card:opacity-100 pointer-fine:group-hover/card:brightness-100 pointer-fine:group-hover/card:grayscale-0"
            />
            <b className="ease-mm text-xs font-normal text-slate-400 transition-colors duration-300 pointer-fine:group-hover/card:text-white">
              {dsp.name}
            </b>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DspMarquee() {
  return (
    <section className="bg-mm-navy sm:px-mm-gutter grid min-h-130 grid-cols-1 gap-10 px-6 py-14 text-white md:grid-cols-12 md:gap-16 md:py-24">
      <div className="flex flex-col justify-center md:col-span-4">
        <div className="eyebrow">Global distribution</div>
        <div className="text-7xl leading-none font-black tracking-tighter sm:text-8xl md:text-9xl">
          100+
          <span className="mt-6 block text-lg tracking-normal uppercase">
            platforms worldwide
          </span>
        </div>
        <p className="mt-4 max-w-md leading-normal text-slate-300">
          Prepare one release in Music Mandi and deliver it across major global
          streaming and download services through the distribution network.
        </p>
      </div>

      <div className="relative flex flex-col justify-center overflow-hidden md:col-span-8">
        <div className="from-mm-brand-1 to-mm-brand-2 z-2 mb-6 w-max bg-linear-to-br text-6xl font-black text-white sm:absolute sm:top-0 sm:right-0 sm:mb-0">
          100+
          <small className="block text-xs tracking-widest text-slate-400 uppercase">
            global platforms
          </small>
        </div>
        <Row reverse={false} />
        <Row reverse={true} />
      </div>
    </section>
  );
}

import Image from "next/image";

type Logo = {
  src: string;
  alt: string;
  w: number;
  h: number;
};

const LOGOS: Logo[] = [
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

export default function PartnerRunway() {
  const doubled = [...LOGOS, ...LOGOS];
  return (
    <section className="bg-mm-navy relative flex min-h-57.5 items-center overflow-hidden border-t border-b border-white/8 text-white">
      <div className="eyebrow left-mm-gutter max-mm-sm:top-6 max-mm-sm:left-4.5 absolute top-7">
        Distribution and promotion partners
      </div>
      <div className="animate-marquee flex w-max items-center gap-5 py-15">
        {doubled.map((logo, i) => (
          <div
            key={`${logo.alt}-${i}`}
            className="max-mm-sm:h-19.5 max-mm-sm:w-47.5 grid h-23 w-62.5 place-items-center overflow-hidden"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.w}
              height={logo.h}
              className="max-mm-sm:h-mm-xl h-14.5 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

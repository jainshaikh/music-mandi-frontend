import Image from "next/image";
import Reveal from "@/components/public/Reveal";

const RIGHTS = [
  {
    n: "01",
    title: "Clear contracts",
    p: "plain language, no hidden transfers",
  },
  {
    n: "02",
    title: "Auditable statements",
    p: "every stream, every platform, every rupee",
  },
  {
    n: "03",
    title: "Automatic splits",
    p: "collaborators paid without you chasing anyone",
  },
];

export default function FairRightsSection() {
  return (
    <section className="bg-mm-ink sm:px-mm-gutter grid min-h-225 grid-cols-1 items-center gap-10 px-6 py-16 text-white md:grid-cols-2 md:gap-16 md:py-24">
      <div>
        <Reveal as="div" className="eyebrow">
          Fair Rights, By Default
        </Reveal>
        <Reveal
          as="h2"
          className="mt-3.5 text-6xl leading-none font-bold tracking-tighter sm:text-7xl md:text-8xl"
        >
          You Keep What <span className="serif">You Own</span>
        </Reveal>
        <Reveal
          as="p"
          className="mt-4 max-w-2xl text-lg leading-tight sm:text-2xl md:text-3xl"
        >
          Splits agreed upfront. Ownership recorded in writing. Reporting you
          can audit line by line.
        </Reveal>

        <div className="mt-10">
          {RIGHTS.map((right) => (
            <Reveal
              as="div"
              key={right.n}
              className="flex gap-4 border-t border-white/14 py-3.5 md:gap-6"
            >
              <b className="serif w-14 shrink-0 text-2xl">{right.n}</b>
              <span className="text-xs leading-tight uppercase">
                <strong>{right.title}</strong>. {right.p}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal
        as="div"
        className="relative mx-auto aspect-square w-full max-w-155"
      >
        <div className="size-mm-orbit-core absolute inset-0 m-auto">
          <Image
            src="/images/orbit-badge.svg"
            alt="Your rights stay yours."
            fill
            className="object-contain"
          />
        </div>
      </Reveal>
    </section>
  );
}

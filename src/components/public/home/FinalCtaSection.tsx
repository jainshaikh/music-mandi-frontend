import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/public/Reveal";

export default function FinalCtaSection() {
  return (
    <section
      id="final"
      className="from-mm-brand-1 via-mm-brand-2 to-mm-brand-3 sm:p-mm-gutter relative flex min-h-130 items-center justify-center bg-linear-to-br px-4.5 py-17.5 text-center text-white sm:min-h-150"
    >
      <div className="animate-mm-disc-spin w-mm-final-disc h-mm-final-disc absolute top-[10%] left-[6%] hidden overflow-hidden rounded-full sm:block">
        <Image
          src="/images/music-mandi-logo.png"
          alt=""
          width={180}
          height={180}
          className="h-full w-full object-contain"
        />
      </div>
      <div>
        <Reveal as="div" className="eyebrow">
          Free to submit. Global from day one.
        </Reveal>
        <Reveal
          as="h2"
          className="text-mm-final mx-auto max-w-6xl leading-none font-bold tracking-tighter text-balance break-normal uppercase"
        >
          Put Your Music
          <br />
          on the <i className="serif font-normal normal-case">World Stage</i>
        </Reveal>
        <Reveal as="p" className="my-7 text-sm uppercase">
          Release worldwide. Keep your rights. See every rupee.
        </Reveal>
        <Reveal
          as="div"
          className="flex flex-col items-center justify-center gap-2 sm:flex-row"
        >
          <Link
            href="/artists/submit"
            className="btn fill bg-white! bg-none! text-neutral-950! shadow-none!"
          >
            Get Started
          </Link>
          <Link href="/contact" className="btn border-white/55!">
            Talk to Our Team
          </Link>
        </Reveal>
      </div>
      <div className="animate-mm-star-spin absolute right-[6%] bottom-[7%] hidden text-9xl opacity-28 sm:block">
        &#10035;
      </div>
    </section>
  );
}

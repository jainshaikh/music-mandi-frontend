import Link from "next/link";
import Reveal from "@/components/public/Reveal";

export default function TeleAdsSection() {
  return (
    <section
      id="tele-ads-home"
      className="bg-mm-tele-ink sm:px-mm-gutter px-6 py-16 text-white"
    >
      <div className="border-mm-brand-1/22 md:grid-cols-mm-tele relative grid min-h-140 items-center gap-6 rounded-3xl border bg-neutral-950 px-5 py-7 shadow-2xl md:gap-16 md:p-12">
        <div className="min-w-0">
          <Reveal as="div" className="eyebrow">
            A service by Music Mandi
          </Reveal>
          <Reveal
            as="h2"
            className="mt-4.5 mb-7.5 text-7xl leading-none font-bold tracking-tighter sm:text-8xl lg:text-9xl"
          >
            TELE <span className="serif text-mm-tele-pink">ADs</span>
          </Reveal>
          <Reveal
            as="p"
            className="max-w-2xl text-lg leading-tight text-stone-300 sm:text-2xl md:text-3xl"
          >
            Turn the connection window of a phone call into an audio placement,
            then follow it with an SMS & WhatsApp that can drive action.
          </Reveal>
          <div className="mt-6.5 flex flex-wrap gap-3">
            <Link className="btn light" href="/tele-ads">
              Explore TELE ADs
            </Link>

            <Link className="btn fill" href="/tele-ads/create">
              Create a Campaign
            </Link>
          </div>
        </div>
        <div className="bg-mm-tele-black relative mt-7 flex w-full min-w-0 items-center justify-center justify-self-center overflow-hidden rounded-2xl md:mt-0 md:w-[min(100%,620px)] md:justify-self-end md:rounded-3xl">
          <video
            className="aspect-mm-tele-video bg-mm-tele-black block h-auto w-full object-contain"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            src="/assets/TeleAddCalling.mp4"
          />
        </div>
      </div>
    </section>
  );
}

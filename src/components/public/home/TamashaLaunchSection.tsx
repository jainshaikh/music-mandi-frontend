import Image from "next/image";

export default function TamashaLaunchSection() {
  return (
    <section
      id="tamasha-launch"
      className="sm:px-mm-gutter bg-amber-300 px-6 py-16 text-neutral-950 md:py-24"
    >
      <div className="max-w-5xl">
        <div className="eyebrow">Music Mandi × Jazz</div>
        <Image
          src="/images/tamasha-music-logo.png"
          alt="Tamasha Music"
          width={197}
          height={75}
          className="mt-2.5 mb-3.5 h-18 w-auto max-w-70 object-contain"
        />
        <h2 className="my-5 max-w-5xl text-5xl leading-none font-bold tracking-tighter text-balance break-normal sm:text-6xl md:text-7xl">
          Launching a weekly home for original Pakistani music.
        </h2>
      </div>
      <div className="relative mt-6 min-h-90 w-full overflow-hidden rounded-2xl border border-black/16 bg-neutral-950 shadow-2xl md:mt-9 md:min-h-[min(72vh,760px)] md:rounded-3xl">
        <Image
          src="/images/tamasha-banner.jpg"
          alt="Tamasha Music artist campaign banner"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}

import FaqAccordion from "@/components/public/FaqAccordion";

const FAQ_ITEMS = [
  {
    q: "Who owns my music?",
    a: "You do. Ownership terms are agreed clearly before release.",
  },
  {
    q: "Where does my music go?",
    a: "Music Mandi prepares releases for a broad network of global DSPs and distribution destinations.",
  },
  { q: "Do I have to be signed?", a: "No. Submissions are open." },
  {
    q: "How do I get on Tamasha Music?",
    a: "Artists in the Music Mandi pipeline can be considered for the weekly Tamasha Music release route.",
  },
];

export default function FaqSection() {
  return (
    <section className="faq-redesign bg-mm-ink text-mm-paper sm:px-mm-gutter md:grid-cols-mm-faq grid grid-cols-1 gap-10 px-6 py-16 md:gap-20">
      <div>
        <div className="eyebrow">FAQ</div>
        <h2 className="mt-3 mb-4.5 text-5xl leading-none font-bold tracking-tighter text-balance break-normal sm:text-6xl md:text-7xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-4.5 max-w-2xl text-base leading-normal text-slate-400 md:text-xl">
          Quick answers about submissions, ownership, distribution, and payouts.
        </p>
      </div>
      <FaqAccordion items={FAQ_ITEMS} firstOpen />
    </section>
  );
}

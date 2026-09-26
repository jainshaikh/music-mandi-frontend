import type { Metadata } from "next";
import HeroCarousel from "@/components/public/home/HeroCarousel";
import PartnerRunway from "@/components/public/home/PartnerRunway";
import OnePlatformSection from "@/components/public/home/OnePlatformSection";
import SystemsCarousel from "@/components/public/home/SystemsCarousel";
import DspMarquee from "@/components/public/home/DspMarquee";
import FairRightsSection from "@/components/public/home/FairRightsSection";
import TamashaLaunchSection from "@/components/public/home/TamashaLaunchSection";
import TeleAdsSection from "@/components/public/home/TeleAdsSection";
import FaqSection from "@/components/public/home/FaqSection";
import FinalCtaSection from "@/components/public/home/FinalCtaSection";

const TITLE = "Music Mandi. Release. Track. Get Paid.";
const DESCRIPTION =
  "The platform Pakistani artists and labels use to release music worldwide, manage their rights, and see every rupee they earn.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <PartnerRunway />
      <OnePlatformSection />
      <SystemsCarousel />
      <DspMarquee />
      <FairRightsSection />
      <TamashaLaunchSection />
      <TeleAdsSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}

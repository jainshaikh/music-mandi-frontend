import type { Metadata } from "next";
import CampaignBuilder from "@/components/public/tele-ads/CampaignBuilder";

// Matches the source: a bare full-bleed page (CampaignBuilder owns its own
// top padding/background) rather than the PageShell wrapper other public
// pages use — not indexed, since it's a UI-only demo form.
export const metadata: Metadata = {
  title: "Create Your Campaign",
  robots: { index: false, follow: false },
};

export default function CreateCampaignPage() {
  return <CampaignBuilder />;
}

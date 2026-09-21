"use client";

import Link from "next/link";
import styles from "./CampaignConfirmation.module.css";

// Ported from the prototype's `sellerCampaignConfirmation()`.
export default function CampaignConfirmation({
  onCreateAnother,
}: {
  onCreateAnother: () => void;
}) {
  return (
    <div className={styles["tp-page"]}>
      <div className={styles["seller-success"]}>
        <div className={styles.checkmark}>&#10003;</div>
        <span
          className="route-kicker"
          style={{ display: "block", marginTop: 20 }}
        >
          Seller Ads campaign submitted
        </span>
        <h1>Your campaign is in review.</h1>
        <p>
          We have saved your advertiser account and campaign. The team can now
          review the creative, audience, and delivery settings before launch.
        </p>
        <div className="route-actions" style={{ justifyContent: "center" }}>
          <Link className="btn fill" href="/tele-ads/dashboard">
            Go to Dashboard
          </Link>
          {/* Same route as this page — reset local state instead of a Link
              navigation, since Next won't remount a client component when
              navigating to the URL it's already on. */}
          <button type="button" className="btn" onClick={onCreateAnother}>
            Create Another Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

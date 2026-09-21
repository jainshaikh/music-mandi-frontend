import type { Metadata } from "next";
import PageShell from "@/components/public/PageShell";
import LoginForm from "@/components/public/forms/LoginForm";
import styles from "./page.module.css";

// UI-only demo screen with hardcoded demo credentials — must not be indexed.
export const metadata: Metadata = {
  title: "TELE ADs Advertiser Login",
  robots: { index: false, follow: false },
};

export default function TeleAdsLoginPage() {
  return (
    <PageShell>
      <div className={styles["tp-wrap"]}>
        <section
          className={styles["tp-section"]}
          style={{ paddingTop: "14vh" }}
        >
          <LoginForm tone={true} />
        </section>
      </div>
    </PageShell>
  );
}

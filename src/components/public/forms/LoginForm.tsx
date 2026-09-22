"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import {
  DEMO_ADVERTISER,
  DEMO_LOGIN_CAMPAIGN,
  readCampaign,
  writeAdvertiser,
  writeCampaign,
} from "@/lib/sellerAds";
import styles from "./LoginForm.module.css";

const DEMO_EMAIL = "demo@musicmandi.pk";
const DEMO_PASSWORD = "Demo1234";

// UI-only, no real auth: the generic (non-tone) login is a deliberate dead
// end in the source — it always just shows a toast pointing at TELE ADs and
// goes nowhere. The tone (TELE ADs advertiser) login checks the on-page demo
// credentials and, on success, seeds localStorage and redirects to the
// dashboard. That dashboard route isn't migrated yet, so the redirect will
// 404 until it is — this is a client-only demo flow, not a real backend
// submission, so it stays as-is per the "UI-only forms" scope decision.
export default function LoginForm({ tone }: { tone: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState(tone ? DEMO_EMAIL : "");
  const [password, setPassword] = useState(tone ? DEMO_PASSWORD : "");
  const [showError, setShowError] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!tone) {
      showToast("Demo login is available in TELE ADs");
      return;
    }

    if (
      email.trim().toLowerCase() !== DEMO_EMAIL ||
      password !== DEMO_PASSWORD
    ) {
      setShowError(true);
      return;
    }

    setShowError(false);
    writeAdvertiser(DEMO_ADVERTISER);
    if (!readCampaign()) {
      writeCampaign({ ...DEMO_LOGIN_CAMPAIGN, submittedAt: Date.now() });
    }
    showToast("Demo account signed in");
    setTimeout(() => router.push("/tele-ads/dashboard"), 250);
  };

  return (
    <form
      className="form-card"
      id="loginForm"
      style={{ maxWidth: 560, margin: "auto" }}
      onSubmit={onSubmit}
    >
      <span className="route-kicker">
        {tone ? "TELE ADs" : "Music Mandi"} login
      </span>
      <h2 style={{ fontSize: 50 }}>Welcome back.</h2>
      {tone ? (
        <div className={styles["demo-login-note"]}>
          <b>Demo portal access</b>
          <br />
          Email: {DEMO_EMAIL}
          <br />
          Password: {DEMO_PASSWORD}
        </div>
      ) : null}
      <div className="field">
        <label htmlFor="loginEmail">Email</label>
        <input
          id="loginEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="loginPassword">Password</label>
        <input
          id="loginPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div
        className={cn(styles["login-error"], showError && styles.on)}
        id="loginError"
      >
        Use the demo credentials shown above.
      </div>
      {/* <button className="btn fill" type="submit" style={{ marginTop: 20 }}>
        Log in
      </button> */}
    </form>
  );
}

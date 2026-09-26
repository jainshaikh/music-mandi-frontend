"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ELAPSED_FIELD, HONEYPOT_FIELD } from "@/lib/formGuard";
import { showToast } from "@/lib/toast";
import styles from "./ContactForm.module.css";

const TOPICS = [
  "General enquiry",
  "Artist or release",
  "TELE Ads",
  "Partnership",
  "Press",
];

// Posts to /api/integrations/contact — an interim, frontend-hosted SendGrid
// route standing in for the real backend (see docs/DECISIONS.md DEC-017).
export default function ContactForm() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    setStatus("submitting");

    try {
      const res = await fetch("/api/integrations/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          phone: data.get("phone"),
          topic,
          message: data.get("message"),
          [HONEYPOT_FIELD]: data.get(HONEYPOT_FIELD),
          [ELAPSED_FIELD]: Date.now() - mountedAt.current,
        }),
      });

      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("idle");
      showToast("Could not send your message. Please try again.");
    }
  };

  if (status === "sent") {
    return (
      <div className={styles["contact-success"]}>
        <span>Message sent</span>
        <h2>Thanks. We have your enquiry.</h2>
        <p>The right Music Mandi team can now pick this up.</p>
        <Link className="btn fill" href="/">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={styles["contact-form-head"]}>
        <span>Send an enquiry</span>
        <h2>Tell us what you need.</h2>
        <p>Give us enough context to route your message correctly.</p>
      </div>
      <form
        className={styles["contact-pro-form"]}
        id="contactForm"
        onSubmit={onSubmit}
      >
        {/* Honeypot (see src/lib/formGuard.ts) — hidden from people and
            screen readers; bots that fill every input fill this too. */}
        <div className="sr-only" aria-hidden="true">
          <label>
            Website
            <input name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div className={styles["contact-fields"]}>
          <label>
            Name *<input name="name" maxLength={100} required />
          </label>
          <label>
            Email *
            <input name="email" type="email" maxLength={254} required />
          </label>
          <label>
            Company
            <input name="company" maxLength={150} />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" maxLength={30} />
          </label>
          <label className={styles.full}>
            What is this about?
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              {TOPICS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className={styles.full}>
            Message *<textarea name="message" maxLength={5000} required />
          </label>
        </div>
        <div
          className={cn(
            styles["sub-nudge"],
            (topic === "Artist or release" || topic === "TELE Ads") &&
              styles.on,
          )}
        >
          {topic === "Artist or release" ? (
            <>
              Already ready to submit?{" "}
              <Link href="/artists/submit">
                Use the music submission flow &rarr;
              </Link>
            </>
          ) : topic === "TELE Ads" ? (
            <>
              Ready to build the campaign?{" "}
              <Link href="/tele-ads/create">Open campaign builder &rarr;</Link>
            </>
          ) : null}
        </div>
        <button
          className={cn("btn fill", styles["contact-send"])}
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Send Message"}
        </button>
      </form>
    </>
  );
}

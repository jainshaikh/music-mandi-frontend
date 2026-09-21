"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";
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
        <div className={styles["contact-fields"]}>
          <label>
            Name *<input name="name" required />
          </label>
          <label>
            Email *<input name="email" type="email" required />
          </label>
          <label>
            Company
            <input name="company" />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" />
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
            Message *<textarea name="message" required />
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

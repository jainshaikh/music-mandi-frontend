"use client";

import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./SellerContactModal.module.css";

export type SellerContactInput = {
  name: string;
  email: string;
  company: string;
  phone: string;
};

// Collects just enough contact info to notify the team and confirm receipt
// back to the advertiser by email — no account/password, since there's no
// real advertiser auth or dashboard backend yet. SellerAccountModal (full
// account creation) is intentionally not ported; see CampaignBuilder.tsx.
export default function SellerContactModal({
  onClose,
  onSubmit,
  submitting = false,
}: {
  onClose: () => void;
  onSubmit: (input: SellerContactInput) => void;
  submitting?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) return;
    onSubmit({
      name: trimmedName,
      email: trimmedEmail,
      company: company.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <div
      className={cn("flow-modal", "on", styles["seller-account-modal"])}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flow-modal-card">
        <button
          className="modal-x"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <span className="route-kicker">Save your campaign</span>
        <h3>Where should we send updates?</h3>
        <p style={{ color: "#939cac", marginTop: -12, marginBottom: 22 }}>
          Your campaign is ready. Share your contact details so our team can
          confirm receipt and follow up once it&apos;s reviewed.
        </p>
        <form onSubmit={handleSubmit}>
          <div className={styles["seller-account-grid"]}>
            <div className="seller-field">
              <label>
                Name <span className={styles["required-star"]}>*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="seller-field">
              <label>
                Work email <span className={styles["required-star"]}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="seller-field">
              <label>
                Company <span className={styles.optional}>optional</span>
              </label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="seller-field">
              <label>
                Phone <span className={styles.optional}>optional</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <button
            className="btn fill"
            type="submit"
            style={{ width: "100%", marginTop: 18 }}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit campaign for review"}
          </button>
        </form>
      </div>
    </div>
  );
}

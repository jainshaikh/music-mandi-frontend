"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import {
  DEFAULT_DRAFT_CAMPAIGN,
  formatPKR,
  readCampaign,
  writeAdvertiser,
  writeCampaign,
  type SellerCampaign,
} from "@/lib/sellerAds";
// SellerAccountModal (full account creation with a password) depends on real
// advertiser auth/dashboard services that don't exist in this frontend-only
// scope, so it isn't ported — SellerContactModal (name/email/company/phone,
// no password) is used instead, matching the source's own active code path.
import SellerContactModal, {
  type SellerContactInput,
} from "./SellerContactModal";
import AdPreviewModal from "./AdPreviewModal";
import CampaignConfirmation from "./CampaignConfirmation";
import DatePickerField from "./DatePickerField";
import CityPickerField from "./CityPickerField";
import styles from "./CampaignBuilder.module.css";

const OBJECTIVES = [
  "Awareness",
  "Website visits",
  "App installs",
  "Leads",
  "Promote an offer",
];
const LANGUAGES = ["Urdu", "English", "Punjabi", "Sindhi", "Pashto", "Balochi"];
const GENDERS = ["Everyone", "Men", "Women"];
const AGE_MIN = 18;
const AGE_MAX = 65;
const STEPS = ["Setup", "Budget", "Audience", "Creative", "Review"];
const ADVANCED_TARGETING_CHIPS = [
  "Prepaid",
  "Postpaid",
  "High data usage",
  "High call volume",
];
// Fixed bar heights for the decorative "waveform" shown once an audio file
// is attached — ported verbatim from the source (no real audio analysis).
const WAVE_HEIGHTS = [
  12, 26, 18, 34, 16, 29, 40, 22, 32, 14, 36, 23, 31, 17, 28, 12, 34, 20,
];

const MS_PER_DAY = 86400000;

// Ported from music_mandi-website's campaign builder — one page, one form,
// five sections, with a sticky live-estimate sidebar recomputed as derived
// state instead of the source's manual DOM patching.
export default function CampaignBuilder() {
  const [campaign, setCampaign] = useState<SellerCampaign>(
    DEFAULT_DRAFT_CAMPAIGN,
  );
  const [policyChecked, setPolicyChecked] = useState(false);
  const [advancedTargeting, setAdvancedTargeting] = useState<string[]>([]);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [budgetMode, setBudgetMode] = useState<"total" | "daily">("total");
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const budgetInputRef = useRef<HTMLInputElement>(null);
  const audioFileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Synchronizing with an external resource (a Blob URL for the <audio>
  // player), not deriving state from props — the same category of effect as
  // the localStorage hydration below, so it's suppressed the same way.
  useEffect(() => {
    if (!audioFile) return;
    const url = URL.createObjectURL(audioFile);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronizing with an external Blob URL resource, not deriving state from props (same category as the localStorage hydration effect below).
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [audioFile]);

  // Merge in any previously saved draft once, after mount (localStorage
  // isn't available during SSR, so the first render always shows the
  // defaults). This is a deliberate one-time hydration of local form state
  // from a synchronous external source (not state derived from props), so
  // the `set-state-in-effect` lint rule is suppressed here.
  useEffect(() => {
    const saved = readCampaign();
    // Only resume an in-progress draft. A campaign that's already been
    // submitted belongs to the dashboard's history, not this blank creation
    // form.
    if (saved && !saved.submitted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCampaign((prev) => ({ ...prev, ...saved }));
      if (budgetInputRef.current)
        budgetInputRef.current.value = String(saved.budget);
    }
  }, []);

  const update = <K extends keyof SellerCampaign>(
    key: K,
    value: SellerCampaign[K],
  ) => {
    setCampaign((prev) => ({ ...prev, [key]: value }));
  };

  const days = useMemo(() => {
    const start = new Date(campaign.start).getTime();
    const end = new Date(campaign.end).getTime();
    const diff = Math.round((end - start) / MS_PER_DAY) + 1;
    return Math.max(1, diff || 1);
  }, [campaign.start, campaign.end]);

  // Total budget is the only value ever persisted — "daily budget" mode is
  // just a different lens on entering/viewing it (daily * days = total), so
  // there's no separate field to keep in sync.
  const setBudget = (raw: number | string, syncNumberInput = false) => {
    const value = Number(raw);
    const clamped = Number.isFinite(value) && value > 0 ? value : 100000;
    update("budget", clamped);
    if (syncNumberInput && budgetInputRef.current) {
      budgetInputRef.current.value = String(clamped);
    }
  };

  const switchBudgetMode = (mode: "total" | "daily") => {
    setBudgetMode(mode);
    if (budgetInputRef.current) {
      const displayValue =
        mode === "daily" ? Math.round(campaign.budget / days) : campaign.budget;
      budgetInputRef.current.value = String(displayValue);
    }
  };

  const onBudgetAmountChange = (raw: string) => {
    const value = Math.max(0, Number(raw) || 0);
    setBudget(budgetMode === "daily" ? value * days : value);
  };

  const onBudgetSliderChange = (raw: string) => {
    const value = Number(raw) || 0;
    setBudget(budgetMode === "daily" ? value * days : value);
    if (budgetInputRef.current) budgetInputRef.current.value = String(value);
  };

  // Only the active step's section is mounted, so a whole-form
  // reportValidity() call naturally checks just that step's fields before
  // letting the wizard advance.
  const goNext = () => {
    if (formRef.current && !formRef.current.reportValidity()) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const goBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  // Live estimate math, ported exactly from the source's `render()`, extended
  // with a range-width factor so narrowing the age *max* (not just raising
  // the min) also shrinks the estimate — the source only ever had an
  // open-ended "18+" floor, with no adjustable ceiling.
  const estimate = useMemo(() => {
    const rangeFactor =
      Math.max(1, campaign.ageMax - campaign.ageMin) / (AGE_MAX - AGE_MIN);
    const potential =
      9.8 *
      Math.max(0.35, (66 - campaign.ageMin) / 48) *
      rangeFactor *
      (campaign.location === "Cities" ? 0.45 : 1);
    const spend = Math.min(1.6, campaign.budget / 250000);
    const reachLow = Math.min(potential * 0.88, 0.72 * spend);
    const reachHigh = Math.min(potential, 0.92 * spend);
    let strength: string;
    let tip: string;
    if (potential < 1.5) {
      strength = "Narrow";
      tip = "Widen your audience to improve delivery.";
    } else if (campaign.budget >= 750000) {
      strength = "Strong";
      tip = "You have room to scale this campaign.";
    } else {
      strength = "Good";
      tip = "Your budget and audience are balanced for a broad campaign.";
    }
    return {
      potential,
      reachLow,
      reachHigh,
      impressionsLow: reachLow * 1.65,
      impressionsHigh: reachHigh * 1.7,
      smsLow: reachLow * 0.94,
      smsHigh: reachHigh * 0.96,
      strength,
      tip,
    };
  }, [campaign.ageMin, campaign.ageMax, campaign.budget, campaign.location]);

  const ageLabel =
    campaign.ageMax >= AGE_MAX
      ? `${campaign.ageMin} to ${AGE_MAX}+`
      : `${campaign.ageMin} to ${campaign.ageMax}`;

  const locationLabel =
    campaign.location === "Pakistan"
      ? "All Pakistan"
      : campaign.cities.length > 0
        ? campaign.cities.join(", ")
        : "No cities selected yet";

  const reviewItems: [string, string][] = [
    ["Campaign", campaign.name || "Untitled campaign"],
    ["Objective", campaign.objective],
    ["Runs", `${campaign.start} to ${campaign.end}`],
    ["Audience", `${locationLabel} · ${ageLabel} · ${campaign.gender}`],
    [
      "Budget",
      budgetMode === "daily"
        ? `${formatPKR(campaign.budget / days)} / day (${formatPKR(campaign.budget)} total)`
        : formatPKR(campaign.budget),
    ],
    [
      "Creative",
      `${campaign.audio ? "Audio uploaded" : "Audio pending"} · ${campaign.languages.join(", ")} · SMS & WhatsApp follow up`,
    ],
  ];

  const toggleLanguage = (lang: string) => {
    setCampaign((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const toggleAdvancedChip = (chip: string) => {
    setAdvancedTargeting((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip],
    );
  };

  const onAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCampaign((prev) => ({ ...prev, audio: true, audioName: file.name }));
    setAudioFile(file);
  };

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!policyChecked) return;
    setShowAccountModal(true);
  };

  // Posts to /api/integrations/campaign-submit — an interim, frontend-hosted
  // SendGrid route standing in for the real backend (see docs/DECISIONS.md
  // DEC-017), including the audio file (if any) as an email attachment.
  const onAccountSubmit = async (input: SellerContactInput) => {
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("advertiserName", input.name);
      fd.append("advertiserEmail", input.email);
      fd.append("advertiserCompany", input.company);
      fd.append("advertiserPhone", input.phone);
      fd.append("campaignName", campaign.name);
      fd.append("objective", campaign.objective);
      fd.append("start", campaign.start);
      fd.append("end", campaign.end);
      fd.append("budget", String(campaign.budget));
      fd.append("location", campaign.location);
      campaign.cities.forEach((city) => fd.append("cities", city));
      fd.append("ageMin", String(campaign.ageMin));
      fd.append("ageMax", String(campaign.ageMax));
      fd.append("gender", campaign.gender);
      advancedTargeting.forEach((chip) => fd.append("advancedTargeting", chip));
      campaign.languages.forEach((lang) => fd.append("languages", lang));
      fd.append("sms", campaign.sms);
      fd.append("url", campaign.url);
      if (audioFile) fd.append("audio", audioFile);

      const res = await fetch("/api/integrations/campaign-submit", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error);
      }
    } catch (err) {
      setSubmitting(false);
      showToast(
        err instanceof Error && err.message
          ? err.message
          : "Could not submit right now. Please try again.",
      );
      return;
    }

    writeAdvertiser({
      name: input.name,
      email: input.email,
      company: input.company,
      phone: input.phone,
    });
    const submittedCampaign: SellerCampaign = {
      ...campaign,
      submitted: true,
      submittedAt: Date.now(),
    };
    writeCampaign(submittedCampaign);
    setCampaign(submittedCampaign);
    setSubmitting(false);
    setShowAccountModal(false);
    setConfirmed(true);
  };

  const createAnother = () => {
    setCampaign(DEFAULT_DRAFT_CAMPAIGN);
    setPolicyChecked(false);
    setAdvancedTargeting([]);
    setConfirmed(false);
    setStep(0);
    setAudioFile(null);
    if (budgetInputRef.current)
      budgetInputRef.current.value = String(DEFAULT_DRAFT_CAMPAIGN.budget);
  };

  if (confirmed) {
    return <CampaignConfirmation onCreateAnother={createAnother} />;
  }

  return (
    <div className={styles["seller-builder"]}>
      <div className={styles["seller-builder-inner"]}>
        <header className={styles["seller-builder-head"]}>
          <div>
            <span className="route-kicker">
              Seller Ads &middot; Campaign creation
            </span>
            <h1>Create your campaign</h1>
            <p>
              Build, preview, estimate, and submit your campaign from one
              focused workspace.
            </p>
          </div>
        </header>

        <div className={styles["seller-grid"]}>
          <form id="sellerCampaignForm" ref={formRef} onSubmit={onFormSubmit}>
            <div className={styles["seller-stepper-nav"]}>
              {STEPS.map((label, i) => (
                <button
                  type="button"
                  key={label}
                  className={cn(
                    styles["seller-stepper-dot"],
                    i === step
                      ? styles.active
                      : i < step
                        ? styles.done
                        : undefined,
                  )}
                  onClick={() => i < step && setStep(i)}
                  disabled={i > step}
                >
                  <span className={styles["seller-stepper-num"]}>{i + 1}</span>
                  <span className={styles["seller-stepper-label"]}>
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {/* Section 1 — Campaign setup */}
            {step === 0 && (
              <section className={styles["seller-section"]}>
                <div className={styles["seller-section-head"]}>
                  <div className={styles["seller-num"]}>1</div>
                  <div>
                    <h2>Campaign setup</h2>
                    <p>Give the campaign a name, objective, and timeframe.</p>
                  </div>
                </div>
                <div className={styles["seller-stack"]}>
                  <div className="seller-field">
                    <label htmlFor="sellerName">Campaign name</label>
                    <input
                      id="sellerName"
                      value={campaign.name}
                      placeholder="e.g. Summer Sale Lahore"
                      maxLength={80}
                      required
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <span className="seller-label">
                      What do you want to achieve?
                    </span>
                    <div
                      className={styles["seller-chips"]}
                      id="sellerObjectives"
                    >
                      {OBJECTIVES.map((o) => (
                        <button
                          key={o}
                          type="button"
                          className={cn(
                            styles["seller-chip"],
                            campaign.objective === o && styles.selected,
                          )}
                          onClick={() => update("objective", o)}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={styles["seller-row"]}>
                    <DatePickerField
                      label="Start date"
                      id="sellerStart"
                      value={campaign.start}
                      onChange={(value) => update("start", value)}
                    />
                    <DatePickerField
                      label="End date"
                      id="sellerEnd"
                      value={campaign.end}
                      onChange={(value) => update("end", value)}
                      min={campaign.start}
                    />
                  </div>
                  <details>
                    <summary>Advanced campaign settings</summary>
                    <div
                      className={styles["seller-row"]}
                      style={{ marginTop: 12 }}
                    >
                      <div className="seller-field">
                        <label htmlFor="sellerFreq">Frequency cap</label>
                        <select
                          id="sellerFreq"
                          defaultValue="2 per day, recommended"
                        >
                          <option>2 per day, recommended</option>
                          <option>1 per day</option>
                          <option>3 per day</option>
                        </select>
                      </div>
                      <div className="seller-field">
                        <label>Schedule</label>
                        <select defaultValue="All day">
                          <option>All day</option>
                          <option>Business hours</option>
                          <option>Custom</option>
                        </select>
                      </div>
                    </div>
                  </details>
                </div>
                <div className={styles["seller-step-actions"]}>
                  <span />
                  <button type="button" className="btn fill" onClick={goNext}>
                    Continue
                  </button>
                </div>
              </section>
            )}

            {/* Section 2 — Budget */}
            {step === 1 && (
              <section
                className={cn(styles["seller-section"], styles.highlight)}
              >
                <div className={styles["seller-section-head"]}>
                  <div className={styles["seller-num"]}>2</div>
                  <div>
                    <h2>Set your budget</h2>
                    <p>
                      See the impact of spend before you configure the rest.
                    </p>
                  </div>
                </div>
                <div className={styles["seller-stack"]}>
                  <div className={styles["seller-chips"]}>
                    <button
                      type="button"
                      className={cn(
                        styles["seller-chip"],
                        budgetMode === "total" && styles.selected,
                      )}
                      onClick={() => switchBudgetMode("total")}
                    >
                      Total budget
                    </button>
                    <button
                      type="button"
                      className={cn(
                        styles["seller-chip"],
                        budgetMode === "daily" && styles.selected,
                      )}
                      onClick={() => switchBudgetMode("daily")}
                    >
                      Daily budget
                    </button>
                  </div>
                  <div>
                    <div className={styles["seller-budget-line"]}>
                      <span>
                        {budgetMode === "daily" ? "Daily budget" : "Budget"}
                      </span>
                      <span id="sellerBudgetText">
                        {budgetMode === "daily"
                          ? `${formatPKR(campaign.budget / days)} / day`
                          : formatPKR(campaign.budget)}
                      </span>
                    </div>
                    <input
                      className={styles["seller-range"]}
                      id="sellerBudgetRange"
                      type="range"
                      min={budgetMode === "daily" ? 5000 : 100000}
                      max={budgetMode === "daily" ? 500000 : 2000000}
                      step={budgetMode === "daily" ? 5000 : 50000}
                      value={
                        budgetMode === "daily"
                          ? Math.min(500000, Math.round(campaign.budget / days))
                          : Math.min(2000000, campaign.budget)
                      }
                      onChange={(e) => onBudgetSliderChange(e.target.value)}
                    />
                  </div>
                  <div className="seller-field">
                    <label htmlFor="sellerBudgetInput">
                      {budgetMode === "daily"
                        ? "Amount per day"
                        : "Budget amount"}
                    </label>
                    <input
                      ref={budgetInputRef}
                      id="sellerBudgetInput"
                      type="number"
                      min={budgetMode === "daily" ? 5000 : 100000}
                      max={budgetMode === "daily" ? 2500000 : 25000000}
                      step={budgetMode === "daily" ? 1000 : 25000}
                      defaultValue={campaign.budget}
                      onChange={(e) => onBudgetAmountChange(e.target.value)}
                    />
                  </div>
                  <div
                    id="sellerBudgetSummary"
                    style={{ color: "#929bab", fontSize: 12 }}
                  >
                    {formatPKR(campaign.budget)} over {days} days, about{" "}
                    {formatPKR(campaign.budget / days)} per day
                  </div>
                </div>
                <div className={styles["seller-step-actions"]}>
                  <button type="button" className="btn" onClick={goBack}>
                    Back
                  </button>
                  <button type="button" className="btn fill" onClick={goNext}>
                    Continue
                  </button>
                </div>
              </section>
            )}

            {/* Section 3 — Audience */}
            {step === 2 && (
              <section className={styles["seller-section"]}>
                <div className={styles["seller-section-head"]}>
                  <div className={styles["seller-num"]}>3</div>
                  <div>
                    <h2>Choose your audience</h2>
                    <p>
                      Keep the core targeting decisions visible and the advanced
                      options tucked away.
                    </p>
                  </div>
                </div>
                <div className={styles["seller-stack"]}>
                  <div>
                    <span className="seller-label">Location</span>
                    <div
                      className={styles["seller-chips"]}
                      id="sellerLocations"
                    >
                      <button
                        type="button"
                        className={cn(
                          styles["seller-chip"],
                          campaign.location === "Pakistan" && styles.selected,
                        )}
                        onClick={() => update("location", "Pakistan")}
                      >
                        Pakistan
                      </button>
                      <button
                        type="button"
                        className={cn(
                          styles["seller-chip"],
                          campaign.location === "Cities" && styles.selected,
                        )}
                        onClick={() => update("location", "Cities")}
                      >
                        Choose locations
                      </button>
                    </div>
                  </div>
                  {campaign.location === "Cities" ? (
                    <CityPickerField
                      value={campaign.cities}
                      onChange={(cities) => update("cities", cities)}
                    />
                  ) : null}
                  <div>
                    <div className={styles["seller-budget-line"]}>
                      <span>Age</span>
                      <span id="sellerAgeText">{ageLabel}</span>
                    </div>
                    <div className={styles["seller-range-dual"]}>
                      <div className={styles["range-track"]} />
                      <div
                        className={styles["range-track-fill"]}
                        style={{
                          left: `${((campaign.ageMin - AGE_MIN) / (AGE_MAX - AGE_MIN)) * 100}%`,
                          right: `${100 - ((campaign.ageMax - AGE_MIN) / (AGE_MAX - AGE_MIN)) * 100}%`,
                        }}
                      />
                      <input
                        className={styles["seller-range"]}
                        id="sellerAgeMin"
                        type="range"
                        min={AGE_MIN}
                        max={AGE_MAX}
                        value={campaign.ageMin}
                        aria-label="Minimum age"
                        onChange={(e) =>
                          update(
                            "ageMin",
                            Math.min(Number(e.target.value), campaign.ageMax),
                          )
                        }
                      />
                      <input
                        className={styles["seller-range"]}
                        id="sellerAgeMax"
                        type="range"
                        min={AGE_MIN}
                        max={AGE_MAX}
                        value={campaign.ageMax}
                        aria-label="Maximum age"
                        onChange={(e) =>
                          update(
                            "ageMax",
                            Math.max(Number(e.target.value), campaign.ageMin),
                          )
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <span className="seller-label">Gender</span>
                    <div className={styles["seller-chips"]} id="sellerGender">
                      {GENDERS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          className={cn(
                            styles["seller-chip"],
                            campaign.gender === g && styles.selected,
                          )}
                          onClick={() => update("gender", g)}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <details>
                    <summary>Advanced targeting</summary>
                    <div
                      className={styles["seller-chips"]}
                      style={{ marginTop: 12 }}
                    >
                      {ADVANCED_TARGETING_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          className={cn(
                            styles["seller-chip"],
                            advancedTargeting.includes(chip) && styles.selected,
                          )}
                          onClick={() => toggleAdvancedChip(chip)}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </details>
                </div>
                <div className={styles["seller-step-actions"]}>
                  <button type="button" className="btn" onClick={goBack}>
                    Back
                  </button>
                  <button type="button" className="btn fill" onClick={goNext}>
                    Continue
                  </button>
                </div>
              </section>
            )}

            {/* Section 4 — Creative */}
            {step === 3 && (
              <section className={styles["seller-section"]}>
                <div className={styles["seller-section-head"]}>
                  <div className={styles["seller-num"]}>4</div>
                  <div>
                    <h2>Add your ad</h2>
                    <p>
                      Upload the audio, choose its language, then build the SMS
                      &amp; WhatsApp follow up.
                    </p>
                  </div>
                </div>
                <div className={styles["seller-stack"]}>
                  <div>
                    <span className="seller-label">Audio ad</span>
                    <div className={styles["seller-upload"]}>
                      {!campaign.audio ? (
                        <div id="sellerUploadIdle">
                          <b>Upload your audio ad</b>
                          <p>MP3 or WAV, short form audio spot</p>
                          <button
                            type="button"
                            className="btn"
                            onClick={() => audioFileRef.current?.click()}
                          >
                            Choose file
                          </button>
                        </div>
                      ) : (
                        <div id="sellerAudioReady">
                          <b id="sellerAudioName">
                            {campaign.audioName || "seller-ad-urdu.wav"}
                          </b>
                          <div className={styles.wave}>
                            {WAVE_HEIGHTS.map((h, i) => (
                              <i key={i} style={{ height: h }} />
                            ))}
                          </div>
                          {audioUrl ? (
                            <audio controls src={audioUrl} />
                          ) : (
                            <p
                              className="helper"
                              style={{ textAlign: "center" }}
                            >
                              Re-upload the file to preview playback.
                            </p>
                          )}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 8,
                              marginTop: 8,
                            }}
                          >
                            <button
                              type="button"
                              className="btn"
                              onClick={() => audioFileRef.current?.click()}
                            >
                              Replace
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      ref={audioFileRef}
                      id="sellerAudioFile"
                      type="file"
                      accept="audio/mpeg,audio/wav,audio/x-wav"
                      hidden
                      onChange={onAudioChange}
                    />
                  </div>
                  <div>
                    <span className="seller-label">Ad language</span>
                    <div
                      className={styles["seller-chips"]}
                      id="sellerLanguages"
                    >
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          className={cn(
                            styles["seller-chip"],
                            campaign.languages.includes(lang) &&
                              styles.selected,
                          )}
                          onClick={() => toggleLanguage(lang)}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,.1)",
                      paddingTop: 18,
                    }}
                  >
                    <div className={styles["seller-preview-grid"]}>
                      <div className={styles["seller-stack"]}>
                        <div className="seller-field">
                          <label htmlFor="sellerSms">SMS & WhatsApp text</label>
                          <textarea
                            id="sellerSms"
                            maxLength={160}
                            value={campaign.sms}
                            placeholder="Get 20% off today. Shop now."
                            onChange={(e) => update("sms", e.target.value)}
                          />
                          <small id="sellerSmsCount">
                            {campaign.sms.length} / 160
                          </small>
                        </div>
                        <div className="seller-field">
                          <label htmlFor="sellerUrl">Destination link</label>
                          <input
                            id="sellerUrl"
                            type="url"
                            value={campaign.url}
                            placeholder="https://example.com/sale"
                            onChange={(e) => update("url", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <span className="route-kicker">
                          Live SMS & WhatsApp preview
                        </span>
                        <div className={styles["seller-phone"]}>
                          <strong>Your Brand</strong>
                          <div className={styles.bubble}>
                            <div id="sellerSmsPreview">
                              {campaign.sms ||
                                "Your SMS & WhatsApp message will appear here."}
                            </div>
                            <div
                              id="sellerUrlPreview"
                              style={{
                                color: "#ff6a98",
                                marginTop: 8,
                                wordBreak: "break-all",
                              }}
                            >
                              {campaign.url || "Destination link"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      border: "1px solid rgba(255,79,132,.28)",
                      background: "rgba(255,25,114,.05)",
                      borderRadius: 14,
                      padding: 15,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <b>Preview complete ad experience</b>
                      <p>
                        Listen to the audio and see the SMS &amp; WhatsApp
                        sequence together.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn fill"
                      id="sellerFullPreview"
                      onClick={() => setShowPreview(true)}
                    >
                      &#9658; Preview full ad
                    </button>
                  </div>
                </div>
                <div className={styles["seller-step-actions"]}>
                  <button type="button" className="btn" onClick={goBack}>
                    Back
                  </button>
                  <button type="button" className="btn fill" onClick={goNext}>
                    Continue
                  </button>
                </div>
              </section>
            )}

            {/* Section 5 — Review & submit */}
            {step === 4 && (
              <section className={styles["seller-section"]}>
                <div className={styles["seller-section-head"]}>
                  <div className={styles["seller-num"]}>5</div>
                  <div>
                    <h2>Review &amp; submit</h2>
                    <p>Final campaign summary before submission.</p>
                  </div>
                </div>
                <div
                  id="sellerReviewGrid"
                  className={styles["seller-review-grid"]}
                >
                  {reviewItems.map(([k, v]) => (
                    <div className="seller-review-card" key={k}>
                      <small style={{ color: "#80899a" }}>{k}</small>
                      <b style={{ display: "block", marginTop: 4 }}>{v}</b>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 14,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "center",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 12,
                    padding: 13,
                  }}
                >
                  <div>
                    <b>Creative preview</b>
                    <p>Check the complete customer experience one last time.</p>
                  </div>
                  <button
                    type="button"
                    className="btn"
                    id="sellerReviewPreview"
                    onClick={() => setShowPreview(true)}
                  >
                    &#9658; Preview ad
                  </button>
                </div>
                <label className={styles["seller-policy"]}>
                  <input
                    id="sellerPolicy"
                    type="checkbox"
                    checked={policyChecked}
                    onChange={(e) => setPolicyChecked(e.target.checked)}
                  />
                  <span>I agree to the Seller Ads Advertising Policy.</span>
                </label>
                <div
                  className={styles["seller-step-actions"]}
                  style={{ marginTop: 13 }}
                >
                  <button type="button" className="btn" onClick={goBack}>
                    Back
                  </button>
                  <button
                    className="btn fill"
                    id="sellerSubmit"
                    type="submit"
                    style={{ flex: 1 }}
                    disabled={!policyChecked}
                  >
                    Submit campaign for review
                  </button>
                </div>
              </section>
            )}
          </form>

          <aside className={styles["seller-aside"]}>
            <div className={styles["seller-estimate"]}>
              <span className={styles.live}>Live</span>
              <span className="route-kicker">Estimated results</span>
              <div className={styles["seller-metrics"]}>
                <div className={styles["seller-metric"]}>
                  <span>Potential audience</span>
                  <b id="sellerPotential">{estimate.potential.toFixed(1)}M</b>
                </div>
                <div className={styles["seller-metric"]}>
                  <span>Estimated reach</span>
                  <b id="sellerReach">
                    {estimate.reachLow.toFixed(1)}M to{" "}
                    {estimate.reachHigh.toFixed(1)}M
                  </b>
                </div>
                <div className={styles["seller-metric"]}>
                  <span>Impressions</span>
                  <b id="sellerImpressions">
                    {estimate.impressionsLow.toFixed(1)}M to{" "}
                    {estimate.impressionsHigh.toFixed(1)}M
                  </b>
                </div>
                <div className={styles["seller-metric"]}>
                  <span>SMS &amp; WhatsApp delivered</span>
                  <b id="sellerSmsDelivered">
                    {estimate.smsLow.toFixed(1)}M to{" "}
                    {estimate.smsHigh.toFixed(1)}M
                  </b>
                </div>
              </div>
              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,.1)",
                  margin: "20px 0",
                }}
              />
              <small>Your budget</small>
              <h2 id="sellerSideBudget">{formatPKR(campaign.budget)}</h2>
              <div className={styles["seller-strength"]}>
                <b>
                  Campaign strength:{" "}
                  <span id="sellerStrength">{estimate.strength}</span>
                </b>
                <p id="sellerStrengthTip">{estimate.tip}</p>
              </div>
              <p style={{ fontSize: 10, marginTop: 14 }}>
                Illustrative estimates only. Production values should use
                approved delivery and commercial data.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {showPreview ? (
        <AdPreviewModal
          sms={campaign.sms}
          onClose={() => setShowPreview(false)}
        />
      ) : null}
      {showAccountModal ? (
        <SellerContactModal
          onClose={() => setShowAccountModal(false)}
          onSubmit={onAccountSubmit}
          submitting={submitting}
        />
      ) : null}
    </div>
  );
}

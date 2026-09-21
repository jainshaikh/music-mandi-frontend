"use client";

import Link from "next/link";
import { useRef, useState, FormEvent } from "react";
import Field from "@/components/public/Field";
import MultiSelectField from "@/components/public/forms/MultiSelectField";
import ArtistNameSearchField from "@/components/public/forms/ArtistNameSearchField";
import ConfirmCard from "@/components/public/ConfirmCard";
import { validateForm } from "@/lib/validateForm";
import { showToast } from "@/lib/toast";
import type { SpotifySearchArtist } from "@/app/api/integrations/spotify-search/route";
import styles from "./ArtistSubmitForm.module.css";

const GENRES = [
  "Pop",
  "Hip-hop",
  "Rock",
  "Electronic",
  "Folk",
  "Classical",
  "Other",
];

// Posts to /api/integrations/artist-submit — an interim, frontend-hosted
// SendGrid route standing in for the real backend (see docs/DECISIONS.md
// DEC-017), including any uploaded files as email attachments. The Spotify
// auto-fill search (ArtistNameSearchField) is now wired up too, against the
// interim /api/integrations/spotify-search route (DEC-018).
export default function ArtistSubmitForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [artistName, setArtistName] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");

  const onSelectSpotifyArtist = (artist: SpotifySearchArtist) => {
    setSpotifyUrl(artist.externalUrl ?? "");
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form || !validateForm(form)) return;

    setStatus("submitting");

    try {
      const res = await fetch("/api/integrations/artist-submit", {
        method: "POST",
        body: new FormData(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error);
      }
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      showToast(
        err instanceof Error && err.message
          ? err.message
          : "Could not submit right now. Please try again.",
      );
    }
  };

  if (status === "done") {
    return (
      <ConfirmCard
        title="Got it. We're listening."
        actions={
          <>
            <Link className="btn fill" href="/">
              Back to Home
            </Link>
            <a
              className="btn"
              href="https://instagram.com"
              target="_blank"
              rel="noopener"
            >
              Follow us on Instagram
            </a>
          </>
        }
      >
        Your submission is with our A&amp;R team. If it&apos;s a fit,
        you&apos;ll hear from us within the confirmed review window. Either way,
        keep making records.
      </ConfirmCard>
    );
  }

  if (status === "submitting") {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>Submitting&hellip;</div>
    );
  }

  return (
    <form
      className="form-card"
      id="artistForm"
      ref={formRef}
      onSubmit={onSubmit}
    >
      <div className={styles["form-grid"]}>
        <Field
          label="Full name"
          name="fullName"
          placeholder="e.g. Ayesha Khan"
          required
        />
        <ArtistNameSearchField
          value={artistName}
          onValueChange={setArtistName}
          onSelectArtist={onSelectSpotifyArtist}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          placeholder="+92 300 1234567"
          required
        />
        <Field label="City" name="city" placeholder="e.g. Lahore" required />
        <MultiSelectField
          label="Genre"
          name="genre"
          options={GENRES}
          required
          error="Choose at least one genre."
        />
        <div className="field full">
          <label htmlFor="musicLink">Link to your music</label>
          <input
            id="musicLink"
            name="musicLink"
            type="url"
            placeholder="https://open.spotify.com/track/..."
            required
          />
          <span className="helper">
            Spotify, SoundCloud, YouTube, or Google Drive all work.
          </span>
          <span className="error">Add a valid https:// link.</span>
        </div>
        <div className="field full">
          <label htmlFor="files">Upload files (optional)</label>
          <input
            id="files"
            name="files"
            type="file"
            accept="audio/mpeg,audio/wav"
            multiple
          />
          <span className="helper">
            MP3 or WAV, up to 15MB per file (20MB total). Prefer a bigger file?
            Use the music link above instead.
          </span>
        </div>
        <Field
          label="Instagram"
          name="instagram"
          type="url"
          placeholder="https://instagram.com/yourhandle"
        />
        <Field
          label="YouTube"
          name="youtube"
          type="url"
          placeholder="https://youtube.com/@yourchannel"
        />
        <Field
          label="Spotify"
          name="spotify"
          type="url"
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.target.value)}
          helper="Filled in automatically when you pick a match above — edit or clear it any time."
          placeholder="https://open.spotify.com/artist/..."
        />
        <div className="field full">
          <label htmlFor="bio">Tell us about yourself</label>
          <textarea
            id="bio"
            name="bio"
            placeholder="A few lines about your sound, influences, and story."
            required
          />
          <span className="error">Tell us a little about yourself.</span>
        </div>
        <Field
          label="How did you hear about us?"
          name="heard"
          placeholder="e.g. Instagram, a friend, Google"
        />
      </div>
      <div className={styles["form-actions"]}>
        <button className="btn fill" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}

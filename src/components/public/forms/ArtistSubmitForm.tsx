"use client";

import Link from "next/link";
import { useRef, useState, FormEvent } from "react";

import Field from "@/components/public/Field";
import ArtistNameSearchField from "@/components/public/forms/ArtistNameSearchField";
import GenreMultiSelectField from "@/components/public/forms/GenreMultiSelectField";
import ConfirmCard from "@/components/public/ConfirmCard";

import { validateForm } from "@/lib/validateForm";

import {
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_LABEL,
  SUBMIT_FALLBACK_ERROR,
  submissionErrorMessage,
  totalFileBytes,
} from "@/lib/formSubmission";

import type { SpotifySearchArtist } from "@/app/api/integrations/spotify-search/route";

import styles from "./ArtistSubmitForm.module.css";

const COMMON_GENRES = [
  "pop",
  "hip-hop",
  "r-n-b",
  "rock",
  "electronic",
  "indie",
  "folk",
  "classical",
  "jazz",
  "soul",
  "alternative",
  "other",
];

// Posts to /api/integrations/artist-submit — an interim,
// frontend-hosted SendGrid route standing in for the real backend
// (see docs/DECISIONS.md DEC-017), including any uploaded
// files as email attachments.
//
// Spotify artist auto-fill uses
// /api/integrations/spotify-search.
//
// Genre suggestions use
// /api/integrations/spotify-genres.
export default function ArtistSubmitForm() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  const [artistName, setArtistName] = useState("");

  const [spotifyUrl, setSpotifyUrl] = useState("");

  const [submitError, setSubmitError] = useState("");

  const [genres, setGenres] = useState<string[]>([]);

  const [artistGenres, setArtistGenres] = useState<string[]>([]);

  const [genreError, setGenreError] = useState(false);

  // Toggled on the DOM like validateForm's `.invalid`,
  // so the file field shares the same error styling
  // as every other field.
  const checkFileSize = (input: HTMLInputElement | null) => {
    const tooLarge = totalFileBytes(input?.files ?? []) > MAX_UPLOAD_BYTES;

    input?.closest(".field")?.classList.toggle("invalid", tooLarge);

    return !tooLarge;
  };

  // Remembers what the last Spotify artist selection
  // filled in.
  //
  // If the artist name is edited afterwards we clear
  // the Spotify URL because it may no longer match.
  const pickedRef = useRef<{
    name: string;
    url: string;
  } | null>(null);

  const onArtistNameChange = (name: string) => {
    setArtistName(name);

    const picked = pickedRef.current;

    if (picked && name !== picked.name) {
      if (spotifyUrl === picked.url) {
        setSpotifyUrl("");
      }

      pickedRef.current = null;

      // The Spotify artist no longer matches the text,
      // so remove artist-specific suggestions.
      //
      // We DO NOT remove genres the user already selected.
      setArtistGenres([]);
    }
  };

  const onSelectSpotifyArtist = (artist: SpotifySearchArtist) => {
    const url = artist.externalUrl ?? "";

    pickedRef.current = {
      name: artist.name,
      url,
    };

    setSpotifyUrl(url);

    // Spotify artist search already gives us
    // associated genres, so use them as recommendations.
    setArtistGenres(artist.genres ?? []);
  };

  const onGenreChange = (nextGenres: string[]) => {
    setGenres(nextGenres);

    if (nextGenres.length > 0) {
      setGenreError(false);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = formRef.current;

    if (!form || !validateForm(form)) {
      return;
    }

    // GenreMultiSelectField is custom UI,
    // so validate it ourselves.
    if (genres.length === 0) {
      setGenreError(true);

      const genreSearch = document.getElementById("genre-search");

      genreSearch?.focus();

      return;
    }

    setGenreError(false);

    const filesInput = form.elements.namedItem("files");

    if (filesInput instanceof HTMLInputElement && !checkFileSize(filesInput)) {
      filesInput.focus();
      return;
    }

    setStatus("submitting");
    setSubmitError("");

    let message = SUBMIT_FALLBACK_ERROR;

    try {
      const formData = new FormData(form);

      /*
       * GenreMultiSelectField renders one hidden input
       * for each selected genre:
       *
       * genre=pop
       * genre=rock
       * genre=indie
       *
       * So FormData already contains the genres here.
       */

      const res = await fetch("/api/integrations/artist-submit", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setStatus("done");
        return;
      }

      message = await submissionErrorMessage(res);
    } catch {
      // Network failure — keep
      // the generic message.
    }

    setStatus("idle");
    setSubmitError(message);
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
          onValueChange={onArtistNameChange}
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

        <GenreMultiSelectField
          label="Genre"
          name="genre"
          commonOptions={COMMON_GENRES}
          recommendedOptions={artistGenres}
          value={genres}
          onChange={onGenreChange}
          required
          invalid={genreError}
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
            onChange={(e) => checkFileSize(e.currentTarget)}
          />

          <span className="helper">
            MP3 or WAV, up to {MAX_UPLOAD_LABEL} in total. Bigger file? Use the
            music link above instead.
          </span>

          <span className="error">
            These files add up to more than {MAX_UPLOAD_LABEL}. Remove some, or
            share a link to your music above instead.
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
          autoComplete="off"
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
        {submitError ? (
          <p role="alert" className="mr-auto self-center text-sm text-rose-400">
            {submitError}
          </p>
        ) : null}

        <button
          className="btn fill"
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting…" : "Submit"}
        </button>
      </div>
    </form>
  );
}

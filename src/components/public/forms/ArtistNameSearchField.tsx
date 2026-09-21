"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { SpotifySearchArtist } from "@/app/api/integrations/spotify-search/route";
import styles from "./ArtistNameSearchField.module.css";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  onSelectArtist: (artist: SpotifySearchArtist) => void;
};

// Type-ahead over the Spotify artist search API (an interim, frontend-hosted
// route — see docs/DECISIONS.md DEC-018). Selecting a result fills in the
// canonical name + Spotify link; typing without selecting anything is just
// as valid a submission — not every artist has to be on Spotify.
export default function ArtistNameSearchField({
  value,
  onValueChange,
  onSelectArtist,
}: Props) {
  const [results, setResults] = useState<SpotifySearchArtist[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/integrations/spotify-search?q=${encodeURIComponent(q)}&limit=6`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setResults(data.artists ?? []);
        setOpen(true);
      } catch {
        // Search is a convenience on top of a free-text field, not a
        // requirement — a failed/aborted lookup just leaves the list empty.
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  const query = value.trim();
  const showDropdown =
    query.length >= 2 && open && (loading || results.length > 0);

  return (
    <div className={cn("field", styles["artist-search-field"])} ref={rootRef}>
      <label htmlFor="artistName">Artist or band name</label>
      <input
        id="artistName"
        name="artistName"
        value={value}
        placeholder="e.g. Young Stunners"
        autoComplete="off"
        required
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
      />
      {showDropdown ? (
        <ul className={styles["artist-search-results"]}>
          {loading ? (
            <li className={styles["artist-search-status"]}>
              Searching Spotify&hellip;
            </li>
          ) : (
            results.map((artist) => (
              <li key={artist.id}>
                <button
                  type="button"
                  onClick={() => {
                    onValueChange(artist.name);
                    onSelectArtist(artist);
                    setOpen(false);
                  }}
                >
                  {artist.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- external Spotify CDN thumbnail, not worth whitelisting in next.config for a decorative dropdown icon
                    <img src={artist.image} alt="" />
                  ) : (
                    <span
                      className={styles["artist-search-avatar-fallback"]}
                      aria-hidden="true"
                    />
                  )}
                  <span>
                    <b>{artist.name}</b>
                    {artist.genres.length > 0 ? (
                      <small>{artist.genres.slice(0, 2).join(", ")}</small>
                    ) : null}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
      <span className="helper">
        Search finds your Spotify profile automatically. Can&apos;t find
        yourself? Just type your name — that&apos;s fine too.
      </span>
      <span className="error">Check this field.</span>
    </div>
  );
}

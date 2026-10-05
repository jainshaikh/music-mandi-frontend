"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

import { cn } from "@/lib/utils";
import styles from "./GenreMultiSelectField.module.css";

interface GenreMultiSelectFieldProps {
  label: string;
  name: string;

  /**
   * Genres always shown before the user searches.
   *
   * Example:
   * ["pop", "hip-hop", "rock"]
   */
  commonOptions?: string[];

  /**
   * Genres returned by the selected Spotify artist.
   */
  recommendedOptions?: string[];

  /**
   * Currently selected genre values.
   */
  value: string[];

  /**
   * Called whenever genres are selected/removed.
   */
  onChange: (genres: string[]) => void;

  required?: boolean;
  error?: string;
  invalid?: boolean;
}

const GENRE_LABELS: Record<string, string> = {
  "r-n-b": "R&B",
  "hip-hop": "Hip-Hop",
  edm: "EDM",
  "drum-and-bass": "Drum & Bass",
  "rock-n-roll": "Rock & Roll",
};

function normalizeGenre(value: string) {
  return value.trim().toLowerCase();
}

function formatGenreName(value: string) {
  const normalized = normalizeGenre(value);

  if (GENRE_LABELS[normalized]) {
    return GENRE_LABELS[normalized];
  }

  return normalized
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => {
      if (word.length <= 3 && word === word.toUpperCase()) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function uniqueGenres(genres: string[]) {
  const values = new Map<string, string>();

  for (const genre of genres) {
    const normalized = normalizeGenre(genre);

    if (!normalized) continue;

    if (!values.has(normalized)) {
      values.set(normalized, normalized);
    }
  }

  return Array.from(values.values());
}

export default function GenreMultiSelectField({
  label,
  name,
  commonOptions = [],
  recommendedOptions = [],
  value,
  onChange,
  required = false,
  error = "Choose at least one genre.",
  invalid = false,
}: GenreMultiSelectFieldProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState("");
  const [spotifyGenres, setSpotifyGenres] = useState<string[]>([]);
  const [genresLoaded, setGenresLoaded] = useState(false);
  const [genresLoading, setGenresLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const selected = useMemo(() => uniqueGenres(value), [value]);

  const recommended = useMemo(
    () => uniqueGenres(recommendedOptions),
    [recommendedOptions],
  );

  const common = useMemo(() => uniqueGenres(commonOptions), [commonOptions]);

  const allGenres = useMemo(
    () => uniqueGenres([...recommended, ...common, ...spotifyGenres]),
    [recommended, common, spotifyGenres],
  );

  const loadGenres = async () => {
    if (genresLoaded || genresLoading) {
      return;
    }

    setGenresLoading(true);

    try {
      const response = await fetch("/api/integrations/spotify-genres");

      if (!response.ok) {
        throw new Error(`Genre request failed (${response.status})`);
      }

      const data = (await response.json()) as {
        genres?: string[];
      };

      setSpotifyGenres(uniqueGenres(data.genres ?? []));
    } catch (error) {
      console.error("Unable to load Spotify genres:", error);
    } finally {
      setGenresLoaded(true);
      setGenresLoading(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const addGenre = (genre: string) => {
    const normalized = normalizeGenre(genre);

    if (!normalized || selected.includes(normalized)) {
      setQuery("");
      return;
    }

    onChange([...selected, normalized]);
    setQuery("");
    setIsOpen(true);
  };

  const removeGenre = (genre: string) => {
    onChange(selected.filter((selectedGenre) => selectedGenre !== genre));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsOpen(true);
  };

  const normalizedQuery = normalizeGenre(query);

  const searchResults = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return allGenres
      .filter((genre) => !selected.includes(genre))
      .filter((genre) => {
        const genreValue = normalizeGenre(genre);
        const genreLabel = formatGenreName(genre).toLowerCase();

        return (
          genreValue.includes(normalizedQuery) ||
          genreLabel.includes(normalizedQuery)
        );
      })
      .sort((a, b) => {
        const aValue = normalizeGenre(a);
        const bValue = normalizeGenre(b);

        const aLabel = formatGenreName(a).toLowerCase();
        const bLabel = formatGenreName(b).toLowerCase();

        const aStarts =
          aValue.startsWith(normalizedQuery) ||
          aLabel.startsWith(normalizedQuery);

        const bStarts =
          bValue.startsWith(normalizedQuery) ||
          bLabel.startsWith(normalizedQuery);

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return aLabel.localeCompare(bLabel);
      })
      .slice(0, 12);
  }, [allGenres, normalizedQuery, selected]);

  const visibleRecommended = recommended.filter(
    (genre) => !selected.includes(genre),
  );

  const visibleCommon = common.filter((genre) => !selected.includes(genre));

  const showSearchResults = isOpen && normalizedQuery.length > 0;

  const showSuggestions =
    !normalizedQuery &&
    (visibleRecommended.length > 0 || visibleCommon.length > 0);

  return (
    <div ref={wrapperRef} className={cn("field full", invalid && "invalid")}>
      <label htmlFor={`${name}-search`}>{label}</label>

      {/*
        These hidden inputs ensure FormData contains:

        genre=pop
        genre=rock
        genre=indie
      */}
      {selected.map((genre) => (
        <input key={genre} type="hidden" name={name} value={genre} />
      ))}

      <div className={styles.searchWrapper}>
        <input
          id={`${name}-search`}
          type="text"
          className={cn(
            styles.searchInput,
            genresLoading && styles.searchInputLoading,
          )}
          value={query}
          autoComplete="off"
          placeholder="Search genres…"
          aria-required={required}
          onFocus={() => {
            setIsOpen(true);
            void loadGenres();
          }}
          onChange={handleInputChange}
        />

        {genresLoading ? (
          <span className={styles.loading}>Loading...</span>
        ) : null}

        {showSearchResults ? (
          <div
            className={styles.dropdown}
            role="listbox"
            aria-label="Genre suggestions"
          >
            {searchResults.length > 0 ? (
              searchResults.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  role="option"
                  aria-selected="false"
                  className={styles.dropdownOption}
                  onMouseDown={(event) => {
                    // Prevent the text field losing focus
                    // before the click can run.
                    event.preventDefault();
                  }}
                  onClick={() => addGenre(genre)}
                >
                  {formatGenreName(genre)}
                </button>
              ))
            ) : (
              <div className={styles.empty}>No matching genres found.</div>
            )}
          </div>
        ) : null}
      </div>

      {selected.length > 0 ? (
        <div className={styles.selectedGenres}>
          {selected.map((genre) => (
            <span key={genre} className={styles.selectedGenre}>
              {formatGenreName(genre)}
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeGenre(genre)}
                aria-label={`Remove ${formatGenreName(genre)}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {showSuggestions ? (
        <div className={styles.suggestions}>
          {visibleRecommended.length > 0 ? (
            <div className={styles.section}>
              <span className={styles.sectionLabel}>
                Suggested from Spotify
              </span>

              <div className={styles.genreOptions}>
                {visibleRecommended.slice(0, 8).map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    className={styles.genreOption}
                    onClick={() => addGenre(genre)}
                  >
                    <span className={styles.addIcon} aria-hidden="true">
                      +
                    </span>
                    {formatGenreName(genre)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {visibleCommon.length > 0 ? (
            <div className={styles.section}>
              <span className={styles.sectionLabel}>Popular genres</span>

              <div className={styles.genreOptions}>
                {visibleCommon.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    className={styles.genreOption}
                    onClick={() => addGenre(genre)}
                  >
                    <span className={styles.addIcon} aria-hidden="true">
                      +
                    </span>
                    {formatGenreName(genre)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <span className="helper">
        Choose one or more genres. Start typing to search more.
      </span>

      <span className="error">{error}</span>
    </div>
  );
}

const TOKEN_URL = "https://accounts.spotify.com/api/token";

const GENRES_URL =
  "https://api.spotify.com/v1/recommendations/available-genre-seeds";

// Spotify has deprecated the genre-seeds endpoint,
// so this guarantees the form still works if Spotify stops returning it.
const FALLBACK_GENRES = [
  "acoustic",
  "alternative",
  "ambient",
  "blues",
  "classical",
  "country",
  "dance",
  "electronic",
  "folk",
  "funk",
  "hip-hop",
  "house",
  "indie",
  "indie-pop",
  "jazz",
  "metal",
  "pop",
  "punk",
  "r-n-b",
  "reggae",
  "rock",
  "soul",
  "techno",
  "world",
];

interface CachedToken {
  value: string;
  expiresAt: number;
}

interface CachedGenres {
  value: string[];
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;
let cachedGenres: CachedGenres | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Spotify is not configured. Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET.",
    );
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Spotify token request failed (${response.status})`);
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    value: data.access_token,
    // Refresh one minute before expiry.
    expiresAt: Date.now() + Math.max(data.expires_in - 60, 60) * 1000,
  };

  return cachedToken.value;
}

export async function GET() {
  // Genre data does not need to be requested repeatedly.
  // Keep it for 24 hours on the current server instance.
  if (cachedGenres && cachedGenres.expiresAt > Date.now()) {
    return Response.json({
      genres: cachedGenres.value,
      source: "spotify",
    });
  }

  try {
    const token = await getAccessToken();

    const response = await fetch(GENRES_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Spotify genre request failed (${response.status})`);
    }

    const data = (await response.json()) as {
      genres?: string[];
    };

    const genres = Array.from(
      new Set(
        (data.genres ?? [])
          .map((genre) => genre.trim().toLowerCase())
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));

    if (!genres.length) {
      throw new Error("Spotify returned an empty genre list.");
    }

    cachedGenres = {
      value: genres,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };

    return Response.json({
      genres,
      source: "spotify",
    });
  } catch (error) {
    console.error("Spotify genre fetch failed:", error);

    return Response.json({
      genres: FALLBACK_GENRES,
      source: "fallback",
    });
  }
}

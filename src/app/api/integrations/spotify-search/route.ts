// Interim, frontend-hosted implementation — see docs/DECISIONS.md DEC-017/DEC-018.
// Ported from music_mandi-website's own working /api/integrations/spotify-search.
//
// Spotify Web API — Client Credentials flow (server-to-server, no user context).
// Never expose SPOTIFY_CLIENT_SECRET to the browser — this route is the only place
// it's read. See https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const SEARCH_URL = "https://api.spotify.com/v1/search";

export interface SpotifySearchArtist {
  id: string;
  name: string;
  image: string | null;
  genres: string[];
  followers: number;
  popularity: number;
  externalUrl: string | null;
}

interface CachedToken {
  value: string;
  expiresAt: number;
}

// Module-level cache: survives across requests on the same warm server instance.
// Client Credentials tokens are app-wide (no per-user data), so one shared token is fine.
let cachedToken: CachedToken | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "Spotify search is not configured (missing SPOTIFY_CLIENT_ID/SPOTIFY_CLIENT_SECRET)",
    );
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`Spotify token request failed (${res.status})`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  // Refresh a bit early so we never serve a token that expires mid-flight.
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return Response.json({ artists: [] });
  }
  const limit = Math.max(
    1,
    Math.min(Number(searchParams.get("limit")) || 8, 10),
  );

  let token: string;
  try {
    token = await getAccessToken();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Spotify auth failed";
    return Response.json({ detail: message }, { status: 502 });
  }

  const url = `${SEARCH_URL}?q=${encodeURIComponent(q)}&type=artist&limit=${limit}`;
  let upstream: Response;
  try {
    upstream = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Spotify search unreachable";
    return Response.json({ detail: message }, { status: 502 });
  }

  if (upstream.status === 429) {
    const retryAfter = upstream.headers.get("retry-after");
    return Response.json(
      { detail: "Rate limited by Spotify — please try again shortly" },
      {
        status: 429,
        headers: retryAfter ? { "Retry-After": retryAfter } : undefined,
      },
    );
  }
  if (!upstream.ok) {
    return Response.json(
      { detail: `Spotify search failed (${upstream.status})` },
      { status: upstream.status },
    );
  }

  const data = await upstream.json();
  const items = (data?.artists?.items ?? []) as Array<{
    id: string;
    name: string;
    images?: { url: string }[];
    genres?: string[];
    followers?: { total?: number };
    popularity?: number;
    external_urls?: { spotify?: string };
  }>;

  const artists: SpotifySearchArtist[] = items.map((a) => ({
    id: a.id,
    name: a.name,
    // Images are ordered largest→smallest; last is the smallest, best for a thumbnail.
    image: a.images?.length ? a.images[a.images.length - 1].url : null,
    genres: a.genres ?? [],
    followers: a.followers?.total ?? 0,
    popularity: a.popularity ?? 0,
    externalUrl: a.external_urls?.spotify ?? null,
  }));

  return Response.json({ artists });
}

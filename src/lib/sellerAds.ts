// Shared localStorage-backed "fake backend" for the TELE ADs / Seller Ads
// demo app flows (login, campaign builder, dashboard). Ported from
// music_mandi-website's use of `localStorage['sellerAdsCampaign']` and
// `localStorage['sellerAdsAdvertiser']`. This is intentionally NOT a real
// backend — there is no server, no auth, no database. Everything here is
// fake/local, matching the source exactly.

export type SellerCampaign = {
  name: string;
  objective: string;
  start: string;
  end: string;
  budget: number;
  location: string;
  cities: string[];
  ageMin: number;
  ageMax: number;
  gender: string;
  sms: string;
  url: string;
  audio: boolean;
  audioName?: string;
  languages: string[];
  submitted?: boolean;
  submittedAt?: number;
};

export type Advertiser = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
};

export const CAMPAIGN_KEY = "sellerAdsCampaign";
export const ADVERTISER_KEY = "sellerAdsAdvertiser";

// Fired whenever this tab writes to the seller-ads keys, since the native
// `storage` event only fires in *other* tabs. Mirrors the pattern already
// used for the announcement-bar dismissal in SiteChrome.
export const SELLER_ADS_STORAGE_EVENT = "mm-seller-ads-storage-change";

function notify() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SELLER_ADS_STORAGE_EVENT));
}

// Small per-key read cache keyed on the raw string. This matters because
// these readers double as `getSnapshot` for `useSyncExternalStore`: React
// requires getSnapshot to return a *stable* reference when the underlying
// value hasn't changed, or it re-renders in an infinite loop. A naive
// `JSON.parse` on every call returns a new object each time even when the
// raw string is identical.
const cache = new Map<string, { raw: string | null; parsed: unknown }>();

function readCached<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  let raw: string | null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    return null;
  }
  const entry = cache.get(key);
  if (entry && entry.raw === raw) {
    return entry.parsed as T | null;
  }
  let parsed: T | null = null;
  if (raw) {
    try {
      parsed = JSON.parse(raw) as T;
    } catch {
      parsed = null;
    }
  }
  cache.set(key, { raw, parsed });
  return parsed;
}

export function readCampaign(): SellerCampaign | null {
  return readCached<SellerCampaign>(CAMPAIGN_KEY);
}

export function readAdvertiser(): Advertiser | null {
  return readCached<Advertiser>(ADVERTISER_KEY);
}

export function writeCampaign(campaign: SellerCampaign) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(campaign));
    notify();
  } catch {
    // ignore — matches the source's silent best-effort persistence
  }
}

export function writeAdvertiser(advertiser: Advertiser) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ADVERTISER_KEY, JSON.stringify(advertiser));
    notify();
  } catch {
    // ignore
  }
}

// Seed data for the TELE ADs demo advertiser login, seeded only when no
// campaign is already saved.
export const DEMO_LOGIN_CAMPAIGN: SellerCampaign = {
  name: "September Reach Campaign",
  objective: "Awareness",
  start: "2026-09-12",
  end: "2026-09-19",
  budget: 650000,
  location: "Pakistan",
  cities: [],
  ageMin: 18,
  ageMax: 65,
  gender: "Everyone",
  sms: "New music is live. Listen now.",
  url: "https://musicmandi.example/listen",
  audio: true,
  audioName: "launch-spot-urdu.wav",
  languages: ["Urdu"],
  submitted: true,
  submittedAt: Date.now(),
};

export const DEMO_ADVERTISER: Advertiser = {
  name: "Demo Advertiser",
  email: "demo@musicmandi.pk",
  company: "Music Mandi Demo Brand",
  phone: "+92 300 0000000",
};

// Starting point for a brand-new campaign draft before anything is saved.
export const DEFAULT_DRAFT_CAMPAIGN: SellerCampaign = {
  name: "",
  objective: "Awareness",
  start: "2026-09-12",
  end: "2026-09-19",
  budget: 250000,
  location: "Pakistan",
  cities: [],
  ageMin: 18,
  ageMax: 65,
  gender: "Everyone",
  sms: "",
  url: "",
  audio: false,
  languages: ["Urdu"],
};

export function formatPKR(n: number): string {
  return "PKR " + Math.round(Number(n) || 0).toLocaleString("en-PK");
}

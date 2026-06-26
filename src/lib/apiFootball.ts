// src/lib/apiFootball.ts
//
// Thin client around the API-Football v3 REST API, with in-memory
// caching so we don't blow through the free tier's 100 requests/day.
//
// Cache strategy:
//  - Live fixtures: cached for LIVE_TTL_MS (default 60s). Live data
//    changes fast but the free tier is request-limited, so we only
//    poll API-Football when our cache is stale, regardless of how
//    often the browser asks us.
//  - Fixtures / standings (non-live): cached far longer, since
//    schedules and tables don't change minute to minute.
//
// IMPORTANT: this file runs server-side only (Next.js API routes / RSC).
// The API key is read from process.env and is never sent to the browser.

const BASE_URL = 'https://v3.football.api-sports.io';

type CacheEntry<T> = { data: T; expiresAt: number };
const cache = new Map<string, CacheEntry<unknown>>();

const LIVE_TTL_MS = 60_000; // 1 minute
const FIXTURES_TTL_MS = 10 * 60_000; // 10 minutes
const STANDINGS_TTL_MS = 60 * 60_000; // 1 hour

function getApiKey(): string {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key || key === 'your_key_here') {
    throw new ApiKeyMissingError();
  }
  return key;
}

export class ApiKeyMissingError extends Error {
  constructor() {
    super(
      'API_FOOTBALL_KEY is not set. Add it to .env.local — see .env.local.example.'
    );
    this.name = 'ApiKeyMissingError';
  }
}

export class ApiFootballError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiFootballError';
    this.status = status;
  }
}

async function fetchFromApi<T>(
  path: string,
  params: Record<string, string | number | undefined>,
  ttlMs: number
): Promise<T> {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) search.set(k, String(v));
  });
  const cacheKey = `${path}?${search.toString()}`;

  const cached = cache.get(cacheKey) as CacheEntry<T> | undefined;
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const apiKey = getApiKey();
  const url = `${BASE_URL}${path}${search.toString() ? `?${search}` : ''}`;

  const res = await fetch(url, {
    headers: { 'x-apisports-key': apiKey },
    // Next.js fetch cache is separate from our in-memory cache; disable
    // it so our own TTL logic is the single source of truth.
    cache: 'no-store'
  });

  if (res.status === 429) {
    // Daily quota exceeded. Serve stale cache if we have it rather than
    // erroring out the whole page.
    if (cached) return cached.data;
    throw new ApiFootballError(
      'Daily request quota exceeded for API-Football free tier (100/day).',
      429
    );
  }

  if (!res.ok) {
    if (cached) return cached.data;
    throw new ApiFootballError(`API-Football request failed: ${res.status}`, res.status);
  }

  const json = await res.json();

  if (json.errors && Object.keys(json.errors).length > 0) {
    if (cached) return cached.data;
    throw new ApiFootballError(
      `API-Football returned errors: ${JSON.stringify(json.errors)}`
    );
  }

  const data = json.response as T;
  cache.set(cacheKey, { data, expiresAt: Date.now() + ttlMs });
  return data;
}

// ---- Public, typed helpers ----

export interface FixtureTeam {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

export interface FixtureResponse {
  fixture: {
    id: number;
    date: string;
    status: { long: string; short: string; elapsed: number | null };
  };
  league: {
    id: number;
    name: string;
    logo: string;
    round: string;
  };
  teams: { home: FixtureTeam; away: FixtureTeam };
  goals: { home: number | null; away: number | null };
}

/** Fixtures for a given date (YYYY-MM-DD), optionally filtered by league. */
export async function getFixturesByDate(
  date: string,
  leagueId?: number,
  season?: number
) {
  const isToday = date === new Date().toISOString().slice(0, 10);
  return fetchFromApi<FixtureResponse[]>(
    '/fixtures',
    { date, league: leagueId, season },
    isToday ? LIVE_TTL_MS : FIXTURES_TTL_MS
  );
}

/** A single fixture by its API-Football fixture ID. */
export async function getFixtureById(id: number) {
  return fetchFromApi<FixtureResponse[]>('/fixtures', { id }, LIVE_TTL_MS);
}

/** Currently live fixtures, optionally filtered by league IDs (comma-joined). */
export async function getLiveFixtures(leagueIds?: number[]) {
  return fetchFromApi<FixtureResponse[]>(
    '/fixtures',
    { live: leagueIds && leagueIds.length ? leagueIds.join('-') : 'all' },
    LIVE_TTL_MS
  );
}

export interface FixtureEvent {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string };
  player: { id: number | null; name: string };
  assist: { id: number | null; name: string | null };
  type: string; // Goal | Card | subst | Var
  detail: string;
  comments: string | null;
}

export async function getFixtureEvents(fixtureId: number) {
  return fetchFromApi<FixtureEvent[]>(
    '/fixtures/events',
    { fixture: fixtureId },
    LIVE_TTL_MS
  );
}

export interface FixtureLineup {
  team: { id: number; name: string; logo: string; colors: unknown };
  formation: string;
  startXI: { player: { id: number; name: string; number: number; pos: string } }[];
  substitutes: { player: { id: number; name: string; number: number; pos: string } }[];
  coach: { id: number; name: string };
}

export async function getFixtureLineups(fixtureId: number) {
  return fetchFromApi<FixtureLineup[]>(
    '/fixtures/lineups',
    { fixture: fixtureId },
    FIXTURES_TTL_MS
  );
}

export interface FixtureStatistic {
  team: { id: number; name: string };
  statistics: { type: string; value: number | string | null }[];
}

export async function getFixtureStatistics(fixtureId: number) {
  return fetchFromApi<FixtureStatistic[]>(
    '/fixtures/statistics',
    { fixture: fixtureId },
    LIVE_TTL_MS
  );
}

export interface StandingRow {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  form: string;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
}

export async function getStandings(leagueId: number, season: number) {
  const data = await fetchFromApi<{ league: { standings: StandingRow[][] } }[]>(
    '/standings',
    { league: leagueId, season },
    STANDINGS_TTL_MS
  );
  return data?.[0]?.league?.standings?.[0] ?? [];
}

/** Common league IDs for convenience (API-Football v3 IDs). */
export const LEAGUE_IDS = {
  premierLeague: 39,
  championsLeague: 2,
  worldCup: 1,
  laLiga: 140,
  serieA: 135,
  bundesliga: 78,
  ligue1: 61
} as const;

export async function getFixturesByLeague(leagueId: number, season: number) {
  return fetchFromApi<any[]>(
    '/fixtures',
    { league: leagueId, season },
    FIXTURES_TTL_MS
  );
}

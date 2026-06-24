# ScorePulse — live football scores (real data)

A Next.js rebuild of the ScorePulse demo, now backed by **real live football
data** from [API-Football](https://www.api-football.com/) instead of mock
JSON. Your API key stays server-side; the browser only ever talks to your
own `/api/...` routes.

## 1. Get a free API key

1. Go to **https://dashboard.api-football.com/register** and sign up (no credit card).
2. On the dashboard, find your key under **Profile → API Keys**.
3. Free tier: **100 requests/day**, but it includes live scores, events,
   lineups, and stats — every endpoint this app uses.

## 2. Configure your key

```bash
cp .env.local.example .env.local
```

Open `.env.local` and paste your key:

```
API_FOOTBALL_KEY=your_real_key_here
```

`.env.local` is already git-ignored — it will never get committed or
exposed to the browser.

## 3. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## 4. Deploy (Vercel)

```bash
npm install -g vercel   # if you don't have it
vercel
```

When prompted, add an environment variable:
- Name: `API_FOOTBALL_KEY`
- Value: your real key
- Scope: Production (and Preview, if you want previews to work too)

Or set it after deploying, in the Vercel dashboard:
**Project → Settings → Environment Variables**, then redeploy.

## How the free tier is respected

API-Football's free plan caps you at 100 requests/day. To stay well under
that with multiple users polling the page:

- `src/lib/apiFootball.ts` caches every upstream response **server-side**,
  in memory, with different TTLs:
  - Live/today fixtures: 60 seconds
  - Past/future fixtures: 10 minutes
  - Standings: 1 hour
- The browser polls your own `/api/scores` every 20 seconds, but that only
  costs you a real API-Football request once the cache for that exact
  query has actually expired — repeated polling and multiple visitors share
  the same cached result.
- If the daily quota is hit anyway (HTTP 429 from API-Football), the app
  serves the last cached data instead of breaking, and shows a small
  "daily quota reached" notice in the UI rather than an error.

**Note on serverless deploys:** Vercel's serverless functions don't share
memory across separate function instances long-term, so the in-memory
cache resets more often than on a single persistent server. For a
production deployment with real traffic, swap the `Map` in
`apiFootball.ts` for a shared store (e.g. Vercel KV, Upstash Redis) — the
function signatures are designed so that's a small, contained change.

## Project structure

```
src/
  app/
    page.tsx                     — main app shell / view switcher
    layout.tsx                   — root HTML layout, fonts
    api/
      scores/route.ts            — fixtures by date / live / by id
      standings/route.ts         — league table
      fixture/[id]/events/       — match timeline
      fixture/[id]/lineups/      — starting XI + subs
      fixture/[id]/statistics/   — possession, shots, etc.
  components/
    AppFrame.tsx                 — header, tab nav, footer
    AppProviders.tsx             — language + theme context
    MatchRow.tsx, MatchDetail.tsx, StandingsTable.tsx, ...
    views/
      LiveView.tsx, FixturesView.tsx, StandingsView.tsx
  lib/
    apiFootball.ts               — API-Football client + cache (server-only)
    normalize.ts                 — maps raw API shapes → UI types
    i18n.ts                      — EN / FR / AR translations
    useScores.ts, useFixture.ts  — client data-fetching hooks
  styles/globals.css             — ported from the original design
```

## What's different from the static demo

- Real fixtures, scores, lineups, events, and standings — no more
  hardcoded `data.js`, and no more match-detail pages missing data for
  matches other than `m1`/`m5`.
- Loading skeletons while real network requests are in flight.
- Error and "quota exceeded" banners, since a real API can fail or
  rate-limit in ways mock data never did.
- Default league for Standings is Premier League; switch via the dropdown.
  Add more leagues in `src/components/views/StandingsView.tsx`
  (`LEAGUE_OPTIONS`) or `src/lib/leagues.ts`.

## Known limitations to be aware of

- **Season parameter**: API-Football ties standings/fixtures to a season
  year. `.env.local.example` defaults to `2025`; update
  `NEXT_PUBLIC_DEFAULT_SEASON` once you know which season is current for
  the leagues you care about.
- **Status codes**: the live/HT/FT mapping in `src/lib/normalize.ts` is
  based on API-Football's documented codes (NS, 1H, HT, 2H, FT, ...).
  Worth a quick sanity check against a real live match once your key is
  active, in case anything's changed since this was written.
- **TheSportsDB/other providers**: this app is wired specifically to
  API-Football's response shapes. Swapping providers later means mainly
  editing `src/lib/apiFootball.ts` and `src/lib/normalize.ts` — the rest
  of the app consumes the normalized `UiMatch`/`UiStandingRow` types and
  doesn't care where the data came from.

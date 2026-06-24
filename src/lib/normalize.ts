// src/lib/normalize.ts
//
// API-Football uses short status codes (NS, 1H, HT, 2H, FT, ...).
// This maps those onto the four statuses our UI actually styles for.
// Reference: https://www.api-football.com/documentation-v3#tag/Fixtures
//
// NOTE: these codes are stable and well-documented, but worth a quick
// sanity check against a real live fixture once your key is active —
// log the raw `fixture.status.short` once to confirm nothing's changed.

import type { FixtureResponse, StandingRow } from '@/lib/apiFootball';
import type { UiMatch, UiStandingRow, MatchStatus } from '@/lib/types';

const LIVE_CODES = new Set(['1H', '2H', 'ET', 'BT', 'P', 'INT']);
const HT_CODES = new Set(['HT']);
const FT_CODES = new Set(['FT', 'AET', 'PEN']);
const SCHEDULED_CODES = new Set(['TBD', 'NS']);
const POSTPONED_CODES = new Set(['PST', 'SUSP']);
const CANCELLED_CODES = new Set(['CANC', 'ABD', 'AWD', 'WO']);

function mapStatus(short: string): MatchStatus {
  if (LIVE_CODES.has(short)) return 'live';
  if (HT_CODES.has(short)) return 'ht';
  if (FT_CODES.has(short)) return 'ft';
  if (POSTPONED_CODES.has(short)) return 'postponed';
  if (CANCELLED_CODES.has(short)) return 'cancelled';
  return 'scheduled';
}

export function normalizeFixture(f: FixtureResponse): UiMatch {
  return {
    id: f.fixture.id,
    leagueId: f.league.id,
    leagueName: f.league.name,
    round: f.league.round,
    home: { id: f.teams.home.id, name: f.teams.home.name, logo: f.teams.home.logo },
    away: { id: f.teams.away.id, name: f.teams.away.name, logo: f.teams.away.logo },
    homeScore: f.goals.home,
    awayScore: f.goals.away,
    status: mapStatus(f.fixture.status.short),
    minute: f.fixture.status.elapsed,
    kickoffIso: f.fixture.date
  };
}

export function normalizeStanding(row: StandingRow): UiStandingRow {
  return {
    rank: row.rank,
    team: { id: row.team.id, name: row.team.name, logo: row.team.logo },
    played: row.all.played,
    win: row.all.win,
    draw: row.all.draw,
    lose: row.all.lose,
    gf: row.all.goals.for,
    ga: row.all.goals.against,
    gd: row.goalsDiff,
    points: row.points,
    // API-Football returns form as a string like "WWDLW"; split to chars.
    form: row.form ? row.form.split('') : []
  };
}

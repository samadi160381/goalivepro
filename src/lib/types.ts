// src/lib/types.ts

export type MatchStatus = 'live' | 'ht' | 'ft' | 'scheduled' | 'postponed' | 'cancelled';

export interface UiMatch {
  id: number;
  leagueId: number;
  leagueName: string;
  round: string;
  home: { id: number; name: string; logo: string };
  away: { id: number; name: string; logo: string };
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  minute: number | null;
  kickoffIso: string;
}

export interface UiStandingRow {
  rank: number;
  team: { id: number; name: string; logo: string };
  played: number;
  win: number;
  draw: number;
  lose: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: string[];
}

export interface ApiErrorShape {
  error: 'missing_api_key' | 'upstream_error' | 'unknown_error';
  message: string;
}

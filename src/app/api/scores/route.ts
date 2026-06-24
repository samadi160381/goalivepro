// src/app/api/scores/route.ts
//
// GET /api/scores?date=YYYY-MM-DD&league=39
// GET /api/scores?live=1&league=39,2
//
// This route is what the browser actually calls. It talks to
// API-Football server-side (see src/lib/apiFootball.ts) so the
// API key never reaches the client, and so repeated client polling
// doesn't multiply our daily request quota — the lib's cache absorbs it.

import { NextRequest, NextResponse } from 'next/server';
import {
  getFixturesByDate,
  getLiveFixtures,
  getFixtureById,
  ApiKeyMissingError,
  ApiFootballError
} from '@/lib/apiFootball';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const live = searchParams.get('live');
  const date = searchParams.get('date');
  const leagueParam = searchParams.get('league');
  const idParam = searchParams.get('id');

  try {
    if (idParam) {
      const data = await getFixtureById(Number(idParam));
      return NextResponse.json({ fixtures: data });
    }

    if (live) {
      const leagueIds = leagueParam
        ? leagueParam.split(',').map((s) => Number(s.trim())).filter(Boolean)
        : undefined;
      const data = await getLiveFixtures(leagueIds);
      return NextResponse.json({ fixtures: data });
    }

    const targetDate = date || new Date().toISOString().slice(0, 10);
    const leagueId = leagueParam ? Number(leagueParam) : undefined;
    const data = await getFixturesByDate(targetDate, leagueId);
    return NextResponse.json({ fixtures: data });
  } catch (err) {
    return handleApiError(err);
  }
}

export function handleApiError(err: unknown) {
  if (err instanceof ApiKeyMissingError) {
    return NextResponse.json(
      { error: 'missing_api_key', message: err.message },
      { status: 503 }
    );
  }
  if (err instanceof ApiFootballError) {
    return NextResponse.json(
      { error: 'upstream_error', message: err.message },
      { status: err.status === 429 ? 429 : 502 }
    );
  }
  console.error(err);
  return NextResponse.json(
    { error: 'unknown_error', message: 'Something went wrong fetching live data.' },
    { status: 500 }
  );
}

import { NextRequest, NextResponse } from 'next/server';
import {
  getFixturesByDate,
  getLiveFixtures,
  getFixtureById,
  getFixturesByLeague,
  ApiKeyMissingError,
  ApiFootballError,
} from '@/lib/apiFootball';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const live = searchParams.get('live');
  const date = searchParams.get('date');
  const leagueParam = searchParams.get('league');
  const idParam = searchParams.get('id');
  const seasonParam = searchParams.get('season');

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
    if (leagueParam && seasonParam) {
      const data = await getFixturesByLeague(Number(leagueParam), Number(seasonParam));
      return NextResponse.json({ fixtures: data });
    }
    const targetDate = date || new Date().toISOString().slice(0, 10);
    const leagueId = leagueParam ? Number(leagueParam) : undefined;
    const data = await getFixturesByDate(targetDate, leagueId);
    return NextResponse.json({ fixtures: data });
  } catch (err) {
    if (err instanceof ApiKeyMissingError) {
      return NextResponse.json({ error: 'missing_api_key', message: (err as Error).message }, { status: 503 });
    }
    if (err instanceof ApiFootballError) {
      return NextResponse.json({ error: 'upstream_error', message: (err as Error).message }, { status: (err as ApiFootballError).status === 429 ? 429 : 502 });
    }
    return NextResponse.json({ error: 'unknown_error', message: 'Something went wrong.' }, { status: 500 });
  }
}
// src/app/api/fixture/[id]/lineups/route.ts
//
// GET /api/fixture/123456/lineups
// Returns starting XI + subs + formation for both teams in a fixture.

import { NextRequest, NextResponse } from 'next/server';
import { getFixtureLineups } from '@/lib/apiFootball';
import { handleApiError } from '@/app/api/scores/route';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const fixtureId = Number(params.id);
  if (!fixtureId) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 });
  }
  try {
    const lineups = await getFixtureLineups(fixtureId);
    return NextResponse.json({ lineups });
  } catch (err) {
    return handleApiError(err);
  }
}

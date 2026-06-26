// src/app/api/fixture/[id]/statistics/route.ts
//
// GET /api/fixture/123456/statistics
// Returns possession, shots, corners, fouls etc for both teams.

import { NextRequest, NextResponse } from 'next/server';
import { getFixtureStatistics } from '@/lib/apiFootball';
import { handleApiError } from '@/lib/apiErrors';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const fixtureId = Number(params.id);
  if (!fixtureId) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 });
  }
  try {
    const statistics = await getFixtureStatistics(fixtureId);
    return NextResponse.json({ statistics });
  } catch (err) {
    return handleApiError(err);
  }
}

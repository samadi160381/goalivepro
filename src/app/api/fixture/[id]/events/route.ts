// src/app/api/fixture/[id]/events/route.ts
//
// GET /api/fixture/123456/events
// Returns the match timeline (goals, cards, subs) for a single fixture.

import { NextRequest, NextResponse } from 'next/server';
import { getFixtureEvents } from '@/lib/apiFootball';
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
    const events = await getFixtureEvents(fixtureId);
    return NextResponse.json({ events });
  } catch (err) {
    return handleApiError(err);
  }
}

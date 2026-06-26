// src/app/api/standings/route.ts
//
// GET /api/standings?league=39&season=2025

import { NextRequest, NextResponse } from 'next/server';
import { getStandings } from '@/lib/apiFootball';
import { handleApiError } from '@/lib/apiErrors';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const league = Number(searchParams.get('league') || 39);
  const season = Number(
    searchParams.get('season') ||
      process.env.NEXT_PUBLIC_DEFAULT_SEASON ||
      new Date().getFullYear()
  );

  try {
    const standings = await getStandings(league, season);
    return NextResponse.json({ standings });
  } catch (err) {
    return handleApiError(err);
  }
}

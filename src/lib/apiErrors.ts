import { NextResponse } from 'next/server';
import { ApiKeyMissingError, ApiFootballError } from '@/lib/apiFootball';

export function handleApiError(err: unknown) {
  if (err instanceof ApiKeyMissingError) {
    return NextResponse.json({ error: 'missing_api_key', message: (err as Error).message }, { status: 503 });
  }
  if (err instanceof ApiFootballError) {
    return NextResponse.json({ error: 'upstream_error', message: (err as Error).message }, { status: (err as ApiFootballError).status === 429 ? 429 : 502 });
  }
  console.error(err);
  return NextResponse.json({ error: 'unknown_error', message: 'Something went wrong.' }, { status: 500 });
}
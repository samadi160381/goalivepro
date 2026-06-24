'use client';
// src/lib/useFixture.ts
//
// Fetches a single fixture by ID for the detail view. API-Football's
// /fixtures endpoint accepts an `id` param directly, so this hits our
// own /api/scores route is not quite right shape-wise — instead we
// add a tiny dedicated query param path through the same route.

import { useEffect, useState } from 'react';
import { normalizeFixture } from '@/lib/normalize';
import type { UiMatch } from '@/lib/types';
import type { FixtureResponse } from '@/lib/apiFootball';

export function useFixture(id: number | null) {
  const [match, setMatch] = useState<UiMatch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setMatch(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/scores?id=${id}`)
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(json.message || 'Could not load this match.');
          return;
        }
        const fixtures = json.fixtures as FixtureResponse[];
        setMatch(fixtures?.[0] ? normalizeFixture(fixtures[0]) : null);
      })
      .catch(() => {
        if (!cancelled) setError('Network error while loading this match.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { match, loading, error };
}

'use client';
// src/lib/useScores.ts
//
// Client-side hook that polls our own /api/scores route (never
// API-Football directly). Polling here is cheap: our server route
// caches upstream responses, so polling every 20s from the browser
// does not multiply real API-Football requests.

import { useEffect, useRef, useState } from 'react';
import type { UiMatch } from '@/lib/types';
import { normalizeFixture } from '@/lib/normalize';
import type { FixtureResponse } from '@/lib/apiFootball';

interface UseScoresResult {
  matches: UiMatch[];
  loading: boolean;
  error: string | null;
  quotaExceeded: boolean;
  refresh: () => void;
}

const POLL_MS = 20_000;

export function useScores(params: { date?: string; live?: boolean; league?: number }): UseScoresResult {
  const [matches, setMatches] = useState<UiMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const isFirstLoad = useRef(true);

  const { date, live, league } = params;

  async function load() {
    try {
      const search = new URLSearchParams();
      if (live) search.set('live', '1');
      if (date) search.set('date', date);
      if (league) search.set('league', String(league));

      const res = await fetch(`/api/scores?${search.toString()}`);
      const json = await res.json();

      if (res.status === 429) {
        setQuotaExceeded(true);
        if (json.fixtures) {
          setMatches((json.fixtures as FixtureResponse[]).map(normalizeFixture));
        }
        setError(null);
        return;
      }

      if (!res.ok) {
        setError(json.message || 'Failed to load scores.');
        return;
      }

      setQuotaExceeded(false);
      setError(null);
      setMatches((json.fixtures as FixtureResponse[]).map(normalizeFixture));
    } catch {
      setError('Network error while loading scores.');
    } finally {
      setLoading(false);
      isFirstLoad.current = false;
    }
  }

  useEffect(() => {
    setLoading(true);
    load();
    const interval = setInterval(load, POLL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, live, league]);

  return { matches, loading, error, quotaExceeded, refresh: load };
}

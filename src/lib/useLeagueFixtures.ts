"use client";

import { useEffect, useState } from "react";
import { normalizeFixture } from "@/lib/normalize";

const DEFAULT_SEASON = Number(process.env.NEXT_PUBLIC_DEFAULT_SEASON) || 2024;

export function useLeagueFixtures(leagueId: number, direction: string, count: number = 20) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/league/" + leagueId + "/fixtures?direction=" + direction + "&season=" + DEFAULT_SEASON + "&count=" + count);
      const json = await res.json();
      if (res.status === 429) {
        setQuotaExceeded(true);
        if (json.fixtures) setMatches(json.fixtures.map(normalizeFixture));
        return;
      }
        setError(json.message || "Could not load this league.");
        return;
      }
      setQuotaExceeded(false);
      setMatches(json.fixtures.map(normalizeFixture));
    } catch (e) {
      setError("Network error while loading this league.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(function() { load(); }, [leagueId, direction, count]);

  return { matches, loading, error, quotaExceeded, refresh: load };
}

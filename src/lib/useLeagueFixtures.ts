import { useState, useEffect, useCallback } from "react";
import { UiMatch } from "@/lib/types";
export interface LeagueFixturesState { upcoming: UiMatch[]; results: UiMatch[]; live: UiMatch[]; loading: boolean; error: string | null; refresh: () => void; }
function isLive(m: UiMatch): boolean { return m.status === "live" || m.status === "ht"; }
function isFinished(m: UiMatch): boolean { return m.status === "ft"; }
export function useLeagueFixtures(leagueId: number | null, season: number | string = 2024): LeagueFixturesState {
  const [upcoming, setUpcoming] = useState<UiMatch[]>([]);
  const [results, setResults] = useState<UiMatch[]>([]);
  const [live, setLive] = useState<UiMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);
  useEffect(() => {
    if (leagueId === null) return;
    let cancelled = false;
    setLoading(true); setError(null);
    fetch(`/api/scores?league=${leagueId}&season=${season}`)
      .then(async (res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then((data) => {
        if (cancelled) return;
        const all: UiMatch[] = data.matches ?? data.fixtures ?? data.response ?? [];
        setLive(all.filter(isLive));
        setResults(all.filter(isFinished).sort((a, b) => new Date(b.kickoffIso).getTime() - new Date(a.kickoffIso).getTime()));
        setUpcoming(all.filter((m) => !isLive(m) && !isFinished(m)).sort((a, b) => new Date(a.kickoffIso).getTime() - new Date(b.kickoffIso).getTime()));
        setLoading(false);
      })
      .catch((err: Error) => { if (cancelled) return; setError(err.message); setLoading(false); });
    return () => { cancelled = true; };
  }, [leagueId, season, tick]);
  return { upcoming, results, live, loading, error, refresh };
}

'use client';
// src/components/views/StandingsView.tsx

import { useEffect, useState } from 'react';
import { useApp } from '@/components/AppProviders';
import { StandingsTable } from '@/components/StandingsTable';
import { Banner } from '@/components/Banner';
import { normalizeStanding } from '@/lib/normalize';
import type { UiStandingRow } from '@/lib/types';
import type { StandingRow } from '@/lib/apiFootball';

const LEAGUE_OPTIONS = [
  { id: 39, label: 'Premier League' },
  { id: 140, label: 'La Liga' },
  { id: 135, label: 'Serie A' },
  { id: 78, label: 'Bundesliga' },
  { id: 61, label: 'Ligue 1' },
  { id: 2, label: 'Champions League' }
];

const DEFAULT_SEASON = Number(process.env.NEXT_PUBLIC_DEFAULT_SEASON) || new Date().getFullYear();

export function StandingsView() {
  const { t } = useApp();
  const [leagueId, setLeagueId] = useState(LEAGUE_OPTIONS[0].id);
  const [rows, setRows] = useState<UiStandingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/standings?league=${leagueId}&season=${DEFAULT_SEASON}`);
      const json = await res.json();
      if (res.status === 429) {
        setQuotaExceeded(true);
        if (json.standings) {
          setRows((json.standings as StandingRow[]).map(normalizeStanding));
        }
        return;
      }
      if (!res.ok) {
        setError(json.message || t('errorLoading'));
        return;
      }
      setQuotaExceeded(false);
      setRows((json.standings as StandingRow[]).map(normalizeStanding));
    } catch {
      setError(t('errorLoading'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagueId]);

  return (
    <div>
      <select
        className="lang-select"
        style={{ marginBottom: 14, width: '100%' }}
        value={leagueId}
        onChange={(e) => setLeagueId(Number(e.target.value))}
        aria-label={t('selectCompetition')}
      >
        {LEAGUE_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <Banner kind="error" message={t('errorLoading')} actionLabel={t('retry')} onAction={load} />}
      {!error && quotaExceeded && <Banner kind="notice" message={t('quotaExceeded')} />}

      {loading ? (
        <div className="empty-state">{t('loading')}</div>
      ) : (
        <StandingsTable rows={rows} />
      )}
    </div>
  );
}

export default StandingsView;

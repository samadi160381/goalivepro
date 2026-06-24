'use client';
// src/components/views/LiveView.tsx

import { useState } from 'react';
import { useScores } from '@/lib/useScores';
import { useApp } from '@/components/AppProviders';
import { DateStrip, dateKeyToIso, type DateKey } from '@/components/DateStrip';
import { CompetitionGroups } from '@/components/CompetitionGroups';
import { MatchListSkeleton } from '@/components/MatchRowSkeleton';
import { Banner } from '@/components/Banner';

export function LiveView({ onOpenMatch }: { onOpenMatch: (id: number) => void }) {
  const { t } = useApp();
  const [dateKey, setDateKey] = useState<DateKey>('today');
  const isToday = dateKey === 'today';

  const { matches, loading, error, quotaExceeded, refresh } = useScores({
    date: dateKeyToIso(dateKey),
    live: false
  });

  return (
    <div>
      <DateStrip active={dateKey} onChange={setDateKey} />

      {error && <Banner kind="error" message={t('errorLoading')} actionLabel={t('retry')} onAction={refresh} />}
      {!error && quotaExceeded && <Banner kind="notice" message={t('quotaExceeded')} />}

      {isToday && matches.some((m) => m.status === 'live') && (
        <div className="live-pill" style={{ marginBottom: 10 }}>
          <span className="pulse-dot" /> Live now
        </div>
      )}

      {loading ? (
        <>
          <MatchListSkeleton rows={2} />
          <MatchListSkeleton rows={3} />
        </>
      ) : (
        <CompetitionGroups matches={matches} onOpenMatch={onOpenMatch} />
      )}
    </div>
  );
}

'use client';
// src/components/views/FixturesView.tsx

import { useState } from 'react';
import { useScores } from '@/lib/useScores';
import { useApp } from '@/components/AppProviders';
import { CompetitionGroups } from '@/components/CompetitionGroups';
import { MatchListSkeleton } from '@/components/MatchRowSkeleton';
import { Banner } from '@/components/Banner';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons';
import { toLocalDateString } from '@/components/DateStrip';

function isoOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toLocalDateString(d);
}

function formatHeading(iso: string, lang: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(lang === 'ar' ? 'ar' : lang === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

export function FixturesView({ onOpenMatch }: { onOpenMatch: (id: number) => void }) {
  const { t, lang, dir } = useApp();
  const [offset, setOffset] = useState(0);
  const date = isoOffset(offset);

  const { matches, loading, error, quotaExceeded, refresh } = useScores({ date });

  return (
    <div>
      <div className="date-strip" style={{ alignItems: 'center', gap: 8 }}>
        <button className="date-chip" onClick={() => setOffset((o) => o - 1)} aria-label="Previous day">
          {dir === 'rtl' ? <ArrowRightIcon size={14} /> : <ArrowLeftIcon size={14} />}
        </button>
        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-soft)', flex: 1, textAlign: 'center' }}>
          {formatHeading(date, lang)}
        </span>
        <button className="date-chip" onClick={() => setOffset((o) => o + 1)} aria-label="Next day">
          {dir === 'rtl' ? <ArrowLeftIcon size={14} /> : <ArrowRightIcon size={14} />}
        </button>
      </div>

      {error && <Banner kind="error" message={t('errorLoading')} actionLabel={t('retry')} onAction={refresh} />}
      {!error && quotaExceeded && <Banner kind="notice" message={t('quotaExceeded')} />}

      {loading ? (
        <>
          <MatchListSkeleton rows={2} />
          <MatchListSkeleton rows={2} />
        </>
      ) : (
        <CompetitionGroups matches={matches} onOpenMatch={onOpenMatch} />
      )}
    </div>
  );
}

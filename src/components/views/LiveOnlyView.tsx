'use client';
import { useApp } from '@/components/AppProviders';
import { CompetitionGroups } from '@/components/CompetitionGroups';
import { MatchListSkeleton } from '@/components/MatchRowSkeleton';
import { Banner } from '@/components/Banner';
import { useScores } from '@/lib/useScores';

export function LiveOnlyView({ onOpenMatch }: { onOpenMatch: (id: number) => void }) {
  const { t } = useApp();
  const { matches, loading, error, quotaExceeded, refresh } = useScores({ live: true });

  return (
    <div>
      {error && <Banner kind='error' message={t('errorLoading')} actionLabel={t('retry')} onAction={refresh} />}
      {loading ? (
        <MatchListSkeleton />
      ) : matches.length === 0 ? (
        <div className='empty-state'>No live matches right now</div>
      ) : (
        <CompetitionGroups matches={matches} onOpenMatch={onOpenMatch} />
      )}
    </div>
  );
}

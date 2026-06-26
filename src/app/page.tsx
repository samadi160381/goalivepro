'use client';
// src/app/page.tsx

import { useState } from 'react';
import { AppFrame, type TabKey } from '@/components/AppFrame';
import { LiveView } from '@/components/views/LiveView';
import { FixturesView } from '@/components/views/FixturesView';
import { StandingsView } from '@/components/views/StandingsView';
import { MatchDetail } from '@/components/MatchDetail';
import { useFixture } from '@/lib/useFixture';
import { useApp } from '@/components/AppProviders';

export default function Home() {
  const [tab, setTab] = useState<TabKey>('live');
  const [openMatchId, setOpenMatchId] = useState<number | null>(null);
  const { t } = useApp();

  const { match, loading, error } = useFixture(openMatchId);

  function handleTabChange(next: TabKey) {
    setOpenMatchId(null);
    setTab(next);
  }

  if (openMatchId !== null) {
    if (loading || !match) {
      return (
        <AppFrame activeTab={tab} onTabChange={handleTabChange}>
          <div className="empty-state">{error ?? t('loading')}</div>
        </AppFrame>
      );
    }
    return (
      <AppFrame activeTab={tab} onTabChange={handleTabChange}>
        <MatchDetail match={match} onBack={() => setOpenMatchId(null)} />
      </AppFrame>
    );
  }

  return (
    <AppFrame activeTab={tab} onTabChange={handleTabChange}>
      {tab === 'live' && <LiveView onOpenMatch={setOpenMatchId} />}
      {tab === 'today' && <FixturesView onOpenMatch={setOpenMatchId} today={true} />}
      {tab === 'fixtures' && <FixturesView onOpenMatch={setOpenMatchId} />}
      {tab === 'standings' && <StandingsView />}
    </AppFrame>
  );
}

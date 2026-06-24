'use client';
// src/components/CompetitionGroups.tsx

import { useState } from 'react';
import { useApp } from '@/components/AppProviders';
import { MatchRow } from '@/components/MatchRow';
import { TrophyIcon, StarIcon, ShieldIcon, ChevronDownIcon, CalendarOffIcon } from '@/components/icons';
import { iconForLeague } from '@/lib/leagues';
import type { UiMatch } from '@/lib/types';

function CompIcon({ leagueId, size = 13 }: { leagueId: number; size?: number }) {
  const key = iconForLeague(leagueId);
  if (key === 'trophy') return <TrophyIcon size={size} />;
  if (key === 'star') return <StarIcon size={size} />;
  return <ShieldIcon size={size} />;
}

export function CompetitionGroups({
  matches,
  onOpenMatch
}: {
  matches: UiMatch[];
  onOpenMatch: (id: number) => void;
}) {
  const { t } = useApp();
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  if (matches.length === 0) {
    return (
      <div className="empty-state">
        <CalendarOffIcon size={26} style={{ display: 'block', margin: '0 auto 8px' }} />
        {t('noMatches')}
      </div>
    );
  }

  const groups = new Map<number, UiMatch[]>();
  matches.forEach((m) => {
    if (!groups.has(m.leagueId)) groups.set(m.leagueId, []);
    groups.get(m.leagueId)!.push(m);
  });

  function toggle(id: number) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      {Array.from(groups.entries()).map(([leagueId, ms]) => {
        const isCollapsed = collapsed.has(leagueId);
        return (
          <div className={`comp-group ${isCollapsed ? 'collapsed' : ''}`} key={leagueId}>
            <div className="comp-header" onClick={() => toggle(leagueId)}>
              <div className="comp-crest">
                <CompIcon leagueId={leagueId} />
              </div>
              <div className="comp-name">{ms[0].leagueName}</div>
              <div className="comp-round">{ms[0].round}</div>
              <span className="comp-chevron">
                <ChevronDownIcon size={13} />
              </span>
            </div>
            <div className="match-list">
              {ms.map((m) => (
                <MatchRow key={m.id} match={m} onOpen={onOpenMatch} />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

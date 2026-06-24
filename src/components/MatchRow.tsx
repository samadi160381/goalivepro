'use client';
// src/components/MatchRow.tsx

import { useApp } from '@/components/AppProviders';
import { TeamCrest } from '@/components/TeamCrest';
import type { UiMatch } from '@/lib/types';

function StatusBlock({ m }: { m: UiMatch }) {
  const { t } = useApp();
  if (m.status === 'live') {
    return (
      <div className="status-live">
        <span className="pulse-dot" aria-hidden="true" />
        <span className="live-minute">{m.minute ?? ''}&apos;</span>
      </div>
    );
  }
  if (m.status === 'ht') {
    return (
      <div className="status-live">
        <span className="live-minute" style={{ color: 'var(--text-soft)' }}>
          {t('statusHT')}
        </span>
      </div>
    );
  }
  if (m.status === 'ft') {
    return <div className="status-ft">{t('statusFT')}</div>;
  }
  if (m.status === 'postponed' || m.status === 'cancelled') {
    return <div className="status-ft">{m.status === 'postponed' ? 'PST' : 'CANC'}</div>;
  }
  const time = new Date(m.kickoffIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return <div className="status-time">{time}</div>;
}

function ScoreBlock({ m }: { m: UiMatch }) {
  if (m.status === 'scheduled' || m.status === 'postponed' || m.status === 'cancelled') {
    return (
      <div className="score-box">
        <span className="score-dash">–</span>
        <span className="score-dash">–</span>
      </div>
    );
  }
  const liveClass = m.status === 'live' || m.status === 'ht' ? 'live' : '';
  return (
    <div className="score-box">
      <span className={`score-num ${liveClass}`}>{m.homeScore}</span>
      <span className={`score-num ${liveClass}`}>{m.awayScore}</span>
    </div>
  );
}

export function MatchRow({ match, onOpen }: { match: UiMatch; onOpen: (id: number) => void }) {
  const homeWin = match.status === 'ft' && match.homeScore !== null && match.homeScore > (match.awayScore ?? -1);
  const awayWin = match.status === 'ft' && match.awayScore !== null && match.awayScore > (match.homeScore ?? -1);

  return (
    <div
      className="match-row"
      role="button"
      tabIndex={0}
      aria-label={`${match.home.name} vs ${match.away.name}`}
      onClick={() => onOpen(match.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(match.id);
        }
      }}
    >
      <StatusBlock m={match} />
      <div className="teams">
        <div className="team-line">
          <TeamCrest name={match.home.name} logo={match.home.logo} />
          <span className={`team-name ${homeWin ? 'winner' : ''}`}>{match.home.name}</span>
        </div>
        <div className="team-line">
          <TeamCrest name={match.away.name} logo={match.away.logo} />
          <span className={`team-name ${awayWin ? 'winner' : ''}`}>{match.away.name}</span>
        </div>
      </div>
      <ScoreBlock m={match} />
    </div>
  );
}

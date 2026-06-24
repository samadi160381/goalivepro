'use client';
// src/components/MatchDetail.tsx

import { useEffect, useState } from 'react';
import { useApp } from '@/components/AppProviders';
import { TeamCrest } from '@/components/TeamCrest';
import { ArrowLeftIcon, ArrowRightIcon, SubIcon, WhistleIcon, CardIcon } from '@/components/icons';
import type { UiMatch } from '@/lib/types';
import type { FixtureEvent, FixtureLineup, FixtureStatistic } from '@/lib/apiFootball';

type DetailTab = 'timeline' | 'lineups' | 'stats';

export function MatchDetail({ match, onBack }: { match: UiMatch; onBack: () => void }) {
  const { t, dir } = useApp();
  const [tab, setTab] = useState<DetailTab>('timeline');
  const [events, setEvents] = useState<FixtureEvent[] | null>(null);
  const [lineups, setLineups] = useState<FixtureLineup[] | null>(null);
  const [stats, setStats] = useState<FixtureStatistic[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    async function loadTab() {
      try {
        if (tab === 'timeline' && events === null) {
          const res = await fetch(`/api/fixture/${match.id}/events`);
          const json = await res.json();
          if (!cancelled) {
            if (!res.ok) setError(json.message || t('errorLoading'));
            else setEvents(json.events ?? []);
          }
        } else if (tab === 'lineups' && lineups === null) {
          const res = await fetch(`/api/fixture/${match.id}/lineups`);
          const json = await res.json();
          if (!cancelled) {
            if (!res.ok) setError(json.message || t('errorLoading'));
            else setLineups(json.lineups ?? []);
          }
        } else if (tab === 'stats' && stats === null) {
          const res = await fetch(`/api/fixture/${match.id}/statistics`);
          const json = await res.json();
          if (!cancelled) {
            if (!res.ok) setError(json.message || t('errorLoading'));
            else setStats(json.statistics ?? []);
          }
        }
      } catch {
        if (!cancelled) setError(t('errorLoading'));
      }
    }
    loadTab();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, match.id]);

  const statusClass = match.status === 'live' || match.status === 'ht' ? 'live' : match.status === 'ft' ? 'ft' : 'scheduled';
  const statusText =
    match.status === 'live'
      ? `${match.minute ?? ''}'`
      : match.status === 'ht'
      ? t('statusHT')
      : match.status === 'ft'
      ? t('statusFT')
      : new Date(match.kickoffIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const scoreDisplay =
    match.homeScore === null ? '– – –' : `${match.homeScore} – ${match.awayScore}`;

  return (
    <div>
      <div className="detail-back" role="button" tabIndex={0} onClick={onBack}>
        {dir === 'rtl' ? <ArrowRightIcon size={15} /> : <ArrowLeftIcon size={15} />} {t('backToMatches')}
      </div>

      <div className="detail-header">
        <div className="detail-comp">
          {match.leagueName} · {match.round}
        </div>
        <div className="detail-scoreline">
          <div className="detail-team">
            <TeamCrest name={match.home.name} logo={match.home.logo} variant="detail" size={48} />
            <span className="detail-team-name">{match.home.name}</span>
          </div>
          <div className="detail-score">
            <div className="detail-score-nums">{scoreDisplay}</div>
            <div className={`detail-status-pill ${statusClass}`}>{statusText}</div>
          </div>
          <div className="detail-team">
            <TeamCrest name={match.away.name} logo={match.away.logo} variant="detail" size={48} />
            <span className="detail-team-name">{match.away.name}</span>
          </div>
        </div>
      </div>

      <div className="detail-tabs">
        <button className={`detail-tab ${tab === 'timeline' ? 'active' : ''}`} onClick={() => setTab('timeline')}>
          {t('tabTimeline')}
        </button>
        <button className={`detail-tab ${tab === 'lineups' ? 'active' : ''}`} onClick={() => setTab('lineups')}>
          {t('tabLineups')}
        </button>
        <button className={`detail-tab ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>
          {t('tabStats')}
        </button>
      </div>

      {error && <div className="empty-state">{error}</div>}

      {!error && tab === 'timeline' && <TimelineTab events={events} />}
      {!error && tab === 'lineups' && <LineupsTab lineups={lineups} home={match.home.name} away={match.away.name} />}
      {!error && tab === 'stats' && <StatsTab stats={stats} />}
    </div>
  );
}

function eventIcon(type: string) {
  const lower = type.toLowerCase();
  if (lower === 'goal') return <span style={{ color: 'var(--positive)' }}>⚽</span>;
  if (lower === 'card') return <CardIcon size={11} />;
  if (lower === 'subst') return <SubIcon size={14} />;
  return <WhistleIcon size={14} />;
}

function TimelineTab({ events }: { events: FixtureEvent[] | null }) {
  const { t } = useApp();
  if (events === null) return <div className="empty-state">{t('loading')}</div>;
  if (events.length === 0) return <div className="empty-state">{t('noMatches')}</div>;

  // API-Football returns events oldest-first; show most recent first.
  const sorted = [...events].sort((a, b) => {
    const aMin = a.time.elapsed + (a.time.extra ?? 0) / 100;
    const bMin = b.time.elapsed + (b.time.extra ?? 0) / 100;
    return bMin - aMin;
  });

  return (
    <div className="timeline">
      {sorted.map((ev, i) => (
        <div className="timeline-event" key={i}>
          <div className="tl-minute">
            {ev.time.elapsed}
            {ev.time.extra ? `+${ev.time.extra}` : ''}&apos;
          </div>
          <div className="tl-desc">
            <span className="tl-icon">{eventIcon(ev.type)}</span>
            <span>
              {ev.detail}
              {ev.player.name ? ` — ${ev.player.name}` : ''}
            </span>
          </div>
          <div className="tl-side" />
        </div>
      ))}
    </div>
  );
}

function LineupsTab({
  lineups,
  home,
  away
}: {
  lineups: FixtureLineup[] | null;
  home: string;
  away: string;
}) {
  const { t } = useApp();
  if (lineups === null) return <div className="empty-state">{t('loading')}</div>;
  if (lineups.length === 0) return <div className="empty-state">{t('noMatches')}</div>;

  const [homeLineup, awayLineup] = lineups;

  return (
    <div className="lineup-grid">
      {[
        { label: home, data: homeLineup },
        { label: away, data: awayLineup }
      ].map(({ label, data }, idx) => (
        <div className="lineup-col" key={idx}>
          <h4>
            {label} · {t('starting11')} {data?.formation ? `(${data.formation})` : ''}
          </h4>
          {(data?.startXI ?? []).map(({ player }) => (
            <div className="lineup-player" key={player.id}>
              <span className="player-num">{player.number}</span>
              {player.name}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function StatsTab({ stats }: { stats: FixtureStatistic[] | null }) {
  const { t } = useApp();
  if (stats === null) return <div className="empty-state">{t('loading')}</div>;
  if (stats.length < 2) return <div className="empty-state">{t('noMatches')}</div>;

  const [homeStats, awayStats] = stats;

  function valueFor(team: FixtureStatistic, type: string): number {
    const found = team.statistics.find((s) => s.type === type);
    if (!found || found.value === null) return 0;
    if (typeof found.value === 'string') return parseFloat(found.value.replace('%', '')) || 0;
    return found.value;
  }

  const rows: { label: string; type: string; suffix?: string }[] = [
    { label: t('possession'), type: 'Ball Possession', suffix: '%' },
    { label: t('shots'), type: 'Total Shots' },
    { label: t('shotsOnTarget'), type: 'Shots on Goal' },
    { label: t('corners'), type: 'Corner Kicks' },
    { label: t('fouls'), type: 'Fouls' }
  ];

  return (
    <div>
      {rows.map(({ label, type, suffix }) => {
        const homeVal = valueFor(homeStats, type);
        const awayVal = valueFor(awayStats, type);
        const total = homeVal + awayVal || 1;
        const pct0 = Math.round((homeVal / total) * 100);
        return (
          <div key={type}>
            <div className="stat-row">
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span className="stat-val" style={{ textAlign: 'right', width: '100%' }}>
                  {homeVal}
                  {suffix ?? ''}
                </span>
              </div>
              <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-faint)' }}>{label}</div>
              <div>
                <span className="stat-val">
                  {awayVal}
                  {suffix ?? ''}
                </span>
              </div>
            </div>
            <div className="stat-bar-wrap" style={{ marginBottom: 10 }}>
              <div className="stat-bar" style={{ width: `${pct0}%` }} />
              <div className="stat-bar dim" style={{ width: `${100 - pct0}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

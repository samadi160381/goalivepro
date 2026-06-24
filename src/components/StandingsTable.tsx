'use client';
// src/components/StandingsTable.tsx

import { useApp } from '@/components/AppProviders';
import { TeamCrest } from '@/components/TeamCrest';
import type { UiStandingRow } from '@/lib/types';

function zoneForRank(rank: number, total: number): 'qualify' | 'relegate' | null {
  if (rank <= Math.min(4, Math.ceil(total * 0.25))) return 'qualify';
  if (rank > total - Math.min(3, Math.ceil(total * 0.2))) return 'relegate';
  return null;
}

export function StandingsTable({ rows }: { rows: UiStandingRow[] }) {
  const { t } = useApp();

  if (rows.length === 0) {
    return <div className="empty-state">{t('noMatches')}</div>;
  }

  return (
    <>
      <table className="standings-table">
        <thead>
          <tr>
            <th>{t('posLabel')}</th>
            <th className="team-col">{t('teamLabel')}</th>
            <th>{t('pLabel')}</th>
            <th>{t('wLabel')}</th>
            <th>{t('dLabel')}</th>
            <th>{t('lLabel')}</th>
            <th>{t('gfLabel')}</th>
            <th>{t('gaLabel')}</th>
            <th>{t('gdLabel')}</th>
            <th>{t('ptsLabel')}</th>
            <th>{t('formLabel')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const zone = zoneForRank(r.rank, rows.length);
            return (
              <tr key={r.team.id}>
                <td>
                  <div className="pos-cell">
                    {zone && <span className={`pos-marker ${zone}`} />}
                    <span className="pos-num">{r.rank}</span>
                  </div>
                </td>
                <td className="team-col">
                  <TeamCrest name={r.team.name} logo={r.team.logo} size={18} />
                  {r.team.name}
                </td>
                <td>{r.played}</td>
                <td>{r.win}</td>
                <td>{r.draw}</td>
                <td>{r.lose}</td>
                <td>{r.gf}</td>
                <td>{r.ga}</td>
                <td>{r.gd}</td>
                <td className="pts-cell">{r.points}</td>
                <td>
                  <div className="form-dots">
                    {r.form.slice(-5).map((f, i) => (
                      <span key={i} className={`form-dot ${f.toLowerCase()}`} />
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="standings-legend">
        <span>
          <span className="legend-swatch" style={{ background: 'var(--positive)' }} />
          {t('legendQualify')}
        </span>
        <span>
          <span className="legend-swatch" style={{ background: 'var(--negative)' }} />
          {t('legendRelegate')}
        </span>
      </div>
    </>
  );
}

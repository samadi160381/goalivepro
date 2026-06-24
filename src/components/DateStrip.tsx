'use client';
// src/components/DateStrip.tsx

import { useApp } from '@/components/AppProviders';

export type DateKey = 'yesterday' | 'today' | 'tomorrow';

const LABELS: Record<DateKey, { en: string; fr: string; ar: string }> = {
  yesterday: { en: 'Yesterday', fr: 'Hier', ar: 'أمس' },
  today: { en: 'Today', fr: "Aujourd'hui", ar: 'اليوم' },
  tomorrow: { en: 'Tomorrow', fr: 'Demain', ar: 'غدًا' }
};

/**
 * Formats a Date as YYYY-MM-DD using the browser's LOCAL calendar day,
 * not UTC. toISOString() always converts to UTC first, which silently
 * shifts "today" to the wrong day for anyone not at UTC+0 (e.g. a match
 * at 9pm local time can land under "tomorrow" in UTC, or vice versa).
 */
export function toLocalDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function dateKeyToIso(key: DateKey): string {
  const d = new Date();
  if (key === 'yesterday') d.setDate(d.getDate() - 1);
  if (key === 'tomorrow') d.setDate(d.getDate() + 1);
  return toLocalDateString(d);
}

export function DateStrip({ active, onChange }: { active: DateKey; onChange: (k: DateKey) => void }) {
  const { lang } = useApp();
  const keys: DateKey[] = ['yesterday', 'today', 'tomorrow'];
  return (
    <div className="date-strip">
      {keys.map((k) => (
        <button
          key={k}
          className={`date-chip ${k === active ? 'active' : ''}`}
          onClick={() => onChange(k)}
        >
          {LABELS[k][lang]}
        </button>
      ))}
    </div>
  );
}

'use client';
// src/components/AppFrame.tsx

import { ReactNode } from 'react';
import { useApp } from '@/components/AppProviders';
import { MoonIcon, SunIcon } from '@/components/icons';
import type { Lang } from '@/lib/i18n';

export type TabKey = 'live' | 'fixtures' | 'standings';

export function AppFrame({
  activeTab,
  onTabChange,
  children
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  children: ReactNode;
}) {
  const { t, lang, setLang, theme, toggleTheme } = useApp();

  return (
    <div className="app">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true" />
          <div className="brand-name">
            Score<span>Pulse</span>
          </div>
        </div>
        <div className="top-controls">
          <select
            className="lang-select"
            aria-label="Language"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="ar">AR</option>
          </select>
          <button className="icon-btn" aria-label="Toggle dark mode" onClick={toggleTheme}>
            {theme === 'light' ? <MoonIcon size={16} /> : <SunIcon size={16} />}
          </button>
        </div>
      </header>

      <nav className="tabnav">
        <button className={`tab ${activeTab === 'live' ? 'active' : ''}`} onClick={() => onTabChange('live')}>
          {t('tabLive')}
        </button>
        <button className={`tab ${activeTab === 'fixtures' ? 'active' : ''}`} onClick={() => onTabChange('fixtures')}>
          {t('tabFixtures')}
        </button>
        <button className={`tab ${activeTab === 'standings' ? 'active' : ''}`} onClick={() => onTabChange('standings')}>
          {t('tabStandings')}
        </button>
      </nav>

      <main className="main" id="main">
        {children}
      </main>

      <footer className="app-footer">{t('footerNote')}</footer>
    </div>
  );
}

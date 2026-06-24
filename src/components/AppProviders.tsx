'use client';
// src/components/AppProviders.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Lang } from '@/lib/i18n';
import { I18N, t as translate } from '@/lib/i18n';

type Theme = 'light' | 'dark';

interface AppCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: keyof typeof I18N.en) => string;
  dir: 'ltr' | 'rtl';
}

const Ctx = createContext<AppCtx | null>(null);

export function useApp(): AppCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside AppProviders');
  return ctx;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const [theme, setTheme] = useState<Theme>('light');

  // Restore preferences on mount (client-only; no SSR mismatch since
  // we render a stable default first, then patch after hydration).
  useEffect(() => {
    const storedLang = window.localStorage.getItem('sp_lang') as Lang | null;
    const storedTheme = window.localStorage.getItem('sp_theme') as Theme | null;
    if (storedLang && I18N[storedLang]) setLangState(storedLang);
    if (storedTheme === 'dark' || storedTheme === 'light') setTheme(storedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = I18N[lang].dir;
  }, [lang]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  function setLang(l: Lang) {
    setLangState(l);
    window.localStorage.setItem('sp_lang', l);
  }

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    window.localStorage.setItem('sp_theme', next);
  }

  const value: AppCtx = {
    lang,
    setLang,
    theme,
    toggleTheme,
    t: (key) => translate(lang, key),
    dir: I18N[lang].dir
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

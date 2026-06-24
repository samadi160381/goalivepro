// src/app/layout.tsx

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppProviders } from '@/components/AppProviders';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'ScorePulse — Live football scores',
  description: 'Live scores, fixtures, and standings powered by API-Football.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Expanded:wght@600;700;800&family=Inter:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@400;600;700&family=JetBrains+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body data-theme="light">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
